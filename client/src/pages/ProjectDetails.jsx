import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Clock, Tag, Building2, ChevronRight, Briefcase, Calendar, CheckCircle } from "lucide-react";

const API = "http://localhost:5000";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${id}`, {
          headers: { Authorization: authHeader },
        });
        if (res.ok) {
          setJob(await res.json());
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig not found</h2>
          <button onClick={() => navigate("/projects")} className="text-blue-600 font-bold hover:underline">Back to Gigs</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <div className="max-w-5xl mx-auto w-full p-6 md:p-10 flex-1">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
          <button onClick={() => navigate("/projects")} className="hover:text-blue-600 transition">Browse Gigs</button>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold truncate">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-3 mb-6">
                 {job.skillsRequired?.map((s, i) => (
                    <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                      {s}
                    </span>
                  ))}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-50 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Budget</p>
                    <p className="text-lg font-black text-gray-900">₹{job.budget}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Deadline</p>
                    <p className="text-lg font-black text-gray-900">{job.deadline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Posted</p>
                    <p className="text-lg font-black text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-black text-gray-900 mb-4">Project Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                  {job.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <Briefcase size={40} className="text-blue-600" />
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2">Ready to apply?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Submit your best proposal and start working on this project today.
              </p>

              {role === "student" ? (
                <button
                  onClick={() => navigate(`/apply/${job._id}`)}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Apply Now →
                </button>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available to Students Only</p>
                </div>
              )}
              
              <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                Verified Client • Student Rated ★ 4.9
              </p>
            </div>

            {/* Client Info */}
            <div className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
               <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">About the Client</h4>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-gray-900">{job.postedBy?.name || "Verified Enterprise"}</h5>
                    <p className="text-xs text-gray-500 font-medium">India • Member since 2024</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProjectDetails;