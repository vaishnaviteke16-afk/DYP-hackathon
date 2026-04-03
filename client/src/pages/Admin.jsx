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

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (path) => {
    const base = "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium";
    const active = "bg-red-50 text-red-600";
    const inactive = "text-gray-500 hover:text-gray-800 hover:bg-gray-50";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/api/auth/users", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers(mockUsers));
  };

  const verifyUser = async (id) => {
    await fetch(`http://localhost:5000/api/auth/verify/${id}`, {
      method: "PUT",
      headers: { Authorization: token },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
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
    { label: "Pending Verifications", value: displayUsers.filter((u) => !u.isVerified && u.role === "student").length, icon: Clock, color: "yellow" },
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
          <h2 className="text-xl font-black text-red-600 tracking-tight">VerifiedGigs</h2>
          <X onClick={() => setSidebarOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800 transition" size={20} />
        </div>

        <div className="hidden md:block mb-10">
          <h2 className="text-2xl font-black text-red-600 tracking-tight">VerifiedGigs</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest">Admin Console</p>
        </div>

        <nav className="space-y-1 flex-1">
          <div onClick={() => navigate("/admin")} className={getLinkClass("/admin")}>
            <LayoutDashboard size={18} /> Overview
          </div>
          <div onClick={() => navigate("/admin/users")} className={getLinkClass("/admin/users")}>
            <Users size={18} /> Manage Users
          </div>
          <div onClick={() => navigate("/admin/verifications")} className={getLinkClass("/admin/verifications")}>
            <ShieldCheck size={18} /> Verifications
          </div>
          <div onClick={() => navigate("/admin/projects")} className={getLinkClass("/admin/projects")}>
            <Briefcase size={18} /> All Projects
          </div>
          <div onClick={() => navigate("/admin/messages")} className={getLinkClass("/admin/messages")}>
            <MessageSquare size={18} /> Messages
          </div>
        </nav>

        <button className="flex items-center gap-3 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium mt-auto">
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
          )}

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <h3 className="text-xl font-bold text-gray-900">All Users</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-none">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full sm:w-52 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  {/* Filter */}
                  <div className="relative">
                    <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="client">Clients</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 font-medium">No users found.</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user._id} className="p-5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${user.role === "student" ? "bg-blue-100 text-blue-600" : user.role === "admin" ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"}`}>
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${roleBadge[user.role] || roleBadge.client}`}>
                              {user.role}
                            </span>
                            {user.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-100 text-xs font-bold px-2 py-0.5 rounded-full">
                                <BadgeCheck size={12} /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 border border-yellow-100 text-xs font-bold px-2 py-0.5 rounded-full">
                                <Clock size={12} /> Pending
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
                          {user.college && <p className="text-gray-400 text-xs mt-0.5">{user.college}</p>}
                          {user.company && <p className="text-gray-400 text-xs mt-0.5">{user.company}</p>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {user.role === "student" && !user.isVerified && (
                          <button
                            onClick={() => verifyUser(user._id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-green-500/30 transition-all"
                          >
                            <CheckCircle size={15} /> Verify
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-all">
                          <XCircle size={15} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}