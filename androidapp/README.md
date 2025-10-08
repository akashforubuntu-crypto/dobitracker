# DobiTracker Android App

## Overview
The DobiTracker Android app captures notifications from your device and syncs them with the backend server. It runs a background service to periodically send captured notifications to the server.

## Features
- Notification capture for various apps (WhatsApp, Instagram, etc.)
- Background sync service that runs every minute
- Device verification with backend
- Permission management for notification access and battery optimization

## Setup Instructions

### Prerequisites
- Android Studio Arctic Fox or later
- Android device with Android 5.0 (API level 21) or higher
- Backend server running (see backend README for setup instructions)

### Building the App
1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to the `androidapp` directory and select it
4. Wait for Gradle to sync the project
5. Connect an Android device or start an emulator
6. Click "Run" to build and install the app

### First Launch
1. When you first launch the app, you'll be prompted to enter your Device ID
2. Enter the Device ID provided by the backend during user registration
3. The app will verify the Device ID with the backend
4. If valid, you'll be prompted to:
   - Grant notification access permission
   - Allow battery optimization exemption
5. The background service will start automatically

### Subsequent Launches
1. On subsequent launches, the app will automatically:
   - Open Wi-Fi settings
   - Start the background sync service

## Project Structure
```
androidapp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dobitracker/android/
│   │   │   │   ├── MainActivity.kt          # Main activity for device verification
│   │   │   │   ├── NotificationListener.kt  # Notification listener service
│   │   │   │   ├── BackgroundSyncService.kt # Background sync service
│   │   │   │   └── BootReceiver.kt          # Boot receiver to start services
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   └── activity_main.xml   # Main activity layout
│   │   │   │   └── values/
│   │   │   │       └── strings.xml          # String resources
│   │   │   └── AndroidManifest.xml          # App manifest
│   │   └── build.gradle                     # App build configuration
├── build.gradle                             # Project build configuration
├── gradle.properties                        # Gradle properties
├── settings.gradle                          # Gradle settings
└── README.md                                # This file
```

## Key Components

### MainActivity.kt
Handles the initial device verification and permission requests.

### NotificationListener.kt
Captures notifications from various apps and stores them in a queue.

### BackgroundSyncService.kt
Runs in the background every minute to sync captured notifications with the backend.

### BootReceiver.kt
Starts the background service when the device boots up.

## Permissions
The app requires the following permissions:
- `INTERNET`: To communicate with the backend server
- `BIND_NOTIFICATION_LISTENER_SERVICE`: To capture notifications
- `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`: To run background service reliably
- `RECEIVE_BOOT_COMPLETED`: To start services on boot

## API Endpoints
The app communicates with the following backend endpoints:
- `POST /api/auth/verify-device`: Verify device ID
- `POST /api/notifications/upload-notifications`: Upload captured notifications

## Troubleshooting
- If notifications are not being captured, ensure notification access is granted in Settings > Apps > DobiTracker > Notifications
- If the background service is not running, check battery optimization settings for the app
- If device verification fails, contact your administrator

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request
