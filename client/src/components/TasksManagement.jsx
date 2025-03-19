import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TasksManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ firstName: "", phone: "", notes: "" });

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
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
      const taskData = { ...newTask, uploadedBy: user._id };
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
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Tasks Management</h2>

      {/* Task Input Form */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Add New Task</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newTask.firstName}
            onChange={(e) => setNewTask({ ...newTask, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newTask.phone}
            onChange={(e) => setNewTask({ ...newTask, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Notes"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
          />
        </div>
        <button
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse bg-gray-800 text-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-blue-300 uppercase">
              <th className="p-3">First Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                  <td className="p-3">{task.firstName}</td>
                  <td className="p-3">{task.phone}</td>
                  <td className="p-3">{task.notes}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksManagement;
