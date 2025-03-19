import React from "react";

const SidebarComponent = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-blue-600 text-white h-full p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li
          className={`cursor-pointer ${activeTab === "dashboard" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={`cursor-pointer ${activeTab === "agents" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("agents")}
        >
          Agents Management
        </li>
        <li
          className={`cursor-pointer ${activeTab === "tasks" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks Management
        </li>
        <li
          className={`cursor-pointer ${activeTab === "csv-upload" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("csv-upload")}
        >
          CSV Upload & Distribution
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
