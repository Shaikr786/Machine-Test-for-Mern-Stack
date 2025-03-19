import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle role-based redirection
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("🔹 Checking role for redirection:", user.role);

      if (user.role === "admin") {
        console.log("✅ Redirecting Admin to /admin-dashboard");
        navigate("/admin-dashboard");
      } else {
        console.log("✅ Redirecting Agent to /agent-dashboard");
        navigate("/agent-dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login({ email, password });

    if (res.success) {
      toast.success("Login successful!");
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 border border-orange-500">
        <h2 className="text-3xl font-bold text-center text-orange-400 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
