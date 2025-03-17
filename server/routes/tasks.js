const express = require('express');
const multer = require('multer');
const { 
  getAllTasks,
  getTasksForAgent,
  createTask,
  uploadCSV
} = require('../controllers/taskController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.use(authMiddleware); // Protect all routes

// Role-based protected routes
router.get('/', authorizeRoles('admin'), getAllTasks);
router.get('/my-tasks', authorizeRoles('agent'), getTasksForAgent);
router.post('/', authorizeRoles('admin'), createTask);
router.post('/upload', authorizeRoles('admin'), upload.single('file'), uploadCSV);

module.exports = router;
