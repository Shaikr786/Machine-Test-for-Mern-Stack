import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Profile from "./components/UserProfile";
import Logout from "./components/Logout";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/*" 
            element={
              <>
                <Navbar /> {/* ✅ Navbar appears in all protected pages */}
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="admin-dashboard" element={<AdminDashboard />} />
                  <Route path="agent-dashboard" element={<AgentDashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="logout" element={<Logout />} />
                </Routes>
              </>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;


