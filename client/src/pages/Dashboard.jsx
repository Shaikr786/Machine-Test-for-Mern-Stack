import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/agent-dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return <p>Redirecting...</p>;
};

export default Dashboard;
