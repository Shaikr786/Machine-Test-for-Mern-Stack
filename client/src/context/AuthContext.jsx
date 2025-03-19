import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUser(); // Load user if already logged in
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const res = await api.get("/auth/me");
      
      // ✅ Ensure correct structure: Extract `user`
      setUser(res.data.user);
      setIsAuthenticated(true);
  
      console.log("🔹 Fetched User Profile:", res.data.user); // Should now log correctly
    } catch (error) {
      console.error("❌ Failed to fetch user:", error.response?.data || error.message);
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      
      // ✅ Extract `user` correctly
      setUser(res.data.user);
      setIsAuthenticated(true);
  
      console.log("🔹 Logged In User:", res.data.user); // Should now log correctly
  
      return { success: true, user: res.data.user };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
