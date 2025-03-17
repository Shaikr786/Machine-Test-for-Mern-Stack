const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Task = require('../models/Task');
const Agent = require('../models/Agent');

// ✅ Get all tasks (Admin Only)
const getAllTasks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find().populate('agent uploadedBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get tasks assigned to a specific agent (Agent Only)
const getTasksForAgent = async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ agent: req.user.id }).populate('uploadedBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create a new task manually (Admin Only)
const createTask = async (req, res) => {
    try {
      const { firstName, phone, notes, agentId } = req.body;
  
      // Trim values and check required fields
      if (!firstName?.trim() || !phone?.trim()) {
        return res.status(400).json({ message: "First name and phone are required" });
      }
  
      // Validate phone format: must start with + followed by 10-15 digits
      if (!/^\+\d{10,15}$/.test(phone.trim())) {
        return res.status(400).json({ message: "Invalid phone number format. It must start with '+' followed by 10 to 15 digits." });
      }
  
      let assignedAgent = null;
      if (agentId) {
        const agent = await Agent.findById(agentId);
        if (!agent) {
          return res.status(404).json({ message: "Agent not found" });
        }
        assignedAgent = agentId;
      }
  
      // Create task
      const newTask = new Task({
        firstName: firstName.trim(),
        phone: phone.trim(),
        notes: notes?.trim() || '',
        agent: assignedAgent,
        uploadedBy: req.user._id, // Get admin ID from token
      });
  
      await newTask.save();
      res.status(201).json({ message: "Task created successfully", task: newTask });
  
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// ✅ Upload CSV/XLSX and distribute tasks among agents (Admin Only)
const uploadCSV = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const filePath = req.file.path;
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
  
      if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
        return res.status(400).json({ message: 'Invalid file format. Upload a CSV or Excel file' });
      }
  
      let tasks = [];
  
      if (fileExtension === 'csv') {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            if (!row.firstName?.trim() || !row.phone?.trim()) {
              return;
            }
  
            const phone = row.phone.trim();
            if (!/^\+\d{10,15}$/.test(phone)) {
              return;
            }
  
            results.push({
              firstName: row.firstName.trim(),
              phone,
              notes: row.notes ? row.notes.trim() : '',
            });
          })
          .on('end', async () => {
            if (results.length === 0) {
              return res.status(400).json({ message: "CSV file must contain valid firstName and phone in international format" });
            }
            await processTasks(results, res, req);
          });
      } else {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
        tasks = excelData
          .filter((row) => row.firstName?.trim() && row.phone?.trim()) // Ensure valid rows
          .map((row) => {
            const phone = row.phone.trim();
            if (!/^\+\d{10,15}$/.test(phone)) {
              return null;
            }
            return {
              firstName: row.firstName.trim(),
              phone,
              notes: row.notes ? row.notes.trim() : '',
            };
          })
          .filter(Boolean);
  
        if (tasks.length === 0) {
          return res.status(400).json({ message: "Excel file must contain valid firstName and phone in international format" });
        }
  
        await processTasks(tasks, res, req);
      }
    } catch (error) {
      console.error('CSV Upload Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // ✅ Distribute tasks among active agents
  const processTasks = async (tasks, res, req) => {
    try {
      const agents = await Agent.find({ isActive: true }).limit(5); // ✅ Ensure only active agents are considered
      if (agents.length === 0) {
        return res.status(400).json({ message: 'No active agents available for task distribution' });
      }
  
      let distributedTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        const agentIndex = i % agents.length; // Distribute equally among agents
        const taskData = {
          firstName: tasks[i].firstName,
          phone: tasks[i].phone,
          notes: tasks[i].notes,
          agent: agents[agentIndex]._id,
          uploadedBy: req.user._id,
        };
        distributedTasks.push(taskData);
      }
  
      const insertedTasks = await Task.insertMany(distributedTasks);
      res.status(201).json({ message: "Tasks distributed successfully", tasks: insertedTasks });
    } catch (error) {
      console.error('Task Distribution Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  getAllTasks,
  getTasksForAgent,
  createTask,
  uploadCSV,
};
