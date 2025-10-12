# DobiTracker Backend

Node.js backend API for the DobiTracker Android Notification Capture System.

## 🚀 Features

- **User Authentication**: JWT-based authentication with email OTP verification
- **Notification Management**: Real-time notification capture and storage
- **Admin Panel**: User management and system administration
- **Document Management**: File upload and management system
- **Blog System**: Content management for announcements and updates
- **Database Integration**: PostgreSQL with Aiven cloud database

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Aiven)
- **Authentication**: JWT + MojoAuth (OTP)
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Morgan

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/akashforubuntu-crypto/dobitracker-backend.git
   cd dobitracker-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Initialize database**:
   ```bash
   npm run setup
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
AIVEN_DB_URL=postgresql://username:password@host:port/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# MojoAuth Configuration (for OTP)
MOJOAUTH_CLIENT_ID=your-mojoauth-client-id
MOJOAUTH_CLIENT_SECRET=your-mojoauth-client-secret

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/verify-device` - Device verification

### Notifications
- `POST /api/notifications/upload-notifications` - Upload notifications
- `GET /api/notifications/fetch-notifications` - Fetch user notifications

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload document (Admin only)

### Blogs
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs` - Create blog post (Admin only)

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## 🗄️ Database Schema

### Users Table
- `id`, `email`, `password_hash`, `device_id`, `android_id`, `is_verified`, `permission_status`, `created_at`, `updated_at`

### Notifications Table
- `id`, `user_id`, `app_name`, `sender`, `message`, `timestamp`, `created_at`

### Documents Table
- `id`, `title`, `description`, `file_path`, `created_at`, `updated_at`

### Blogs Table
- `id`, `title`, `content`, `author`, `created_at`, `updated_at`

## 🚀 Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npm run setup` to initialize database
4. Start with `npm start`

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Rate limiting (recommended for production)

## 📱 Android App Integration

This backend is designed to work with the DobiTracker Android app:
- Device verification using device ID and Android ID
- Real-time notification upload
- Background sync service integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email admin@techbroom.in or create an issue in this repository.
