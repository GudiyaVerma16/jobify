# Jobify - Job Tracking Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for tracking job applications. Built with modern web technologies and deployed on Render (backend) and Vercel (frontend).

## 🌟 Live Demo

- **Frontend**: https://jobify-silk-seven.vercel.app
- **Backend API**: https://jobify-33p6.onrender.com
- **GitHub Repository**: https://github.com/GudiyaVerma16/jobify.git

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **Job Management**: Add, edit, delete, and track job applications
- **Search & Filter**: Advanced search and filtering capabilities
- **Statistics Dashboard**: Visual charts and job application statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Demo User**: Quick access with demo credentials

## 🛠️ Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend

- **React.js** - JavaScript library for building user interfaces
- **Context API** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Recharts** - Chart library for statistics
- **Styled Components** - CSS-in-JS styling

### Deployment

- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git**
- **MongoDB Atlas account** (for database)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GudiyaVerma16/jobify.git
cd jobify
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

#### Generate JWT Secret

```bash
npm run generate-secret
```

This will generate a secure JWT secret. Copy the output and add it to your `.env` file.

#### Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/jobify

# JWT Configuration
JWT_SECRET=your_generated_jwt_secret_here

# Node Environment
NODE_ENV=development

# Port (optional, defaults to 5000)
PORT=5000
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `username`, `password`, and `cluster` in your `MONGO_URL`

#### Option B: Local MongoDB

If you prefer to use a local MongoDB instance, install MongoDB locally and use:

```env
MONGO_URL=mongodb://localhost:27017/jobify
```

### 5. Add Demo User (Optional)

To add a demo user to your database:

```bash
npm run add-demo-user
```

This will create a demo user with the following credentials:

- **Email**: test@test.com
- **Password**: secret

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:

# Terminal 1 - Backend only
npm run server

# Terminal 2 - Frontend only
npm run client
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Production Mode

```bash
# Build the client
npm run build-client

# Start the server
npm start
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account**

   - Sign up at [render.com](https://render.com)

2. **Connect GitHub Repository**

   - Connect your GitHub account
   - Select the jobify repository

3. **Create Web Service**

   - **Name**: jobify-backend
   - **Environment**: Node
   - **Build Command**: `npm run setup-production`
   - **Start Command**: `npm start`

4. **Environment Variables**
   Add the following environment variables in Render:

   ```
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Frontend Deployment (Vercel)

1. **Create Vercel Account**

   - Sign up at [vercel.com](https://vercel.com)

2. **Import Project**

   - Connect your GitHub account
   - Import the jobify repository

3. **Configure Build Settings**

   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**
   Add the following environment variable:

   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## 🐛 Problems Encountered & Solutions

### 1. CORS Issues

**Problem**: Cross-origin requests blocked between Vercel frontend and Render backend.

**Error Messages**:

```
Access to XMLHttpRequest at 'https://jobify-33p6.onrender.com/api/v1/auth/getCurrentUser'
from origin 'https://jobify-silk-seven.vercel.app' has been blocked by CORS policy
```

**Solution**:

- Updated CORS configuration in `server.js` to allow Vercel domains
- Added flexible origin checking for all Vercel subdomains
- Configured proper CORS headers for credentials

**Code Fix**:

```javascript
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost:")) return callback(null, true);
      if (origin.includes("vercel.app")) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);
```

### 2. Authentication Issues (401 Unauthorized)

**Problem**: Users getting logged out immediately after login due to cookie configuration issues.

**Error Messages**:

```
GET https://jobify-33p6.onrender.com/api/v1/auth/getCurrentUser 401 (Unauthorized)
```

**Root Cause**:

- `NODE_ENV` not set to `production` in Render
- Cookies being set with `SameSite=Lax` instead of `SameSite=None`
- Cross-origin cookies not being sent properly

**Solution**:

- Set `NODE_ENV=production` in Render environment variables
- Updated cookie configuration to use `SameSite=None` and `Secure=true` in production
- Removed problematic `domain` setting from cookie configuration

**Code Fix**:

```javascript
res.cookie("token", token, {
  httpOnly: true,
  expires: new Date(Date.now() + oneDay),
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});
```

### 3. Deployment Script Issues

**Problem**: Render deployment failing due to `concurrently` not being available in production.

**Error Messages**:

```
sh: 1: concurrently: not found
==> Exited with status 127
```

**Root Cause**:

- `concurrently` was in `devDependencies` but needed in production
- Production doesn't need to run both frontend and backend servers

**Solution**:

- Changed start script to only run the server in production
- Added separate dev script for local development
- Removed dependency on `concurrently` for production

**Code Fix**:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "concurrently --kill-others-on-fail \" npm run server\" \" npm run client\""
  }
}
```

### 4. Error Handling Issues

**Problem**: Application crashing when `error.response` was undefined due to network errors.

**Error Messages**:

```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'status')
```

**Solution**:

- Updated all error handling to use optional chaining (`?.`)
- Added fallback error messages
- Improved error handling throughout the application

**Code Fix**:

```javascript
catch (error) {
  const errorMessage = error.response?.data?.msg || error.message || 'Something went wrong';
  dispatch({
    type: SETUP_USER_ERROR,
    payload: { msg: errorMessage },
  });
}
```

### 5. Environment Variable Configuration

**Problem**: Missing or incorrectly configured environment variables causing various issues.

**Issues**:

- JWT_SECRET not set
- MONGO_URL not configured
- NODE_ENV not set to production

**Solution**:

- Created comprehensive environment variable documentation
- Added environment variable validation
- Provided clear setup instructions

### 6. Axios Configuration Issues

**Problem**: API requests not working properly due to incorrect base URL configuration.

**Solution**:

- Created centralized axios configuration
- Added automatic `/api/v1` path handling
- Configured proper credentials handling

**Code Fix**:

```javascript
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  if (!envURL) return "/api/v1";
  if (envURL.includes("/api/v1")) return envURL;
  return `${envURL}/api/v1`;
};

