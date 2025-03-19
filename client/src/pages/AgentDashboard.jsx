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
    return <p className="text-center text-red-500">Unauthorized! Please log in.</p>;
  }

  if (!user) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Agent Dashboard</h1>
      <h2 className="mt-4 text-lg font-semibold">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul>
          {(tasks || []).map((task) => (
            <li key={task._id} className="flex justify-between p-2 border-b">
              {task.firstName} - {task.phone} - {task.notes}
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentDashboard;
