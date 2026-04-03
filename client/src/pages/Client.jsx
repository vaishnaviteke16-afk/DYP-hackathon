import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Users,
  PlusCircle,
  X,
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  LogOut,
  ChevronRight,
  Tag,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function ClientDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (path) => {
    const base = "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium";
    const active = "bg-blue-50 text-blue-600";
    const inactive = "text-gray-500 hover:text-gray-800 hover:bg-gray-50";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  const postJob = async () => {
    setIsPosting(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ title, description, skillsRequired: skills.split(",").map(s => s.trim()) })
      });
      await res.json();
      setShowPostForm(false);
      setTitle(""); setDescription(""); setSkills("");
      fetchJobs();
    } finally {
      setIsPosting(false);
    }
  };

  const fetchJobs = () => {
    fetch("http://localhost:5000/api/jobs/my-jobs", { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchJobs(); }, []);

  // Mock stats
  const stats = [
    { label: "Active Projects", value: jobs.length || 2, icon: Briefcase, color: "blue" },
    { label: "Total Applicants", value: 14, icon: Users, color: "purple" },
    { label: "Hired Students", value: 5, icon: TrendingUp, color: "green" },
    { label: "Avg. Response Time", value: "1.2d", icon: Clock, color: "yellow" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", blob: "bg-blue-50", border: "hover:border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", blob: "bg-purple-50", border: "hover:border-purple-100" },
    green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600", blob: "bg-green-50", border: "hover:border-green-100" },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-600", blob: "bg-yellow-50", border: "hover:border-yellow-100" },
  };

  const mockJobs = [
    { _id: "1", title: "React + Node.js Developer", description: "Build a SaaS dashboard with authentication.", skillsRequired: ["React", "Node.js"], applicants: [{ name: "Ananya" }, { name: "Rohan" }] },
    { _id: "2", title: "UI/UX Designer", description: "Design wireframes and high-fidelity mockups for a mobile app.", skillsRequired: ["Figma", "Design Systems"], applicants: [{ name: "Priya" }] },
  ];
  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl md:shadow-lg border-r border-gray-100 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>

        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">VerifiedGigs</h2>
          <X onClick={() => setSidebarOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800 transition" size={20} />
        </div>

        <div className="hidden md:block mb-10">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">VerifiedGigs</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest">Business Portal</p>
        </div>

        <nav className="space-y-1 flex-1">
          <div onClick={() => navigate("/client")} className={getLinkClass("/client")}>
            <LayoutDashboard size={18} /> Overview
          </div>
          <div onClick={() => navigate("/projects")} className={getLinkClass("/projects")}>
            <Briefcase size={18} /> My Projects
          </div>
          <div onClick={() => navigate("/applications")} className={getLinkClass("/applications")}>
            <Users size={18} /> Applicants
          </div>
          <div onClick={() => navigate("/messages")} className={getLinkClass("/messages")}>
            <MessageSquare size={18} /> Messages
          </div>
          <div onClick={() => navigate("/profile")} className={getLinkClass("/profile")}>
            <UserCircle size={18} /> Profile
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
        <div className="absolute top-0 right-0 w-[32rem] h-96 bg-purple-300/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-xs text-gray-400">TechStart Inc.</p>
            </div>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-blue-500/30 transition-all duration-200 group"
          >
            <PlusCircle size={17} />
            Post Project
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto z-10">

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back! 🏢
            </h2>
            <p className="text-gray-500 mt-1">Here's your hiring overview for today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <div key={label} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ${c.border} hover:shadow-md transition-all group overflow-hidden relative`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 ${c.blob} rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform`}></div>
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

          {/* Jobs Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Posted Projects</h3>
              <button onClick={() => setShowPostForm(true)} className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                <PlusCircle size={15} /> New Project
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {displayJobs.map((job, idx) => (
                <div key={job._id || idx} className="p-6 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base">{job.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(job.skillsRequired || []).map((s, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                            <Tag size={11} />{s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Users size={14} />{job.applicants?.length || 0} applicants
                      </span>
                    </div>
                  </div>

                  {job.applicants?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Applicants</p>
                      <div className="flex flex-wrap gap-2">
                        {job.applicants.map((u, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                            <UserCircle size={13} /> {u.name} {u.email && <span className="text-green-400">({u.email})</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-100">
            <button onClick={() => setShowPostForm(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><FileText size={22} /></div>
                <h3 className="text-xl font-extrabold text-gray-900">Post a New Project</h3>
              </div>
              <p className="text-gray-500 text-sm">Find the perfect student for your needs.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. React Developer for SaaS App"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project, scope, and deliverables..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Skills</label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Figma (comma-separated)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPostForm(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all">
                  Cancel
                </button>
                <button
                  onClick={postJob}
                  disabled={isPosting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  {isPosting ? "Posting..." : (
                    <><PlusCircle size={17} /> Post Project</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}