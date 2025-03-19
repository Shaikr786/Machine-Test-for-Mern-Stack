import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/login"); // Prevent unauthorized access
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return <p>Loading...</p>; // ✅ Avoid rendering before user data is available

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>This is the admin dashboard.</p>
    </div>
  );
};

export default AdminDashboard;
