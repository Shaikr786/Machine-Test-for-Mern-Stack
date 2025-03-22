import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TasksManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newTask, setNewTask] = useState({ firstName: "", phone: "", notes: "", assignedTo: "" });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchAgents();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      console.log("Fetched Tasks:", data); // Debugging
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };
  

  const fetchAgents = async () => {
    try {
      const { data } = await api.get("/agents");
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!user || user.role !== "admin") {
      console.error("❌ Unauthorized: Only admin can manage tasks");
      return;
    }
  
    if (!newTask.firstName.trim() || !newTask.phone.trim() || !newTask.assignedTo) {
      alert("❌ First name, phone, and agent selection are required.");
      return;
    }
  
    const payload = {
      firstName: newTask.firstName.trim(),
      phone: newTask.phone.trim(),
      notes: newTask.notes.trim(),
      agentId: newTask.assignedTo, // ✅ Correctly sending only the ID
    };
  
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
        setEditingTask(null);
      } else {
        await api.post("/tasks", payload);
      }
      fetchTasks(); // ✅ Refetch updated tasks
      setNewTask({ firstName: "", phone: "", notes: "", assignedTo: "" });
    } catch (error) {
      console.error("❌ Error managing task:", error.response?.data || error.message);
    }
  };
  

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      firstName: task.firstName,
      phone: task.phone,
      notes: task.notes,
      assignedTo: task.agent?._id || "", // ✅ Store only the ID
    });
  };
  
  

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("❌ Error deleting task:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Tasks Management</h2>

      {/* Check if agents exist */}
    {agents.length === 0 ? (
      <p className="text-red-400 text-center mb-4">
        ❌ No active agents available. Please create an agent first.
      </p>
    ) : (
      <>
      {/* Add/Edit Task Form */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">{editingTask ? "Edit Task" : "Add New Task"}</h3>
        <div className="grid grid-cols-3 gap-4">
          <input type="text" placeholder="First Name" value={newTask.firstName} onChange={(e) => setNewTask({ ...newTask, firstName: e.target.value })} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400" />
          <input type="text" placeholder="Phone" value={newTask.phone} onChange={(e) => setNewTask({ ...newTask, phone: e.target.value })} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400" />
          <input type="text" placeholder="Notes" value={newTask.notes} onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400" />
          <select
            value={newTask.assignedTo || ""}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>

        </div>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full" onClick={handleAddOrUpdateTask}>{editingTask ? "Update Task" : "Add Task"}</button>
      </div>
      </>
    )}

      {/* Tasks List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Tasks List</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">First Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Agent</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-700">
                  <td className="p-2">{task.firstName}</td>
                  <td className="p-2">{task.phone}</td>
                  <td className="p-2">{task.notes}</td>
                  <td className="p-2">{task.agent ? task.agent.name : "Unknown"}</td>
                  <td className="p-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded mr-2" onClick={() => handleEditTask(task)}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-400">No tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default TasksManagement;