const authFetch = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
```

## 🔧 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/getCurrentUser` - Get current user
- `GET /api/v1/auth/logout` - Logout user
- `PATCH /api/v1/auth/updateUser` - Update user profile

### Jobs

- `GET /api/v1/jobs` - Get all jobs (with pagination, search, filters)
- `POST /api/v1/jobs` - Create new job
- `GET /api/v1/jobs/stats` - Get job statistics
- `PATCH /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job

## 📁 Project Structure

```
jobify/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── config/         # Configuration files
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── controllers/            # Express route controllers
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── utils/                  # Utility functions
├── errors/                 # Custom error classes
├── db/                     # Database connection
├── server.js              # Express server
├── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Helmet**: Security headers middleware
- **CORS**: Proper cross-origin configuration
- **Rate Limiting**: API rate limiting for security
- **Input Validation**: Request validation and sanitization
- **XSS Protection**: XSS attack prevention
- **MongoDB Sanitization**: NoSQL injection prevention

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login/logout
- [ ] Job creation
- [ ] Job editing
- [ ] Job deletion
- [ ] Job search and filtering
- [ ] Statistics dashboard
- [ ] Responsive design
- [ ] Cross-browser compatibility

### Demo User Testing

Use the demo user credentials:

- **Email**: test@test.com
- **Password**: secret

## 🚨 Troubleshooting

### Common Issues

1. **"Cannot connect to database"**

   - Check your `MONGO_URL` in environment variables
   - Ensure MongoDB Atlas cluster is running
   - Verify network access settings

2. **"Authentication failed"**

   - Verify `JWT_SECRET` is set correctly
   - Check if `NODE_ENV` is set to `production` in Render
   - Clear browser cookies and try again

3. **"CORS errors"**

   - Ensure CORS configuration allows your frontend domain
   - Check if credentials are properly configured
   - Verify environment variables are set correctly

4. **"Build failed"**
   - Check if all dependencies are installed
   - Verify Node.js version compatibility
   - Check for syntax errors in code

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed logs for authentication, CORS, and database operations.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **John Smilga** - Course instructor and original project creator
- **MongoDB Atlas** - Cloud database hosting
- **Render** - Backend hosting platform
- **Vercel** - Frontend hosting platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the deployment logs in Render/Vercel
3. Open an issue on GitHub with detailed error information
4. Include environment details and error messages

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks

- [ ] Update dependencies regularly
- [ ] Monitor MongoDB Atlas usage
- [ ] Check Render/Vercel deployment status
- [ ] Review security configurations
- [ ] Test all features after updates

### Future Enhancements

- [ ] Add email notifications
- [ ] Implement job application tracking
- [ ] Add resume upload functionality
- [ ] Create mobile app
- [ ] Add team collaboration features

---

**Happy Job Hunting! 🎯**
