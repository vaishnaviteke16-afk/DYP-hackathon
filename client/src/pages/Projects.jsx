import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Search, Clock, Tag, Building2, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Projects() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";
  const role = localStorage.getItem("role");

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/api/jobs`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (_) {}
  };

  const fetchMyApps = async () => {
    if (role !== "student") return;
    try {
      const res = await fetch(`${API}/api/applications/my`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const apps = await res.json();
        setMyApplications(apps.map((a) => a.job._id));
      }
    } catch (_) {}
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchJobs(), fetchMyApps()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.skillsRequired?.some((skill) => skill.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <div className="p-4 md:p-6 lg:p-10 flex-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto mb-10 z-10 relative">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Browse Gigs <span className="text-2xl">🚀</span>
            </h1>
            <p className="text-gray-500 mt-2">Find the perfect project that matches your skills.</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or skills..."
              className="flex-1 px-4 outline-none text-gray-700 bg-transparent text-sm md:text-base"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto z-10 relative">
          {loading ? (
            // Skeleton loaders
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 animate-pulse flex flex-col justify-between">
                <div space-y-4>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Gigs Found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                No open projects match your search right now. Try adjusting your search or check back later!
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const hasApplied = myApplications.includes(job._id);

              return (
                <div key={job._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col overflow-hidden relative">
                  {/* Decorative blob on hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                  
                  <div className="flex-1 relative z-10">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {job.title}
                    </h2>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      {job.postedBy?.name ? (
                        <>
                          <UserCircle size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-700">{job.postedBy.name}</span>
                        </>
                      ) : (
                        <>
                          <Building2 size={16} className="text-gray-400" />
                          <span>External Client</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-3 mb-5 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-500 mb-5 relative z-10">
                      {job.budget && (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold max-w-fit">
                          <span className="text-sm">₹</span> <span>{job.budget}</span>
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full font-semibold max-w-fit">
                          <Clock size={14} /> <span>{job.deadline}</span>
                        </div>
                      )}
                    </div>

                    {job.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                        {job.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                            +{job.skillsRequired.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto relative z-10">
                    <button
                      onClick={() => navigate(`/project/${job._id}`)}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      View Details & Apply
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;