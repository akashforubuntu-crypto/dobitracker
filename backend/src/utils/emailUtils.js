const axios = require('axios');

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sendMojoAuthOTP = async (email) => {
  try {
    console.log('Sending OTP to email:', email);
    
    // Real MojoAuth API implementation using their REST API
    const response = await axios.post('https://api.mojoauth.com/users/emailotp', {
      email: email,
      language: 'en',
      redirect_url: 'https://dobitracker-backend.onrender.com'
    }, {
      headers: {
        'X-API-Key': process.env.MOJOAUTH_CLIENT_ID,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('MojoAuth OTP response:', response.data);
    
    return {
      success: true,
      message: 'OTP sent successfully',
      state_id: response.data.state_id
    };
  } catch (error) {
    console.error('MojoAuth OTP send error:', error.response?.data || error.message);
    throw new Error('Failed to send OTP: ' + (error.response?.data?.message || error.message));
  }
};

const verifyMojoAuthOTP = async (stateId, otp) => {
  try {
    console.log('Verifying OTP for state_id:', stateId);
    
    // Real MojoAuth API implementation for verification
    const response = await axios.post('https://api.mojoauth.com/users/emailotp/verify', {
      state_id: stateId,
      otp: otp
    }, {
      headers: {
        'X-API-Key': process.env.MOJOAUTH_CLIENT_ID,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('MojoAuth OTP verification response:', response.data);
    
    return {
      success: true,
      message: 'OTP verified successfully',
      verified: response.data.authenticated || false
    };
  } catch (error) {
    console.error('MojoAuth OTP verify error:', error.response?.data || error.message);
    throw new Error('Failed to verify OTP: ' + (error.response?.data?.message || error.message));
  }
};

module.exports = {
  validateEmailFormat,
  sendMojoAuthOTP,
  verifyMojoAuthOTP
};
