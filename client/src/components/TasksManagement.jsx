import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext"; // Get logged-in user

const TasksManagement = () => {
  const { user, isAuthenticated } = useAuth(); // Use Auth Context
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ firstName: "", phone: "", notes: "" });

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks"); // Ensure backend has a GET /tasks route
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const handleAddTask = async () => {
    if (!user || user.role !== "admin") {
      console.error("❌ Unauthorized: Only admin can add tasks");
      return;
    }

    try {
      const taskData = { ...newTask, uploadedBy: user._id }; // Send the authenticated user's ID
      await api.post("/tasks", taskData);

      fetchTasks();
      setNewTask({ firstName: "", phone: "", notes: "" });
    } catch (error) {
      console.error("❌ Error adding task:", error.response?.data || error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!user || user.role !== "admin") {
      console.error("❌ Unauthorized: Only admin can delete tasks");
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("❌ Error deleting task:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="First Name"
          value={newTask.firstName}
          onChange={(e) => setNewTask({ ...newTask, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newTask.phone}
          onChange={(e) => setNewTask({ ...newTask, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Notes"
          value={newTask.notes}
          onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Phone</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.firstName}</td>
              <td>{task.phone}</td>
              <td>{task.notes}</td>
              <td>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksManagement;
