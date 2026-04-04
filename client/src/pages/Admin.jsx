import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  LayoutDashboard,
  Briefcase,
  UserCircle,
  LogOut,
  X,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  BadgeCheck,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [removingId, setRemovingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // users, jobs, applications
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (path) => {
    const base = "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium";
    const active = "bg-red-50 text-red-600";
    const inactive = "text-gray-500 hover:text-gray-800 hover:bg-gray-50";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers(mockUsers);
      }
    } catch (_) {
      setUsers(mockUsers);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs/admin/all", {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setAllJobs(await res.json());
      }
    } catch (_) {}
  };

  const fetchAllApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/applications/admin/all", {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setAllApplications(await res.json());
      }
    } catch (_) {}
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchAllJobs(), fetchAllApplications()]);
    setLoading(false);
  };

  const verifyUser = async (id) => {
    setVerifyingId(id);
    try {
      await fetch(`http://localhost:5000/api/auth/verify/${id}`, {
        method: "PUT",
        headers: { Authorization: authHeader },
      });
      fetchUsers();
    } finally {
      setVerifyingId(null);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Remove this user permanently?")) return;
    setRemovingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      if (res.ok) fetchUsers();
      else alert("Failed to remove user.");
    } finally {
      setRemovingId(null);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      if (res.ok) fetchAllJobs();
    } catch (_) {}
  };

  const updateAppStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAllApplications();
    } catch (_) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadAllData();
  }, []);

  // Mock data used as fallback
  const mockUsers = [
    { _id: "1", name: "Ananya Sharma", email: "ananya@dyp.edu", role: "student", isVerified: false, college: "DYP Institute" },
    { _id: "2", name: "Rohan Mehta", email: "rohan@vjti.ac.in", role: "student", isVerified: true, college: "VJTI Mumbai" },
    { _id: "3", name: "TechStart Inc.", email: "hr@techstart.com", role: "client", isVerified: true, company: "TechStart" },
    { _id: "4", name: "Priya Desai", email: "priya@spit.ac.in", role: "student", isVerified: false, college: "SPIT Mumbai" },
    { _id: "5", name: "BuildCo Ltd.", email: "contact@buildco.io", role: "client", isVerified: false, company: "BuildCo" },
  ];

  const displayUsers = users.length > 0 ? users : mockUsers;

  const filteredUsers = displayUsers.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: "Total Users", value: displayUsers.length, icon: Users, color: "blue" },
    { label: "Students", value: displayUsers.filter((u) => u.role === "student").length, icon: UserCircle, color: "purple" },
    { label: "Clients", value: displayUsers.filter((u) => u.role === "client").length, icon: Briefcase, color: "green" },
    { label: "Total Gigs", value: allJobs.length, icon: Briefcase, color: "blue" },
    { label: "Total Applications", value: allApplications.length, icon: MessageSquare, color: "yellow" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", border: "hover:border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", border: "hover:border-purple-100" },
    green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600", border: "hover:border-green-100" },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-600", border: "hover:border-yellow-100" },
  };

  const roleBadge = {
    student: "bg-blue-50 text-blue-700 border border-blue-100",
    client: "bg-purple-50 text-purple-700 border border-purple-100",
    admin: "bg-red-50 text-red-700 border border-red-100",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl md:shadow-lg border-r border-gray-100 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>

        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-black text-red-600 tracking-tight">UniHire</h2>
          <X onClick={() => setSidebarOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800 transition" size={20} />
        </div>

        <div className="hidden md:block mb-10">
          <h2 className="text-2xl font-black text-red-600 tracking-tight">UniHire</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest text-red-500/60">System Controller</p>
        </div>

        <nav className="space-y-1 flex-1">
          <div onClick={() => setActiveTab("users")} className={getLinkClass("/admin") + (activeTab === "users" ? " bg-red-50 text-red-600" : "")}>
            <Users size={18} /> Manage Users
          </div>
          <div onClick={() => setActiveTab("jobs")} className={getLinkClass("/admin/projects") + (activeTab === "jobs" ? " bg-red-50 text-red-600" : "")}>
            <Briefcase size={18} /> All Projects
          </div>
          <div onClick={() => setActiveTab("applications")} className={getLinkClass("/admin/messages") + (activeTab === "applications" ? " bg-red-50 text-red-600" : "")}>
            <MessageSquare size={18} /> All Applications
          </div>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium mt-auto">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[32rem] h-96 bg-red-200/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/10 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Control Center</h1>
              <p className="text-xs text-gray-400">Full platform management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100">
            <ShieldCheck size={14} /> Admin Access
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto z-10">

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Platform Overview 👑
            </h2>
            <p className="text-gray-500 mt-1">Monitor users, verify students, and manage the platform.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <div key={label} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ${c.border} hover:shadow-md transition-all group overflow-hidden relative`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 ${c.bg} rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform`}></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                      <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                    </div>
                    <div className={`p-2.5 ${c.icon} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Verifications Alert */}
          {filteredUsers.filter(u => !u.isVerified && u.role === "student").length > 0 && (
            <div className="mb-6 flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-5 py-4 rounded-2xl">
              <AlertTriangle size={20} className="text-yellow-600 shrink-0" />
              <p className="text-sm font-medium">
                <span className="font-bold">{filteredUsers.filter(u => !u.isVerified && u.role === "student").length} students</span> are waiting for verification. Review and approve them below.
              </p>
            </div>
          )}          {/* Dashboard Content Switching */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <h3 className="text-xl font-bold text-gray-900">All Users</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-52 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="p-5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${user.role === "student" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}> {user.name?.[0]?.toUpperCase()} </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${roleBadge[user.role]}`}>{user.role}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.role === "student" && !user.isVerified && (
                          <button onClick={() => verifyUser(user._id)} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl">Verify</button>
                        )}
                        <button onClick={() => removeUser(user._id)} className="px-3 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-xl font-bold text-gray-900">All Projects</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {allJobs.map((job) => (
                  <div key={job._id} className="p-5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{job.title}</h4>
                        <p className="text-gray-400 text-sm">Posted by: {job.postedBy?.name || "Unknown"}</p>
                        <p className="text-gray-500 text-sm mt-1">{job.description.substring(0, 100)}...</p>
                      </div>
                      <button onClick={() => deleteJob(job._id)} className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-xl font-bold text-gray-900">All Applications</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {allApplications.map((app) => (
                  <div key={app._id} className="p-5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{app.job?.title || "Removed Job"}</h4>
                        <p className="text-gray-400 text-sm">Applicant: {app.student?.name} ({app.student?.email})</p>
                        <p className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${app.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{app.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateAppStatus(app._id, "accepted")} className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={18} /></button>
                        <button onClick={() => updateAppStatus(app._id, "rejected")} className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}