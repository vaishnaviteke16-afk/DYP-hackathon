import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Clock, CheckCircle, XCircle, Search, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/applications/my`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } else {
        const errData = await res.json();
        setError(errData.msg || "Failed to load applications.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, []);

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

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    accepted: "bg-green-50 text-green-600 border border-green-100",
    rejected: "bg-red-50 text-red-600 border border-red-100",
    escrow: "bg-blue-50 text-blue-600 border border-blue-100",
    completed: "bg-purple-50 text-purple-600 border border-purple-100",
    released: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    accepted: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />,
    escrow: <CheckCircle size={16} />,
    completed: <Clock size={16} />,
    released: <CheckCircle size={16} />,
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <div className="p-6 md:p-10 max-w-5xl mx-auto w-full relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/5 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/5 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Applications</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Track your status and manage your ongoing project proposals</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
            <XCircle size={48} className="mx-auto text-red-300 mb-4" />
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={fetchApplications} className="mt-4 px-6 py-2 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-all">Retry Synchronization</button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Search size={48} className="mx-auto text-gray-100 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">You haven't applied to any gigs yet. Explore new opportunities to get started!</p>
            <button onClick={() => navigate("/projects")} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Browse Gigs 🚀</button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-xl font-black text-gray-900 leading-tight">{app.job?.title || "Project Title Unavailable"}</h2>
                       <span className={`flex items-center gap-1 text-[10px] uppercase font-black px-3 py-1 rounded-full ${statusColors[app.paymentStatus || "pending"] || statusColors[app.status] || "bg-gray-100"}`}>
                         {statusIcons[app.paymentStatus || "pending"] || statusIcons[app.status]} {app.paymentStatus && app.paymentStatus !== "pending" ? `Payment: ${app.paymentStatus}` : app.status}
                       </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{app.job?.postedBy?.name ? `Posted by: ${app.job.postedBy.name}` : "External Opportunity"}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 text-gray-700">Budget: ₹{app.job?.budget || "Negotiable"}</span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 text-gray-700">Applied: {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.paymentStatus === "escrow" && (
                      <button onClick={() => handleMarkCompleted(app._id)} className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        Mark Completed
                      </button>
                    )}
                    <button onClick={() => navigate("/messages")} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-black rounded-xl hover:bg-blue-100 transition-all active:scale-95">
                      <MessageSquare size={16} /> Chat
                    </button>
                    <button onClick={() => navigate(`/project/${app.job?._id}`)} className="flex-1 md:flex-none px-6 py-3 border border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all">
                      View Original
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}