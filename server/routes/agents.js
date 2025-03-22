const express = require('express'); // Import Express framework to create a router
const {
  getAllAgents,
  getAgentById,
  createAgent,
  toggleAgentStatus,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController'); // Import agent controller functions

const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware'); // Import authentication and authorization middleware

const router = express.Router(); // Create a new Express router instance

// ✅ Apply authentication middleware to protect all agent routes
router.use(authMiddleware);

// ✅ Routes for agent management (Only authorized users can access them)

// 1️⃣ Get all agents (Admin only)
router.get('/', authorizeRoles('admin'), getAllAgents);

// 2️⃣ Get a single agent by ID (Admin & Agent can access)
router.get('/:id', authorizeRoles('admin', 'agent'), getAgentById);

// 3️⃣ Create a new agent (Admin only)
router.post('/', authorizeRoles('admin'), createAgent);

// 4️⃣ Toggle agent's active status (Admin only)
router.put('/:id/toggle', authorizeRoles('admin'), toggleAgentStatus);

// 5️⃣ Update agent details (Admin only)
router.put('/:id', authorizeRoles('admin'), updateAgent);

// 6️⃣ Delete an agent (Admin only)
router.delete('/:id', authorizeRoles('admin'), deleteAgent);

// ✅ Export the router to be used in the main app
module.exports = router;
