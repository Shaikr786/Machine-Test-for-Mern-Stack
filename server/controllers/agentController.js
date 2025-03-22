const Agent = require('../models/Agent'); // Import the Agent model (MongoDB schema)
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing (not used in this function)


// Get all agents
const getAllAgents = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // ✅ Fetch only active agents created by this admin
    const agents = await Agent.find({ createdBy: req.user.id, isActive: true }).sort({ createdAt: -1 });

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  

// Get single agent
const getAgentById = async (req, res) => {
  try {
      // 🔹 Fetch the agent by ID from the database using the ID from request parameters
      const agent = await Agent.findById(req.params.id);

      // 🔹 If the agent is not found, return a 404 error response
      if (!agent) return res.status(404).json({ message: 'Agent not found' });

      // 🔹 If the user is an "agent", they can only view their own profile
      // ✅ Convert agent._id to a string to compare with req.user.id
      if (req.user.role === 'agent' && req.user.id !== agent._id.toString()) {
          return res.status(403).json({ message: 'Access denied' }); // ❌ Forbidden access
      }

      // 🔹 If the user is authorized, return the agent details as a JSON response
      res.json(agent);
  } catch (error) {
      console.error('Error fetching agent:', error); // 🛠 Log the error for debugging
      res.status(500).json({ message: 'Internal server error' }); // ❌ Handle server errors
  }
};


// Create a new agent
const createAgent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email, phone, password } = req.body;

    if (!/^\+\d{1,3}\d{6,14}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number. Use international format (e.g., +14155552675)" });
    }

    if (await Agent.findOne({ email })) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = new Agent({
      name,
      email,
      phone,
      password: hashedPassword,
      createdBy: req.user.id
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  

// Update agent
const updateAgent = async (req, res) => {
  try {
    const { name, email, phone, password, status, role } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingAgent = await Agent.findOne({ email, _id: { $ne: req.params.id } });
      if (existingAgent) {
        return res.status(400).json({ message: 'Agent with this email already exists' });
      }
    }

    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.phone = phone || agent.phone;
    agent.status = status || agent.status;
    agent.role = role || agent.role;

    // Only hash password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      agent.password = await bcrypt.hash(password, salt);
    }

    await agent.save();
    res.json({ message: 'Agent updated successfully', agent });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle agent active status
const toggleAgentStatus = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.isActive = !agent.isActive;
    await agent.save();

    res.json({ message: 'Agent status updated', agent });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete agent
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  createAgent,
  toggleAgentStatus,
  updateAgent,
  deleteAgent
};
