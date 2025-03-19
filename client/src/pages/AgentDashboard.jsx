import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AgentDashboard = () => {
  const [tasks, setTasks] = useState([]); // Ensure initial state is an array
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAgentTasks(user.id);
    }
  }, [user, isAuthenticated]);

  const fetchAgentTasks = async (agentId) => {
    try {
      const response = await axios.get(`/api/tasks/agent/${agentId}`);
      setTasks(Array.isArray(response.data) ? response.data : []); // Ensure array
    } catch (error) {
      console.error("Error fetching agent tasks", error);
      setTasks([]); // Prevent crashes by defaulting to an empty array
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, status } : task))
      );
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-red-500 text-lg font-semibold">
          Unauthorized! Please log in.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-center text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-orange-400">Agent Dashboard</h1>
        <h2 className="mt-6 text-xl font-semibold text-orange-300 text-center">My Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">No tasks assigned yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-orange-500">
                <p className="text-lg font-semibold text-orange-400">{task.firstName}</p>
                <p className="text-gray-300 text-sm">📞 {task.phone}</p>
                <p className="text-gray-400 text-sm mt-2">{task.notes}</p>

                {/* Status Dropdown */}
                <div className="mt-3">
                  <label className="text-orange-300 text-sm">Status:</label>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-orange-400 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
