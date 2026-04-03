import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  FileText,
  X,
} from "lucide-react";
import Header from "../components/Header";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Active link with LEFT BORDER indicator
  const getLinkClass = (path) => {
    const base =
      "p-2 pl-3 rounded-md cursor-pointer transition-all duration-200";

    const active =
      "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium";

    const inactive =
      "text-gray-600 hover:text-blue-500 hover:bg-gray-50 hover:pl-4";

    return `${base} ${
      location.pathname === path ? active : inactive
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md p-5 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-lg font-bold text-blue-600">
            Dashboard
          </h2>
          <X
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer"
          />
        </div>

        <ul className="space-y-3">
          
          <li
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
            className={getLinkClass("/dashboard")}
          >
            Dashboard
          </li>

          <li
            onClick={() => {
              navigate("/projects");
              setSidebarOpen(false);
            }}
            className={getLinkClass("/projects")}
          >
            Browse Gigs
          </li>

          <li
            onClick={() => {
              navigate("/applications");
              setSidebarOpen(false);
            }}
            className={getLinkClass("/applications")}
          >
            My Applications
          </li>

          <li
            onClick={() => {
              navigate("/messages");
              setSidebarOpen(false);
            }}
            className={getLinkClass("/messages")}
          >
            Messages
          </li>

          <li
            onClick={() => {
              navigate("/profile");
              setSidebarOpen(false);
            }}
            className={getLinkClass("/profile")}
          >
            Profile
          </li>
        </ul>

        {/* Logout */}
        <button className="mt-10 text-red-500 hover:text-red-600 transition">
          Logout
        </button>
      </div>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <div className="p-4 md:p-6 overflow-y-auto">

          {/* Welcome */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold">
              Welcome back, John! 👋
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Here's what's happening with your projects today
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Applied Projects
                </p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
              <FileText className="text-blue-500 w-8 h-8" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Ongoing Projects
                </p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
              <Clock className="text-yellow-500 w-8 h-8" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Completed Projects
                </p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
              <CheckCircle className="text-green-500 w-8 h-8" />
            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">
              Recent Activity
            </h3>

            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 p-3 rounded-lg transition">
                <div>
                  <p className="font-medium">
                    Application Accepted{" "}
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full ml-2">
                      New
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Your application for 'Mobile App Design' was accepted
                  </p>
                </div>
                <span className="text-gray-400 text-sm">
                  2 hours ago
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 p-3 rounded-lg transition">
                <div>
                  <p className="font-medium">New Message</p>
                  <p className="text-gray-500 text-sm">
                    TechStart Inc. sent you a message
                  </p>
                </div>
                <span className="text-gray-400 text-sm">
                  5 hours ago
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;