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

## 🚀 Deployment

### Backend (Render)

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run setup-production`
5. Set start command: `npm start`
6. Add environment variables

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
