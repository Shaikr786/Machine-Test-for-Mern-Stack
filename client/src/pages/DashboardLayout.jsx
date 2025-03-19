import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
