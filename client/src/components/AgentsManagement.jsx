import { useEffect, useState } from "react";
import api from "../utils/api";

const AgentsManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await api.get("/agents");
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };

  const handleAddAgent = async () => {
    const validationErrors = validateForm(newAgent);
    setErrors(validationErrors);
    console.log(errors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await api.post("/agents", newAgent);
        setAgents((prevAgents) => [...prevAgents, response.data.agent]);
        setNewAgent({ name: "", email: "", mobile: "", password: "" });
      } catch (error) {
        console.error("Error adding agent", error);
      }
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await api.delete(`/agents/${id}`);
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent", error);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.mobile) errors.mobile = "Mobile number is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Agents Management</h2>

      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Add New Agent</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newAgent.email}
            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newAgent.mobile}
            onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400"
            value={newAgent.password}
            onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
          />
        </div>
        <button
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          onClick={handleAddAgent}
        >
          Add Agent
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse bg-gray-800 text-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-blue-300 uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <tr key={agent._id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                  <td className="p-3">{agent.name}</td>
                  <td className="p-3">{agent.email}</td>
                  <td className="p-3">{agent.mobile}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                      onClick={() => handleDeleteAgent(agent._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No agents available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsManagement;
