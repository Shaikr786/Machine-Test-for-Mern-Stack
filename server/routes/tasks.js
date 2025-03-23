const express = require("express"); // Import Express framework
const multer = require("multer"); // Import Multer for file uploads
const {
  getAllTasks,
  getTasksForAgent,
  createTask,
  updateTask,
  deleteTask,
  uploadCSV
} = require("../controllers/taskController"); // Import task controller functions

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware"); // Import authentication and authorization middleware

const router = express.Router(); // Create an Express router instance

// ✅ Protect all task-related routes with authentication
router.use(authMiddleware);

// ✅ Configure Multer for memory storage (fixes Vercel issue)
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory instead of disk
}).single("file"); // Ensure it matches the key used in Postman/FormData

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

// 6️⃣ Upload CSV file to bulk import tasks (Admin only)
router.post("/upload", authorizeRoles("admin"), upload, uploadCSV);

// ✅ Export the router so it can be used in the main app
module.exports = router;
