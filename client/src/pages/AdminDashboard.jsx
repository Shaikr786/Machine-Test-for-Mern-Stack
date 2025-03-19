import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/SidebarComponent";
import { useState } from "react";
import AgentsManagement from "../components/AgentsManagement";
import TasksManagement from "../components/TasksManagement";
import CSVUpload from "../components/CSVUpload";
import NavbarComponent from "../components/NavbarComponent";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarComponent activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarComponent />

        {/* Page Content */}
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          {activeTab === "dashboard" && <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>}
          {activeTab === "agents" && <AgentsManagement />}
          {activeTab === "tasks" && <TasksManagement />}
          {activeTab === "csv-upload" && <CSVUpload />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
