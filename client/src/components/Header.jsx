import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isHomeOrDashboard = ["/", "/student", "/client", "/admin"].includes(location.pathname);

  const fetchUnreadCount = async () => {
    if (!token) return;
    const userId = user._id || localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`${API}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const conversations = await res.json();
        const total = conversations.reduce((acc, conv) => {
          return acc + (conv.unreadCount[userId] || 0);
        }, 0);
        setUnreadCount(total);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Polling for notifications
    return () => clearInterval(interval);
  }, [token]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/student") return "Student Dashboard";
    if (path === "/client") return "Business Console";
    if (path === "/admin") return "Admin Control";
    if (path === "/messages") return "Inbox";
    if (path === "/profile") return "User Profile";
    if (path === "/projects") return "Available Gigs";
    return "Portal";
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle / Back Button */}
        {!isHomeOrDashboard ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 text-gray-600"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        )}

        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="bg-transparent border-none outline-none text-xs w-32 focus:w-48 transition-all font-medium"
          />
        </div>
        
        <button 
          onClick={() => navigate("/messages")}
          className="p-2 relative hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-blue-600"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;