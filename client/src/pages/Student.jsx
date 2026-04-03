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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl md:shadow-lg border-r border-gray-100 p-6 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">
            VerifiedGigs
          </h2>
          <X
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
          />
        </div>

        <div className="hidden md:block mb-10">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">
            VerifiedGigs
          </h2>
        </div>

        <ul className="space-y-2 flex-1">
          
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
        <button className="mt-auto flex items-center p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium">
          Logout
        </button>
      </div>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none mix-blend-multiply pointer-events-none"></div>
        
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <div className="p-6 md:p-8 overflow-y-auto z-10 custom-scrollbar">

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, John! 👋
            </h2>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Applied Projects
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-900">12</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Ongoing Projects
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-900">3</h3>
                </div>
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Completed Projects
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-900">8</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 hover:bg-gray-50 p-4 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600 shrink-0">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Application Accepted
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-3 uppercase tracking-wider relative -top-0.5">
                          New
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Your application for <span className="font-medium text-gray-700">Mobile App Design</span> was accepted by TechStart Inc.
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full shrink-0">
                    2 hours ago
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 hover:bg-gray-50 p-4 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">New Message</p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        TechStart Inc. sent you a message regarding the design project.
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full shrink-0">
                    5 hours ago
                  </span>
                </div>

              </div>
            </div>

            {/* Quick Actions or Recommendations (Mockup side panel) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white relative overflow-hidden flex flex-col hidden lg:flex">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                
                <h3 className="text-xl font-bold mb-2 relative z-10">Find Your Next Gig</h3>
                <p className="text-blue-100 mb-6 relative z-10">Explore projects that match your skills in React and Tailwind.</p>
                
                <div className="space-y-3 mt-auto relative z-10">
                  <div className="bg-white/10 hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm cursor-pointer transition border border-white/10">
                    <p className="font-semibold text-sm">Fullstack Developer Needed</p>
                    <p className="text-blue-200 text-xs mt-1">$500 • 2 weeks</p>
                  </div>
                  <div className="bg-white/10 hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm cursor-pointer transition border border-white/10">
                    <p className="font-semibold text-sm">UI Designer for SaaS App</p>
                    <p className="text-blue-200 text-xs mt-1">$300 • 1 week</p>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all">
                  Browse All
                </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;