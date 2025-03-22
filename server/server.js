const express = require('express'); // Import Express framework for creating the server
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection
const cors = require('cors'); // Import CORS middleware to handle cross-origin requests
const dotenv = require('dotenv'); // Import dotenv to load environment variables
const path = require('path'); // Import path module to handle file system paths
const fs = require('fs'); // Import file system module to manage file-related operations

// Import route files
const authRoutes = require('./routes/auth'); // Authentication routes
const agentRoutes = require('./routes/agents'); // Agent management routes
const taskRoutes = require('./routes/tasks'); // Task management routes
// const dashboardRoutes = require('./routes/dashboard'); // Dashboard routes (commented out)

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Middleware (Ensure These Are Before Routes)
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) to allow frontend requests from different origins

app.use(express.json()); // Middleware to parse incoming JSON request bodies

// Create 'uploads' directory if it doesn't exist (to store uploaded files)
const uploadsDir = path.join(__dirname, 'uploads'); // Define the directory path
if (!fs.existsSync(uploadsDir)) { // Check if the directory exists
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory recursively if not found
}

// Connect to MongoDB database using Mongoose
mongoose.connect(process.env.MONGODB_URI) // MONGODB_URI is stored in the .env file
  .then(() => console.log('Connected to MongoDB')) // Log success message if connection is successful
  .catch(err => console.error('MongoDB connection error:', err)); // Log error if connection fails

// ✅ Define API Routes
app.use('/api/auth', authRoutes); // Routes for user authentication (login, register, JWT handling)
app.use('/api/agents', agentRoutes); // Routes for managing agents (CRUD operations)
app.use('/api/tasks', taskRoutes); // Routes for managing tasks (CRUD operations, file uploads)
// app.use('/api/dashboard', dashboardRoutes); // Dashboard routes (commented out)

// Error handling middleware (Global error handler)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error details in the console
  res.status(500).json({ message: 'Something went wrong!' }); // Send generic error response to the client
});

// Start the Express server
const PORT = process.env.PORT || 5000; // Define the port (default is 5000 if not set in .env)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server startup message
});

// Default route (Home Page)
app.get('/', (req, res) => {
  res.send('Hello World!'); // Response when accessing the root URL
});
