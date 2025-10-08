// This is a simple demo script to show how the Android app would interact with the backend
// In a real Android app, this would be implemented in Kotlin

const axios = require('axios');

// Base URL for the API
const BASE_URL = 'https://techbroom.in/api';

// Simulate Android ID (in real app, this would be retrieved from Settings.Secure.ANDROID_ID)
const ANDROID_ID = 'android-device-id-12345';

// Simulate Device ID (this would be provided by the backend during user registration)
let DEVICE_ID = null;

// Function to verify device with backend
async function verifyDevice() {
    try {
        console.log('Verifying device with backend...');
        
        // In a real implementation, DEVICE_ID would be entered by the user
        // For this demo, we'll generate a random one
        DEVICE_ID = 'device-' + Math.random().toString(36).substring(7);
        
        const response = await axios.post(`${BASE_URL}/auth/verify-device`, {
            device_id: DEVICE_ID,
            android_id: ANDROID_ID
        });
        
        console.log('Device verification response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Device verification error:', error.response?.data || error.message);
        return null;
    }
}

// Function to simulate capturing a notification
function captureNotification(appName, sender, message) {
    return {
        appName: appName,
        sender: sender,
        message: message,
        timestamp: new Date().toISOString()
    };
}

// Function to upload notifications to backend
async function uploadNotifications(notifications, permissionStatus) {
    try {
        console.log('Uploading notifications to backend...');
        
        const response = await axios.post(`${BASE_URL}/notifications/upload-notifications`, {
            device_id: DEVICE_ID,
            notifications: notifications,
            permission_status: permissionStatus
        });
        
        console.log('Upload notifications response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload notifications error:', error.response?.data || error.message);
        return null;
    }
}

// Function to simulate the background sync cycle
async function syncCycle() {
    console.log('Starting sync cycle...');
    
    // Check if device is verified
    if (!DEVICE_ID) {
        console.log('Device not verified, verifying now...');
        const verifyResult = await verifyDevice();
        if (!verifyResult) {
            console.log('Device verification failed, aborting sync cycle');
            return;
        }
    }
    
    // Simulate captured notifications
    const notifications = [
        captureNotification('WhatsApp', 'John Doe', 'Hello, how are you?'),
        captureNotification('Instagram', 'Jane Smith', 'Check out my new post!'),
        captureNotification('Facebook', 'Bob Johnson', 'Thanks for the birthday wishes!'),
        captureNotification('Twitter', 'Tech News', 'Breaking: New technology announced')
    ];
    
    // Simulate permission status (true = granted, false = denied)
    const permissionStatus = true;
    
    // Upload notifications
    const uploadResult = await uploadNotifications(notifications, permissionStatus);
    
    if (uploadResult) {
        console.log('Sync cycle completed successfully');
    } else {
        console.log('Sync cycle failed');
    }
}

// Function to simulate the app running for multiple cycles
async function runDemo() {
    console.log('DobiTracker Android App Demo');
    console.log('============================');
    
    // Run 3 sync cycles
    for (let i = 1; i <= 3; i++) {
        console.log(`\n--- Sync Cycle ${i} ---`);
        await syncCycle();
        
        // Wait 10 seconds before next cycle (in real app, this would be 1 minute)
        if (i < 3) {
            console.log('Waiting 10 seconds before next cycle...');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    console.log('\nDemo completed');
}

// Run the demo if this file is executed directly
if (require.main === module) {
    runDemo();
}

module.exports = {
    verifyDevice,
    captureNotification,
    uploadNotifications,
    syncCycle,
    runDemo
};
