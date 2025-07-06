# Jobify - Job Tracking Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for tracking your job search progress.

## 🚀 Features

- **User Authentication**: Register, login, and logout functionality
- **Job Management**: Add, edit, delete, and track job applications
- **Dashboard**: View statistics and monthly application trends
- **Search & Filter**: Search jobs by company, position, and filter by status/type
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React 18** - UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd jobify
   ```

2. **Install dependencies**

   ```bash
   npm run install-dependencies
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_LIFETIME=30d
   NODE_ENV=development
   PORT=5000
   ```

4. **Run the application**

   ```bash
   npm start
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔐 Environment Variables Setup

### Required Environment Variables

Your application needs the following environment variables:

| Variable            | Description                   | Required | Default               | Example                                              |
| ------------------- | ----------------------------- | -------- | --------------------- | ---------------------------------------------------- |
| `MONGO_URL`         | MongoDB connection string     | No\*     | MongoDB Memory Server | `mongodb+srv://user:pass@cluster.mongodb.net/jobify` |
| `JWT_SECRET`        | Secret key for JWT tokens     | Yes      | -                     | `your_super_secret_key_here`                         |
| `JWT_LIFETIME`      | JWT token expiration          | No       | `30d`                 | `30d`                                                |
| `NODE_ENV`          | Environment mode              | No       | `development`         | `production`                                         |
| `PORT`              | Server port                   | No       | `5000`                | `5000`                                               |
| `REACT_APP_API_URL` | Frontend API URL (production) | No       | `/api/v1`             | `https://backend.onrender.com`                       |

\*For development, you can leave `MONGO_URL` empty to use MongoDB Memory Server

### Development Setup

1. **Create `.env` file in the root directory:**

   ```bash
   touch .env
   ```

2. **Add basic configuration:**

   ```env
   # For development (uses MongoDB Memory Server)
   MONGO_URL=
   JWT_SECRET=your_development_secret_key
   JWT_LIFETIME=30d
   NODE_ENV=development
   PORT=5000
   ```

3. **Generate a JWT Secret:**

   ```bash
   # Option 1: Use Node.js to generate a random string
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Option 2: Use a simple string (not recommended for production)
   echo "your_super_secret_key_here"
   ```

### Production Setup

#### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**

   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access:**

   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Set Up Network Access:**

   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for deployment)

5. **Get Connection String:**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `jobify`

#### Production Environment Variables

```env
# Production configuration
MONGO_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/jobify
JWT_SECRET=your_very_secure_production_secret_key
JWT_LIFETIME=30d
NODE_ENV=production
PORT=5000
```

### Security Best Practices

1. **JWT Secret:**

   - Use a strong, random string (at least 32 characters)
   - Never commit secrets to version control
   - Use different secrets for development and production

2. **MongoDB Connection:**

   - Use environment variables for connection strings
   - Enable network security in MongoDB Atlas
   - Use strong passwords for database users

3. **Environment Separation:**
   - Use different databases for development and production
   - Use different JWT secrets for each environment
   - Set `NODE_ENV=production` in production

## 🚀 Deployment

### Backend (Render)

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run setup-production`
5. Set start command: `npm start`
6. Add environment variables:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/jobify
   JWT_SECRET=your_production_jwt_secret
   JWT_LIFETIME=30d
   NODE_ENV=production
   ```

### Frontend (Vercel)

1. Create a Vercel account
2. Import your GitHub repository
3. Set build command: `npm run build-client`
4. Set output directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL=your_backend_url`

## 📁 Project Structure

```
jobify/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── assets/        # Images and styles
│   │   └── config/        # Configuration files
│   └── package.json
├── routes/                # Express routes
├── controllers/           # Route controllers
├── models/               # Mongoose models
├── middleware/           # Custom middleware
├── utils/                # Utility functions
├── errors/               # Error classes
├── db/                   # Database connection
├── server.js             # Express server
├── .env                  # Environment variables (create this)
├── env.example           # Environment variables template
└── package.json
```

## 🔧 Available Scripts

- `npm start` - Run both frontend and backend
- `npm run server` - Run only the backend
- `npm run client` - Run only the frontend
- `npm run build-client` - Build React app for production
- `npm run setup-production` - Install dependencies and build for production

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Note**: This is a learning project built with modern web technologies. Feel free to customize and extend it according to your needs!
