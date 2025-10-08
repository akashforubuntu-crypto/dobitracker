const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000/api';

// Demo functions for each API endpoint

async function demoSignup() {
    try {
        console.log('Demo: User Signup');
        const response = await axios.post(`${BASE_URL}/auth/signup`, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'TestPass123!'
        });
        console.log('Signup Response:', response.data);
        return response.data.signupToken;
    } catch (error) {
        console.error('Signup Error:', error.response?.data || error.message);
    }
}

async function demoVerifyOTP(signupToken) {
    try {
        console.log('Demo: Verify OTP');
        // In a real implementation, you would use an actual OTP
        // For demo purposes, we'll use a placeholder
        const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            signupToken: signupToken,
            otp: '123456' // Placeholder OTP
        });
        console.log('Verify OTP Response:', response.data);
    } catch (error) {
        console.error('Verify OTP Error:', error.response?.data || error.message);
    }
}

async function demoLogin() {
    try {
        console.log('Demo: User Login');
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'TestPass123!'
        });
        console.log('Login Response:', response.data);
        return response.data.token;
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
    }
}

async function demoRequestPasswordReset() {
    try {
        console.log('Demo: Request Password Reset');
        const response = await axios.post(`${BASE_URL}/auth/request-password-reset`, {
            email: 'test@example.com'
        });
        console.log('Request Password Reset Response:', response.data);
        return response.data.resetToken;
    } catch (error) {
        console.error('Request Password Reset Error:', error.response?.data || error.message);
    }
}

async function demoVerifyPasswordResetOTP(resetToken) {
    try {
        console.log('Demo: Verify Password Reset OTP');
        const response = await axios.post(`${BASE_URL}/auth/verify-password-reset-otp`, {
            email: 'test@example.com',
            otp: '123456', // Placeholder OTP
            resetToken: resetToken
        });
        console.log('Verify Password Reset OTP Response:', response.data);
    } catch (error) {
        console.error('Verify Password Reset OTP Error:', error.response?.data || error.message);
    }
}

async function demoResetPassword(resetToken) {
    try {
        console.log('Demo: Reset Password');
        const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
            email: 'test@example.com',
            resetToken: resetToken,
            newPassword: 'NewPass123!'
        });
        console.log('Reset Password Response:', response.data);
    } catch (error) {
        console.error('Reset Password Error:', error.response?.data || error.message);
    }
}

async function demoVerifyDevice() {
    try {
        console.log('Demo: Verify Device');
        const response = await axios.post(`${BASE_URL}/auth/verify-device`, {
            device_id: 'test-device-id',
            android_id: 'test-android-id'
        });
        console.log('Verify Device Response:', response.data);
    } catch (error) {
        console.error('Verify Device Error:', error.response?.data || error.message);
    }
}

async function demoUploadNotifications(token) {
    try {
        console.log('Demo: Upload Notifications');
        const response = await axios.post(`${BASE_URL}/notifications/upload-notifications`, {
            device_id: 'test-device-id',
            notifications: [
                {
                    appName: 'WhatsApp',
                    sender: 'John Doe',
                    message: 'Hello, how are you?',
                    timestamp: new Date().toISOString()
                },
                {
                    appName: 'Instagram',
                    sender: 'Jane Smith',
                    message: 'Check out my new post!',
                    timestamp: new Date().toISOString()
                }
            ],
            permission_status: true
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Upload Notifications Response:', response.data);
    } catch (error) {
        console.error('Upload Notifications Error:', error.response?.data || error.message);
    }
}

async function demoFetchNotifications(token) {
    try {
        console.log('Demo: Fetch Notifications');
        const response = await axios.get(`${BASE_URL}/notifications/fetch-notifications?device_id=test-device-id`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Fetch Notifications Response:', response.data);
    } catch (error) {
        console.error('Fetch Notifications Error:', error.response?.data || error.message);
    }
}

async function demoGetDocuments() {
    try {
        console.log('Demo: Get Documents');
        const response = await axios.get(`${BASE_URL}/documents`);
        console.log('Get Documents Response:', response.data);
    } catch (error) {
        console.error('Get Documents Error:', error.response?.data || error.message);
    }
}

async function demoGetBlogs() {
    try {
        console.log('Demo: Get Blogs');
        const response = await axios.get(`${BASE_URL}/blogs`);
        console.log('Get Blogs Response:', response.data);
    } catch (error) {
        console.error('Get Blogs Error:', error.response?.data || error.message);
    }
}

// Run all demos
async function runAllDemos() {
    console.log('Running DobiTracker API Demos\n');
    
    // These demos require a running server and database
    // Uncomment the following lines to run specific demos
    
    /*
    // Authentication flow
    const signupToken = await demoSignup();
    if (signupToken) {
        await demoVerifyOTP(signupToken);
        const token = await demoLogin();
        if (token) {
            await demoUploadNotifications(token);
            await demoFetchNotifications(token);
        }
    }
    
    // Password reset flow
    const resetToken = await demoRequestPasswordReset();
    if (resetToken) {
        await demoVerifyPasswordResetOTP(resetToken);
        await demoResetPassword(resetToken);
    }
    
    // Device verification
    await demoVerifyDevice();
    
    // Public content
    await demoGetDocuments();
    await demoGetBlogs();
    */
    
    console.log('\nDemos completed. Note: These demos require a running server and database.');
    console.log('Uncomment the demo functions in the code to run them.');
}

// Run the demos if this file is executed directly
if (require.main === module) {
    runAllDemos();
}

module.exports = {
    demoSignup,
    demoVerifyOTP,
    demoLogin,
    demoRequestPasswordReset,
    demoVerifyPasswordResetOTP,
    demoResetPassword,
    demoVerifyDevice,
    demoUploadNotifications,
    demoFetchNotifications,
    demoGetDocuments,
    demoGetBlogs,
    runAllDemos
};
