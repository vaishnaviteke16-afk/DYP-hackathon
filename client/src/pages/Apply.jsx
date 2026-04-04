import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProposalPanel from "../components/proposal/ProposalPanel";
import { Briefcase, Send, Sparkles, ArrowLeft, Building2, CheckCircle, Clock, Tag } from "lucide-react";

const API = "http://localhost:5000";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("I am highly interested in this project and confident that I can deliver high-quality results. I have the necessary skills and I'm ready to start immediately.");
  const [isApplying, setIsApplying] = useState(false);
  const [showProposalGenerator, setShowProposalGenerator] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${id}`, {
          headers: { Authorization: authHeader },
        });
        if (res.ok) {
          setJob(await res.json());
        } else {
          alert("Job not found!");
          navigate("/projects");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Please enter a message.");

    setIsApplying(true);
    try {
      const res = await fetch(`${API}/api/applications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Application submitted successfully!");
        navigate("/applications");
      } else {
        alert(data.msg || "Failed to submit application.");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans relative overflow-hidden">
      <Header />

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full filter blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-400/5 rounded-full filter blur-3xl pointer-events-none -z-10"></div>

      <div className="p-6 md:p-12 max-w-5xl mx-auto w-full z-10">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Project Summary Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Briefcase size={28} />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Project Summary</h2>
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-4">{job.description}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <CheckCircle size={16} className="text-green-500" />
                  ₹{job.budget} Budget
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <Clock size={16} className="text-yellow-500" />
                  {job.deadline} Timeline
                </div>
                {job.postedBy?.name && (
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <Building2 size={16} className="text-blue-500" />
                    {job.postedBy.name}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Required Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg text-xs font-bold"># {s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleApply} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">Submit Your Proposal</h1>
                <p className="text-gray-400 font-medium leading-relaxed">Tell the client why you're the best fit for this project. Focus on your relevant skills and experience.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Your Pitch / Cover Letter</label>
                  <textarea
                    rows={12}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all font-medium placeholder:text-gray-300 resize-none shadow-inner"
                    placeholder="Describe your approach, similar projects you've done, and your availability..."
                  />
                  <div className="flex justify-between items-center mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                    <span>Pro-tip: Use the AI Generator for help!</span>
                    <span>{message.length} characters</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isApplying ? "Submitting..." : <><Send size={20} /> Deploy Application</>}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowProposalGenerator(true)}
                    className="sm:w-auto px-8 py-5 bg-purple-50 text-purple-600 font-black rounded-3xl border-2 border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" /> 
                    AI Assist
                  </button>
                </div>
              </div>

              {/* Success Badge Mockup */}
              <div className="mt-10 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
                <div className="p-3 bg-white text-green-500 rounded-2xl shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-green-800 uppercase tracking-widest">Verified Opportunity</p>
                  <p className="text-sm text-green-700 font-medium">This client has a 4.9/5 student rating.</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Proposal Generator Icon (Bottom Left) */}
      <div className="fixed bottom-8 left-8 z-[100] group">
        <div className="absolute -top-14 left-0 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-[1.2rem] shadow-2xl border border-blue-50 text-sm font-black text-blue-600 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none flex items-center gap-2">
           <Sparkles size={16} /> Need a professional proposal?
        </div>
        <button 
          onClick={() => setShowProposalGenerator(true)}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[1.8rem] shadow-2xl shadow-purple-500/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm group-hover:rotate-12"
        >
          <Sparkles size={32} className="drop-shadow-lg" />
        </button>
      </div>

      {/* Proposal Generator Panel */}
      {showProposalGenerator && (
        <ProposalPanel 
          project={job} 
          onClose={() => setShowProposalGenerator(false)} 
        />
      )}
    </div>
  );
}
