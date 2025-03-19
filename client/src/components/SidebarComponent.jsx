import React from "react";

const SidebarComponent = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-full p-6 shadow-lg border-r border-gray-700">
      {/* Sidebar Title */}
      <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">Admin Panel</h2>

      {/* Sidebar Menu */}
      <ul className="space-y-4">
        {[
          { name: "Dashboard", id: "dashboard" },
          { name: "Agents Management", id: "agents" },
          { name: "Tasks Management", id: "tasks" },
          { name: "CSV Upload & Distribution", id: "csv-upload" },
        ].map((tab) => (
          <li
            key={tab.id}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-orange-500 text-gray-900 font-bold shadow-md"
                : "hover:bg-gray-700 hover:text-orange-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarComponent;
