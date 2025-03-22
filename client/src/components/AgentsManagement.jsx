import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AgentsManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user.role === "admin") fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await api.get(`/agents?adminId=${user.id}`);
      setAgents(data || []);
    } catch{
      toast.error("Failed to fetch agents.");
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format.";
    if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) errors.phone = "Invalid phone number.";
    if (formData.password.length < 6) errors.password = "Password must be at least 6 characters.";
    return errors;
  };

  const handleAddAgent = async () => {
    if (user.role !== "admin") return toast.error("Only admins can add agents.");
    
    setIsSubmitting(true);
    const validationErrors = validateForm(newAgent);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const { data } = await api.post("/agents", newAgent);
      setAgents((prev) => [...prev, data.agent]);
      toast.success("Agent added successfully!");
      setNewAgent({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding agent.");
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/agents/${id}/toggle`);
      fetchAgents();
      toast.success("Agent status updated.");
    } catch {
      toast.error("Error updating status.");
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await api.delete(`/agents/${id}`);
      fetchAgents();
      toast.success("Agent deleted.");
    } catch {
      toast.error("Error deleting agent.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Agents Management</h2>
      {user.role !== "admin" ? (
        <p className="text-red-400 text-center">❌ Only admins can manage agents.</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <input type="text" placeholder="Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} />
            <input type="email" placeholder="Email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} />
            <input type="text" placeholder="Phone" value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} />
            <input type="password" placeholder="Password" value={newAgent.password} onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })} />
            <button onClick={handleAddAgent} className="bg-green-500 text-white py-2 px-4 rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Agent"}
            </button>
          </div>
        </>
      )}
      <table className="w-full mt-6 bg-gray-800 text-white">
        <thead>
          <tr className="bg-gray-700 text-blue-300">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? agents.map((agent) => (
            <tr key={agent._id} className="border-b border-gray-600">
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.phone}</td>
              <td>{agent.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleToggleStatus(agent._id)} className="px-3 py-1 bg-blue-500 rounded">
                  Toggle Status
                </button>
                <button onClick={() => handleDeleteAgent(agent._id)} className="ml-2 px-3 py-1 bg-red-500 rounded">
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" className="text-center py-4">No agents available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsManagement;
