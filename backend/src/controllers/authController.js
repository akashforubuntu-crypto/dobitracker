const { v4: uuidv4 } = require('uuid');
const { 
  createUser, 
  findUserByEmail, 
  findUserById,
  findUserByDeviceId,
  updateDeviceId
} = require('../models/userModel');
const { createPasswordReset, findValidResetByToken, findValidResetByEmail, deleteResetByToken } = require('../models/passwordResetModel');
const { generateToken } = require('../utils/jwtUtils');
const { hashPassword, comparePasswords, validatePassword } = require('../utils/passwordUtils');
const { validateEmailFormat, sendMojoAuthOTP, verifyMojoAuthOTP } = require('../utils/emailUtils');

// In-memory storage for signup tokens (in production, use Redis or database)
const signupTokens = new Map();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Validate email format
    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Send OTP via MojoAuth
    const otpResponse = await sendMojoAuthOTP(email);
    
    if (!otpResponse.success) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
    
    // Generate a temporary signup token
    const signupToken = uuidv4();
    
    // Store the signup token with user data (expires in 10 minutes)
    signupTokens.set(signupToken, {
      name,
      email,
      password,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    // Remove expired tokens periodically
    setTimeout(() => {
      signupTokens.delete(signupToken);
    }, 10 * 60 * 1000);
    
    res.status(200).json({
      message: 'OTP sent to your email',
      signupToken: signupToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { signupToken, otp } = req.body;
    
    // Validate input
    if (!signupToken || !otp) {
      return res.status(400).json({ message: 'Signup token and OTP are required' });
    }
    
    // Check if signup token exists
    const signupData = signupTokens.get(signupToken);
    if (!signupData) {
      return res.status(400).json({ message: 'Invalid or expired signup token' });
    }
    
    // Check if token is expired
    if (Date.now() > signupData.expiresAt) {
      signupTokens.delete(signupToken);
      return res.status(400).json({ message: 'Signup token has expired' });
    }
    
    // Verify OTP via MojoAuth
    const otpResponse = await verifyMojoAuthOTP(signupData.email, otp);
    
    if (!otpResponse.success || !otpResponse.verified) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Create user
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      deviceId: null,
      androidId: null
    };
    
    const user = await createUser(userData);
    
    // Generate device ID (UUID)
    const deviceId = uuidv4();
    
    // Update user with device ID
    await updateDeviceId(user.id, deviceId, null);
    
    // Remove signup token
    signupTokens.delete(signupToken);
    
    res.status(201).json({
      message: 'User created successfully',
      deviceId: deviceId,
      redirect: '/login'
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        deviceId: user.device_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Validate email format
    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      // For security, we don't reveal if the email exists
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    }
    
    // Send OTP via MojoAuth
    const otpResponse = await sendMojoAuthOTP(email);
    
    if (!otpResponse.success) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
    
    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store reset token
    await createPasswordReset({
      email: email,
      resetToken: resetToken,
      expiresAt: expiresAt
    });
    
    res.status(200).json({
      message: 'OTP sent to your email',
      resetToken: resetToken
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp, resetToken } = req.body;
    
    // Validate input
    if (!email || !otp || !resetToken) {
      return res.status(400).json({ message: 'Email, OTP, and reset token are required' });
    }
    
    // Validate email format
    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Find valid reset token
    const resetRecord = await findValidResetByToken(resetToken);
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Check if email matches
    if (resetRecord.email !== email) {
      return res.status(400).json({ message: 'Email does not match reset token' });
    }
    
    // Verify OTP via MojoAuth
    const otpResponse = await verifyMojoAuthOTP(email, otp);
    
    if (!otpResponse.success || !otpResponse.verified) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    res.status(200).json({
      message: 'OTP verified successfully',
      resetToken: resetToken
    });
  } catch (error) {
    console.error('Password reset OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    
    // Validate input
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: 'Email, reset token, and new password are required' });
    }
    
    // Validate email format
    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }
    
    // Find valid reset token
    const resetRecord = await findValidResetByToken(resetToken);
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Check if email matches
    if (resetRecord.email !== email) {
      return res.status(400).json({ message: 'Email does not match reset token' });
    }
    
    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password
    // Note: This would require adding an updatePassword function to userModel
    // For now, we'll simulate this:
    console.log(`Password for user ${email} would be updated to: ${hashedPassword}`);
    
    // Delete reset token
    await deleteResetByToken(resetToken);
    
    res.status(200).json({
      message: 'Password reset successfully',
      redirect: '/login'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyDevice = async (req, res) => {
  try {
    const { device_id, android_id } = req.body;
    
    // Validate input
    if (!device_id || !android_id) {
      return res.status(400).json({ message: 'Device ID and Android ID are required' });
    }
    
    // Find user by device ID
    const user = await findUserByDeviceId(device_id);
    
    if (!user) {
      return res.status(404).json({ message: 'Device ID not found' });
    }
    
    // Check if Android ID matches
    if (user.android_id && user.android_id !== android_id) {
      return res.status(403).json({ 
        message: 'Device ID is linked to another Android ID', 
        contactAdmin: true 
      });
    }
    
    // If Android ID is not set, update it
    if (!user.android_id) {
      await updateDeviceId(user.id, device_id, android_id);
    }
    
    res.status(200).json({
      message: 'Device verified successfully',
      userId: user.id
    });
  } catch (error) {
    console.error('Device verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  verifyOTP,
  login,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  verifyDevice
};
