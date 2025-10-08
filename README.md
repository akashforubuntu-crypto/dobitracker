# DobiTracker

Android Notification Capture System + Web Portal

## Project Structure

```
dobitracker/
├── androidapp/                  # Android Kotlin application
├── backend/                     # Node.js Express backend + static web portal
│   ├── public/                  # Static web portal files (HTML/CSS/JS)
│   ├── src/                     # Backend source code
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Database models
│   │   ├── middleware/          # Authentication, validation
│   │   ├── routes/              # API route definitions
│   │   └── utils/               # Helper functions
│   ├── database/                # Database configuration and migrations
│   └── server.js                # Entry point
├── .env.example                 # Environment variables template
└── README.md                    # Project documentation
```

## Features

- Web Portal with user authentication (signup, login, password reset)
- Admin Panel for managing users, devices, and content
- Android App for capturing notifications
- REST API for all functionality
- Blog and document management

## Setup Instructions

### Prerequisites
- Node.js 14.x or later
- PostgreSQL database (Aiven or local)
- Android Studio for Android app development (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the .env.example file to .env and configure the environment variables:
   ```
   cp .env.example .env
   ```
   Edit the .env file with your actual values:
   - AIVEN_DB_URL: Your PostgreSQL database connection string
   - JWT_SECRET: A secret key for JWT token signing
   - MOJOAUTH_CLIENT_ID: Your MojoAuth client ID
   - MOJOAUTH_CLIENT_SECRET: Your MojoAuth client secret
   - ADMIN_EMAIL: Admin email address
   - ADMIN_PASSWORD: Admin password

4. Initialize the database:
   ```
   npm run setup
   ```
   This will:
   - Create database tables
   - Create an admin user
   - Create sample blog posts
   - Create sample documents

5. Start the server:
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

6. The backend will be available at http://localhost:3000

### Web Portal Usage

1. Open your browser and navigate to http://localhost:3000
2. You can:
   - Sign up for a new account
   - Log in with existing credentials
   - Reset your password if needed
   - Access the dashboard to view notifications
   - Read blog posts
   - View documents

### Admin Panel Access

1. Log in with the admin credentials you configured in .env
2. The admin panel will be accessible at http://localhost:3000/admin.html
3. In the admin panel, you can:
   - Manage users
   - View device status
   - Manage documents
   - Manage blog posts

### Android App Setup (Optional)

1. Navigate to the androidapp directory:
   ```
   cd androidapp
   ```

2. Open the project in Android Studio

3. Build and run the app on an Android device or emulator

4. On first launch:
   - Enter the Device ID provided during user registration
   - Grant notification access permission
   - Allow battery optimization exemption

5. The app will automatically sync notifications every minute

### Android App Demo

To run a simple demo of how the Android app interacts with the backend:

1. Navigate to the androidapp directory:
   ```
   cd androidapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the demo:
   ```
   npm run demo
   ```

This will simulate the Android app's interaction with the backend, including device verification and notification syncing.

### API Endpoints

The backend provides the following API endpoints:

#### Authentication
- POST /api/auth/signup - User registration
- POST /api/auth/verify-otp - OTP verification
- POST /api/auth/login - User login
- POST /api/auth/request-password-reset - Request password reset
- POST /api/auth/verify-password-reset-otp - Verify password reset OTP
- POST /api/auth/reset-password - Reset password
- POST /api/auth/verify-device - Verify device ID

#### Notifications
- POST /api/notifications/upload-notifications - Upload notifications
- GET /api/notifications/fetch-notifications - Fetch notifications

#### Documents
- GET /api/documents - Get all documents
- GET /api/documents/:type - Get document by type
- POST /api/documents - Create document (admin only)
- PUT /api/documents/:id - Update document (admin only)
- DELETE /api/documents/:id - Delete document (admin only)

#### Blogs
- GET /api/blogs - Get all blog posts
- GET /api/blogs/:id - Get blog post by ID
- POST /api/blogs - Create blog post (admin only)
- PUT /api/blogs/:id - Update blog post (admin only)
- DELETE /api/blogs/:id - Delete blog post (admin only)

#### Admin
- GET /api/admin/users - Get all users (admin only)
- GET /api/admin/users/:id - Get user by ID (admin only)
- PUT /api/admin/users/:id/role - Update user role (admin only)
- GET /api/admin/devices - Get device status (admin only)
- GET /api/admin/notifications/:deviceId - Get notifications for device (admin only)

### Development

#### Backend Development
- The backend is built with Node.js and Express
- Database models are in `backend/src/models/`
- Controllers are in `backend/src/controllers/`
- Routes are in `backend/src/routes/`
- Utilities are in `backend/src/utils/`

#### Web Portal Development
- The web portal is built with HTML, CSS, and JavaScript
- Main files are in `backend/public/`
- Styles are in `backend/public/styles.css`
- Main JavaScript is in `backend/public/script.js`
- Admin panel JavaScript is in `backend/public/admin-script.js`

#### Android App Development
- The Android app is built with Kotlin
- Main files are in `androidapp/app/src/main/java/com/dobitracker/android/`
- UI layouts are in `androidapp/app/src/main/res/layout/`
- String resources are in `androidapp/app/src/main/res/values/strings.xml`

### Troubleshooting

- If the database connection fails, check your AIVEN_DB_URL in .env
- If JWT authentication fails, check your JWT_SECRET in .env
- If the Android app doesn't capture notifications, ensure notification access is granted
- If the background service isn't running, check battery optimization settings

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request
