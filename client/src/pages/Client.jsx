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
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

const API = "http://127.0.0.1:5000";

export default function ClientDashboard() {
  // ... existing states ...
  const [view, setView] = useState("overview"); // 'overview' or 'applicants'
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [updatingApp, setUpdatingApp] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (v) => {
    const base = "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium";
    const active = "bg-blue-50 text-blue-600 border-l-4 border-blue-600";
    const inactive = "text-gray-500 hover:text-gray-800 hover:bg-gray-50";
    return `${base} ${view === v ? active : inactive}`;
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

  // 📋 Fetch client's own jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/api/jobs/my-jobs`, {
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (_) {
      setJobs([]);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchMe();
    fetchJobs();
  }, []);

  // ➕ Post a new job
  const postJob = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }
    setIsPosting(true);
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          title,
          description,
          skillsRequired: skills.split(",").map((s) => s.trim()).filter(Boolean),
          budget,
          deadline,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg); return; }
      setShowPostForm(false);
      setTitle(""); setDescription(""); setSkills(""); setBudget(""); setDeadline("");
      fetchJobs();
    } catch (err) {
      alert("Failed to post job.");
    } finally {
      setIsPosting(false);
    }
  };

  // 🗑️ Delete a job
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job? All applications will also be removed.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg); return; }
      fetchJobs();
    } catch (_) {
      alert("Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅❌ Update application status
  const updateAppStatus = async (appId, status) => {
    setUpdatingApp(appId);
    try {
      const res = await fetch(`${API}/api/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg); return; }
      fetchJobs(); // This will refresh the whole list including nested applicants
    } catch (_) {
      alert("Failed to update status.");
    } finally {
      setUpdatingApp(null);
    }
  };

  // 💬 Initiate chat with student
  const initiateChat = async (studentId) => {
    try {
      const res = await fetch(`${API}/api/messages/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ recipientId: studentId }),
      });
      if (res.ok) {
        navigate("/messages"); // Redirect to inbox to start chatting
      } else {
        alert("Could not start conversation.");
      }
    } catch (_) {
      alert("Error initiating chat.");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
  const allApplicants = jobs.flatMap(j => (j.applicants || []).map(a => ({ 
    ...a, 
    jobTitle: j.title, 
    jobBudget: j.budget,
    paymentStatus: a.paymentStatus || "pending" 
  })));

  const acceptedApps = jobs.reduce(
    (sum, j) => sum + (j.applicants?.filter((a) => a.status === "accepted").length || 0),
    0
  );

  const stats = [
    { label: "Active Projects", value: jobs.filter((j) => j.status === "open").length, icon: Briefcase, color: "blue" },
    { label: "Total Applicants", value: totalApplicants, icon: Users, color: "purple" },
    { label: "Hired Students", value: acceptedApps, icon: TrendingUp, color: "green" },
    { label: "Total Posted", value: jobs.length, icon: Clock, color: "yellow" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", blob: "bg-blue-50", border: "hover:border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", blob: "bg-purple-50", border: "hover:border-purple-100" },
    green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600", blob: "bg-green-50", border: "hover:border-green-100" },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-600", blob: "bg-yellow-50", border: "hover:border-yellow-100" },
  };

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    accepted: "bg-green-50 text-green-700 border border-green-100",
    rejected: "bg-red-50 text-red-700 border border-red-100",
    escrow: "bg-blue-50 text-blue-700 border border-blue-100",
    completed: "bg-purple-50 text-purple-700 border border-purple-100",
    released: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  };

  // 💳 Razorpay Hire & Pay
  const handleHireAndPay = async (appId, budgetStr) => {
    try {
      // 🧼 Clean budget string (remove ₹, commas, etc.)
      const amount = parseFloat(String(budgetStr).replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid project budget.");
        return;
      }

      const keyRes = await fetch(`${API}/api/payments/key`, { headers: { Authorization: authHeader } });
      const { key } = await keyRes.json();

      const res = await fetch(`${API}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({ applicationId: appId, amount }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg); return; }

      // 🛠️ DUMMY MODE: If backend says it's a mock order, skip real Razorpay checkout
      if (data.isMock) {
        if (!window.confirm("Simulate payment? (v2.0 Fix Enabled)")) return;
        
        const verifyRes = await fetch(`${API}/api/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: authHeader },
          body: JSON.stringify({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: `pay_mock_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_signature: "mock_signature", 
            applicationId: appId,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          alert("Payment Simulated Successfully! Funds held in escrow.");
          fetchJobs();
        } else {
          alert(verifyData.msg);
        }
        return;
      }

      // Real Razorpay flow
      const options = {
        key: key || "rzp_test_placeholder_id", 
        amount: data.amount,
        currency: data.currency,
        name: "UniHire",
        description: "Project Escrow Payment",
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await fetch(`${API}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: authHeader },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              applicationId: appId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert("Payment Successful! Funds held in escrow.");
            fetchJobs();
          } else {
            alert(verifyData.msg);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Hire & Pay Error:", err);
      alert(`Payment initiation failed: ${err.message || "Unknown error"}. Check console for details.`);
    }
  };

  // 🔓 Release Funds
  const handleApproveAndRelease = async (appId) => {
    if (!window.confirm("Approve work and release funds to student? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/api/applications/${appId}/approve`, {
        method: "PUT",
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Funds released successfully!");
        fetchJobs();
      } else {
        alert(data.msg);
      }
    } catch (_) {
      alert("Failed to release funds.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl md:shadow-lg border-r border-gray-100 p-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="flex justify-between items-center mb-10 md:hidden">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">UniHire</h2>
          <X onClick={() => setSidebarOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800 transition" />
        </div>
        <div className="hidden md:block mb-12">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight italic">Uni<span className="text-gray-900">Hire</span></h2>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest leading-relaxed">Client Portal</p>
        </div>
        <nav className="space-y-1 flex-1">
          <div onClick={() => {setView("overview"); setSidebarOpen(false);}} className={getLinkClass("overview")}><LayoutDashboard size={18} /> Overview</div>
          <div onClick={() => {setView("applicants"); setSidebarOpen(false);}} className={getLinkClass("applicants")}><Users size={18} /> Applicants</div>
          <div onClick={() => navigate("/messages")} className="flex items-center gap-3 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all text-sm font-medium cursor-pointer"><MessageSquare size={18} /> Messages</div>
          <div onClick={() => navigate("/profile")} className="flex items-center gap-3 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all text-sm font-medium cursor-pointer"><UserCircle size={18} /> Profile</div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium mt-auto group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Dynamic Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 py-4 relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <LayoutDashboard size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {view === "overview" ? "Dashboard Overview" : "Manage Applicants"}
            </h1>
          </div>
          <button onClick={() => setShowPostForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 group">
             <PlusCircle size={18} /> Post New Project
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto z-10">
          {view === "overview" ? (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map(({ label, value, icon: Icon, color }) => {
                  const c = colorMap[color];
                  return (
                    <div key={label} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-gray-200 group relative overflow-hidden`}>
                      <div className={`absolute -right-4 -top-4 w-24 h-24 ${c.bg} rounded-full filter blur-2xl opacity-50 group-hover:scale-150 transition-transform`}></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
                          <h3 className="text-4xl font-black text-gray-900">{value}</h3>
                        </div>
                        <div className={`p-3 ${c.icon} rounded-2xl`}>
                          <Icon size={24} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Projects List */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight italic">Active Assignments</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{jobs.length} Posted</p>
                </div>
                {jobs.length === 0 ? (
                  <div className="p-20 text-center">
                    <Briefcase size={48} className="mx-auto text-gray-100 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Projects Live</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {jobs.map(job => (
                      <div key={job._id} className="p-6 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                        <div className="flex-1 min-w-0 pr-8">
                           <div className="flex items-center gap-3 mb-2">
                             <h4 className="text-base font-black text-gray-900 truncate">{job.title}</h4>
                             <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${job.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400 font-medium tracking-tight"}`}>{job.status}</span>
                           </div>
                           <p className="text-sm text-gray-500 font-medium line-clamp-1 mb-3">{job.description}</p>
                           <div className="flex flex-wrap gap-2">
                              {job.skillsRequired?.map((s, i) => (
                                <span key={i} className="text-[10px] font-black uppercase tracking-tighter bg-gray-100 text-gray-600 px-3 py-1 rounded-lg"># {s}</span>
                              ))}
                           </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                           <div className="text-right mr-4 hidden sm:block">
                              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Applicants</p>
                              <p className="text-lg font-black text-blue-600 leading-none mt-1">{job.applicants?.length || 0}</p>
                           </div>
                           <button onClick={() => setView("applicants")} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group-hover:scale-110">
                              <ChevronRight size={20} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Applicants Unified View */
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
               <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight italic">Candidates Pipeline</h3>
                  <button onClick={() => setView("overview")} className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                    <LayoutDashboard size={14} /> Back to Overview
                  </button>
               </div>
               {allApplicants.length === 0 ? (
                 <div className="p-32 text-center">
                    <Users size={64} className="mx-auto text-gray-100 mb-6" />
                    <p className="text-gray-400 font-black uppercase tracking-widest">Waiting for Talent...</p>
                 </div>
               ) : (
                 <div className="divide-y divide-gray-50">
                    {allApplicants.map((app, i) => (
                      <div key={app.applicationId || i} className="p-8 hover:bg-gray-50/50 transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                           {/* Student Profile Card */}
                           <div className="flex items-center gap-5 min-w-[280px]">
                              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-xl shrink-0">
                                {app.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                 <h4 className="text-lg font-black text-gray-900 leading-none mb-1">{app.name}</h4>
                                 <p className="text-xs text-gray-400 font-bold tracking-tight mb-2">{app.email}</p>
                                 <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{app.college}</p>
                              </div>
                           </div>

                           {/* Proposal Details */}
                           <div className="flex-1 bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Applied for: <span className="text-gray-700">{app.jobTitle}</span></p>
                              <p className="text-sm text-gray-600 font-medium leading-relaxed italic mb-4">"{app.message || "I am highly interested in this project..."}"</p>
                              <div className="flex flex-wrap gap-2">
                                 {app.skills?.map((s, idx) => (
                                   <span key={idx} className="text-[10px] font-black tracking-tight bg-white text-blue-600 border border-blue-100 px-3 py-1 rounded-xl truncate max-w-[120px]">{s}</span>
                                 ))}
                              </div>
                           </div>

                           {/* Decision Actions */}
                           <div className="flex flex-row lg:flex-col gap-3 min-w-[140px]">
                              <div className={`text-center py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-1 ${statusColors[app.paymentStatus] || statusColors[app.status]}`}>
                                 {app.paymentStatus !== "pending" ? `Payment: ${app.paymentStatus}` : app.status}
                              </div>
                              
                              {/* 1. Pending -> Accept/Reject */}
                              {app.status === "pending" && (
                                <>
                                  <button onClick={() => updateAppStatus(app.applicationId, "accepted")} disabled={updatingApp === app.applicationId} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3 px-4 text-xs font-black shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                     <CheckCircle size={14}/> Accept
                                  </button>
                                  <button onClick={() => updateAppStatus(app.applicationId, "rejected")} disabled={updatingApp === app.applicationId} className="flex-1 bg-red-50 text-red-600 border border-red-100 rounded-2xl py-3 px-4 text-xs font-black hover:bg-red-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                     <XCircle size={14}/> Decline
                                  </button>
                                </>
                              )}

                              {/* 2. Accepted & Payment Pending -> Hire & Pay */}
                              {app.status === "accepted" && app.paymentStatus === "pending" && (
                                <button onClick={() => handleHireAndPay(app.applicationId, app.jobBudget || 0)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 px-4 text-xs font-black shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                                   <Briefcase size={14}/> Hire & Pay
                                </button>
                              )}

                              {/* 3. Completed -> Approve & Release */}
                              {app.paymentStatus === "completed" && (
                                <button onClick={() => handleApproveAndRelease(app.applicationId)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 px-4 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                                   <CheckCircle size={14}/> Approve & Release
                                </button>
                              )}

                              <button onClick={() => initiateChat(app._id)} className="flex-1 bg-blue-50 text-blue-600 rounded-2xl py-3 px-4 text-xs font-black transition-all flex items-center justify-center gap-2 hover:bg-blue-100">
                                 <MessageSquare size={14}/> Chat
                              </button>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Post Project Modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md text-left">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPostForm(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
            <div className="mb-10 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><PlusCircle size={28} /></div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Initiate Project</h3>
              </div>
              <p className="text-gray-400 font-medium">Outline your requirements to attract the best collegiate talent.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Project Identifier</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Architecture with Next.js"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-gray-300 shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Core Objectives</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Elaborate on the project scope and deliverables..." rows={5}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-gray-300 shadow-inner resize-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Required Expertise (Comma Separated)</label>
                <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Tailwind, Express..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-gray-300 shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Valuation</label>
                  <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="₹ 10,000"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-gray-300 shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Timeline</label>
                  <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="4 Weeks"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-gray-300 shadow-inner" />
                </div>
              </div>
              <button 
                onClick={postJob} 
                disabled={isPosting} 
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isPosting ? "Processing..." : <>Deploy Project <ArrowRight size={20} /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}