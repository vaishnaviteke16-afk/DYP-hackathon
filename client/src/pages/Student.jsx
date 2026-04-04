import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  FileText,
  X,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  UserCircle,
  LogOut,
  TrendingUp,
  Search,
  Tag,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";

const API = "http://localhost:5000";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";

  const getLinkClass = (path) => {
    const base = "p-2 pl-3 rounded-md cursor-pointer transition-all duration-200";
    const active = "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium";
    const inactive = "text-gray-600 hover:text-blue-500 hover:bg-gray-50 hover:pl-4";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  // 👤 Fetch current user
  const fetchMe = async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) setUser(await res.json());
    } catch (_) {}
  };

  // 📋 Fetch student's applications
  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API}/api/applications/my`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (_) {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchMe();
    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Mark as Completed
  const handleMarkCompleted = async (appId) => {
    if (!window.confirm("Mark this project as completed? The client will be notified to release funds.")) return;
    try {
      const res = await fetch(`${API}/api/applications/${appId}/complete`, {
        method: "PUT",
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project marked as completed!");
        fetchApplications();
      } else {
        alert(data.msg);
      }
    } catch (_) {
      alert("Failed to update project status.");
    }
  };

  // Derived stats
  const applied = applications.length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    accepted: "bg-green-50 text-green-700 border border-green-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
    escrow: "bg-blue-50 text-blue-700 border border-blue-200",
    completed: "bg-purple-50 text-purple-700 border border-purple-200",
    released: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  const statusIcons = {
    pending: <Clock size={14} />,
    accepted: <CheckCircle size={14} />,
    rejected: <X size={14} />,
    escrow: <Briefcase size={14} />,
    completed: <TrendingUp size={14} />,
    released: <CheckCircle size={14} />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl md:shadow-lg border-r border-gray-100 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>

        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">UniHire</h2>
          <X onClick={() => setSidebarOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800 transition" />
        </div>

        <div className="hidden md:block mb-10">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">UniHire</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest">Student Portal</p>
        </div>

        <ul className="space-y-2 flex-1">
          <li onClick={() => { navigate("/student"); setSidebarOpen(false); }} className={getLinkClass("/student")}>Dashboard</li>
          <li onClick={() => { navigate("/projects"); setSidebarOpen(false); }} className={getLinkClass("/projects")}>Browse Gigs</li>
          <li onClick={() => { navigate("/applications"); setSidebarOpen(false); }} className={getLinkClass("/applications")}>My Applications</li>
          <li onClick={() => { navigate("/messages"); setSidebarOpen(false); }} className={getLinkClass("/messages")}>Messages</li>
          <li onClick={() => { navigate("/profile"); setSidebarOpen(false); }} className={getLinkClass("/profile")}>Profile</li>
        </ul>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-2 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>

        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <div className="p-6 md:p-8 overflow-y-auto z-10">

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
            </h2>
            <p className="text-gray-500 mt-1">Here's what's happening with your applications today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Applied */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Applied Projects</p>
                  <h3 className="text-4xl font-extrabold text-gray-900">{applied}</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Pending Review</p>
                  <h3 className="text-4xl font-extrabold text-gray-900">{pending}</h3>
                </div>
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Accepted */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Accepted</p>
                  <h3 className="text-4xl font-extrabold text-gray-900">{accepted}</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Applications</h3>
                <button onClick={() => navigate("/projects")} className="text-blue-600 text-sm font-medium hover:underline">Browse More</button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-10">
                  <FileText size={36} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 font-medium">You haven't applied to any jobs yet.</p>
                  <button onClick={() => navigate("/projects")} className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all">
                    Browse Gigs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app._id} className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 hover:bg-gray-50 p-4 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full shrink-0 ${app.status === "accepted" ? "bg-green-100 text-green-600" : app.status === "rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                          {statusIcons[app.status] || <Clock size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.job?.title || "Job removed"}</p>
                          <p className="text-gray-500 text-sm mt-0.5">
                            {app.job?.postedBy?.name && `Posted by ${app.job.postedBy.name}`}
                          </p>
                          {app.job?.skillsRequired?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {app.job.skillsRequired.map((s, i) => (
                                <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col items-end gap-2">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[app.paymentStatus] || statusColors[app.status] || statusColors.pending}`}>
                            {statusIcons[app.paymentStatus] || statusIcons[app.status]} {app.paymentStatus !== "pending" ? `Payment: ${app.paymentStatus}` : app.status}
                          </span>
                          
                          {app.paymentStatus === "escrow" && (
                            <button 
                              onClick={() => handleMarkCompleted(app._id)}
                              className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>

                        <span className="text-gray-400 text-xs whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full">
                          {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Promo Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white relative overflow-hidden flex flex-col hidden lg:flex">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Find Your Next Gig</h3>
              <p className="text-blue-100 mb-6 relative z-10">
                {user?.skills?.length > 0
                  ? `Explore projects matching your skills in ${user.skills.slice(0, 2).join(" & ")}.`
                  : "Explore projects that match your skills."}
              </p>
              <button onClick={() => navigate("/projects")} className="w-full mt-auto py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all relative z-10">
                Browse All Gigs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;