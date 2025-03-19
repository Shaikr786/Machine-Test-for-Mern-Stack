import { useEffect, useState } from "react";
import api from "../utils/api"; // Importing API instance

const AgentsManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState({});  // To store validation errors

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      console.log("Fetching agents...");
      const { data } = await api.get("/agents");
      console.log("Fetched agents data:", data);  // Log the response data
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };
  

  const handleAddAgent = async () => {
    const validationErrors = validateForm(newAgent);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      console.log("Adding agent:", newAgent);
      try {
        const response = await api.post("/agents", newAgent);
        console.log("Agent added successfully:", response.data);
        
        // Instead of fetching the agents again, directly add the new agent to the state
        setAgents((prevAgents) => [...prevAgents, response.data.agent]);
  
        setNewAgent({ name: "", email: "", mobile: "", password: "" });
      } catch (error) {
        console.error("Error adding agent", error);
      }
    } else {
      console.log("Validation errors:", validationErrors);
    }
  };
  
  const handleDeleteAgent = async (id) => {
    console.log("Deleting agent with ID:", id);  // Log agent deletion
    try {
      await api.delete(`/agents/${id}`);
      console.log("Agent deleted successfully.");  // Log successful agent deletion
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent", error);
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    // Name Validation
    if (!formData.name) {
      errors.name = "Name is required.";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    // Email Validation
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Mobile Validation (Only digits)
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\d+$/.test(formData.mobile)) {
      errors.mobile = "Please enter a valid mobile number (digits only).";
    }

    // Password Validation
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    return errors;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Agents Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newAgent.name}
          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          value={newAgent.email}
          onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="text"
          placeholder="Mobile"
          value={newAgent.mobile}
          onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })}
        />
        {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}

        <input
          type="password"
          placeholder="Password"
          value={newAgent.password}
          onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        <button onClick={handleAddAgent}>Add Agent</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.mobile}</td>
              <td>
                <button onClick={() => handleDeleteAgent(agent._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsManagement;
