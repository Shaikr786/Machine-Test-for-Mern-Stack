const express = require('express');
const {
  getAllAgents,
  getAgentById,
  createAgent,
  toggleAgentStatus,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.get('/', authorizeRoles('admin'), getAllAgents);
router.get('/:id', authorizeRoles('admin', 'agent'), getAgentById);
router.post('/', authorizeRoles('admin'), createAgent);
router.put('/:id/toggle', authorizeRoles('admin'), toggleAgentStatus); // ✅ New toggle route
router.put('/:id', authorizeRoles('admin'), updateAgent);
router.delete('/:id', authorizeRoles('admin'), deleteAgent);

module.exports = router;
