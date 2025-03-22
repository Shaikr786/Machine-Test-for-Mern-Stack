const express = require("express"); // Import Express framework to create a router
const multer = require("multer"); // Import Multer for file uploads
const {
  getAllTasks,
  getTasksForAgent,
  createTask,
  updateTask,  // ✅ Add update function
  deleteTask,  // ✅ Add delete function
  uploadCSV
} = require("../controllers/taskController"); // Import task controller functions

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware"); // Import authentication and authorization middleware

const router = express.Router(); // Create an Express router instance

// ✅ Configure Multer for file uploads (used for CSV uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Save uploaded files to the "uploads/" directory
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) // Rename file with timestamp to avoid conflicts
});
// ✅ Protect all task-related routes with authentication
router.use(authMiddleware); 

// ✅ Role-based protected routes

// 1️⃣ Get all tasks (Admin only)
router.get("/", authorizeRoles("admin"), getAllTasks);

// 2️⃣ Get tasks assigned to the logged-in agent (Agent only)
router.get("/my-tasks", authorizeRoles("agent"), getTasksForAgent);

// 3️⃣ Create a new task (Admin only)
router.post("/", authorizeRoles("admin"), createTask);

// 4️⃣ Update a task by ID (Admin only)
router.put("/:id", authorizeRoles("admin"), updateTask);

// 5️⃣ Delete a task by ID (Admin only)
router.delete("/:id", authorizeRoles("admin"), deleteTask);

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
}).single("file"); // This must match Postman key!


// 6️⃣ Upload CSV file to bulk import tasks (Admin only) 
router.post("/upload", authorizeRoles("admin"), upload, uploadCSV);


// ✅ Export the router so it can be used in the main app
module.exports = router;
