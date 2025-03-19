const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const User = require('../models/User');

const AGENT_LIMIT = 5; // Max agents for task distribution

// Helper function: Validate phone format
const isValidPhone = (phone) => /^\+\d{10,15}$/.test(phone.trim());

// ✅ Get all tasks (Admin Only)
const getAllTasks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find().populate('agent uploadedBy', 'name email');
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
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
    console.error("Error fetching agent tasks:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create a new task manually (Admin Only)
const createTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { firstName, phone, notes, agentId } = req.body;

    if (!firstName?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: "First name and phone are required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    let assignedAgent = null;
    if (agentId) {
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      assignedAgent = agentId;
    }

    const newTask = new Task({
      firstName: firstName.trim(),
      phone: phone.trim(),
      notes: notes?.trim() || '',
      agent: assignedAgent,
      uploadedBy: req.user._id,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update an existing task (Admin Only)
const updateTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const { firstName, phone, notes, agentId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    task.firstName = firstName || task.firstName;
    task.phone = phone || task.phone;
    task.notes = notes || task.notes;
    if (agentId) {
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      task.agent = agentId;
    }

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete a task (Admin Only)
const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Upload CSV/XLSX and distribute tasks among agents (Admin Only)
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(fileExtension)) {
      fs.unlinkSync(filePath); // Delete invalid file
      return res.status(400).json({ message: "Invalid file format. Only CSV/XLSX are allowed." });
    }

    const uploadedBy = req.user.id;
    let tasks = [];

    if (fileExtension === "csv") {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (!row.firstName?.trim() || !isValidPhone(row.phone)) return;
          results.push({
            firstName: row.firstName.trim(),
            phone: row.phone.trim(),
            notes: row.notes ? row.notes.trim() : "",
            uploadedBy,
          });
        })
        .on("end", async () => {
          fs.unlinkSync(filePath);
          if (results.length === 0) {
            return res.status(400).json({ message: "Invalid data in CSV" });
          }
          await processTasks(results, res, req);
        });
    } else {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      tasks = excelData.filter(row => row.firstName?.trim() && isValidPhone(row.phone)).map(row => ({
        firstName: row.firstName.trim(),
        phone: row.phone.trim(),
        notes: row.notes ? row.notes.trim() : "",
        uploadedBy,
      }));

      fs.unlinkSync(filePath);
      if (tasks.length === 0) {
        return res.status(400).json({ message: "Invalid data in Excel" });
      }
      await processTasks(tasks, res, req);
    }
  } catch (error) {
    console.error("CSV Upload Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// ✅ Distribute tasks among active agents
const processTasks = async (tasks, res, req) => {
  try {
    const agents = await Agent.find({ isActive: true }).limit(AGENT_LIMIT);
    if (!agents.length) return res.status(400).json({ message: 'No active agents available' });

    const assignedTasks = tasks.map((task, i) => ({
      ...task,
      agent: agents[i % agents.length]._id,
    }));

    const insertedTasks = await Task.insertMany(assignedTasks);
    res.status(201).json({ message: "Tasks distributed successfully", tasks: insertedTasks });
  } catch (error) {
    console.error("Task Distribution Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllTasks, getTasksForAgent, createTask, updateTask, deleteTask, uploadCSV };
