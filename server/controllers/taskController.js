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

    const tasks = await Task.find({ uploadedBy: req.user.id })
      .populate('agent uploadedBy', 'name email')
      .sort({ createdAt: -1 });

      console.log("Fetched Tasks:", tasks);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Get tasks assigned to a specific agent (Agent Only)
const getTasksForAgent = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin can see all tasks
      const tasks = await Task.find();
      conosle.log("All Tasks:", tasks);
      return res.status(200).json({ tasks });
    } else {
      // Agent should only see their own tasks
      const tasks = await Task.find({ assignedTo: req.user.id });
      console.log("Tasks for Agent:", tasks);
      return res.status(200).json({ tasks });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};



// ✅ Create a new task manually (Admin Only)
const createTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { firstName, phone, notes, agentId } = req.body;

    if (!firstName?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: "First name and phone are required" });
    }

    if (!/^\+\d{1,3}\d{6,14}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number. Use international format (e.g., +14155552675)" });
    }

    const agent = await Agent.findOne({ _id: agentId, createdBy: req.user.id, isActive: true });
    if (!agent) {
      return res.status(400).json({ message: "Invalid agent or agent not found" });
    }

    const newTask = new Task({
      firstName: firstName.trim(),
      phone: phone.trim(),
      notes: notes?.trim() || '',
      agent: agentId,
      uploadedBy: req.user.id
    });

    console.log("New Task Data:", newTask);

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

    console.log("Updated Task Data:", task);

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

    console.log("Deleted Task ID:", id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(fileExtension)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Invalid file format. Only CSV/XLSX are allowed." });
    }

    const uploadedBy = req.user.id;
    let parsedTasks = [];

    if (fileExtension === "csv") {
      // ✅ Parse CSV File
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (!row.firstName?.trim() || !isValidPhone(row.phone)) return;

          results.push({
            firstName: formatName(row.firstName.trim()),
            phone: row.phone.trim(),
            notes: row.notes ? row.notes.trim() : "",
            uploadedBy,
          });
        })
        .on("end", async () => {
          fs.unlinkSync(filePath); // Delete file after processing
          if (results.length === 0) {
            return res.status(400).json({ message: "Invalid or empty data in CSV" });
          }
          await processTasks(results, res, req);
        })
        .on("error", (error) => {
          fs.unlinkSync(filePath);
          console.error("CSV Parsing Error:", error);
          res.status(500).json({ message: "Error processing CSV file" });
        });
    } else {
      // ✅ Parse Excel File
      try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        parsedTasks = excelData
          .filter(row => row.firstName?.trim() && isValidPhone(row.phone))
          .map(row => ({
            firstName: formatName(row.firstName.trim()),
            phone: row.phone.trim(),
            notes: row.notes ? row.notes.trim() : "",
            uploadedBy,
          }));

        fs.unlinkSync(filePath); // Delete file after processing
        if (parsedTasks.length === 0) {
          return res.status(400).json({ message: "Invalid or empty data in Excel file" });
        }
        await processTasks(parsedTasks, res, req);
      } catch (error) {
        fs.unlinkSync(filePath);
        console.error("Excel Parsing Error:", error);
        res.status(500).json({ message: "Error processing Excel file" });
      }
    }
  } catch (error) {
    console.error("CSV Upload Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Distribute tasks among active agents
const processTasks = async (tasks, res, req) => {
  try {
    // Fetch active agents
    const agents = await Agent.find({ createdBy: req.user.id, isActive: true });

    console.log("Available Agents:", agents); // ✅ Log fetched agents

    if (!agents || agents.length === 0) {
      return res.status(400).json({ message: "No active agents available for task assignment" });
    }

    // Assign tasks to agents using round-robin distribution
    let assignedTasks = tasks.map((task, index) => ({
      ...task,
      agent: agents[index % agents.length]._id, // Rotate agents
      uploadedBy: req.user.id,
    }));

    console.log("Tasks to Insert:", assignedTasks); // ✅ Log tasks before inserting

    if (assignedTasks.length === 0) {
      return res.status(400).json({ message: "No valid tasks to insert" });
    }

    // Insert tasks into the database
    const insertedTasks = await Task.insertMany(assignedTasks);
    res.status(201).json({ message: "Tasks uploaded and distributed successfully", tasks: insertedTasks });
  } catch (error) {
    console.error("Task Distribution Error:", error); // ✅ Log actual error
    res.status(500).json({ message: "Error distributing tasks. Please try again later." });
  }
};


// ✅ Helper function to format names properly
const formatName = (name) => {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};


module.exports = { getAllTasks, getTasksForAgent, createTask, updateTask, deleteTask, uploadCSV };
