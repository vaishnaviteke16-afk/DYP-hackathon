import { useState, useEffect } from "react";
import Header from "../components/Header";
import { UserCircle, Mail, MapPin, Tag, Edit3, X, Check } from "lucide-react";

const API = "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setCollege(data.college || "");
        setSkills(data.skills?.join(", ") || "");
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          name,
          college,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setShowEdit(false);
        fetchUser();
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to update profile");
      }
    } catch (_) {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />

      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="px-8 pb-8">
            <div className="relative -mt-12 flex flex-col md:flex-row md:items-end gap-6 mb-8">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-lg p-2 relative">
                <div className="w-full h-full bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-4xl">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Mail size={16} /> {user?.email}</span>
                      <span className="flex items-center gap-1.5 capitalize text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">{user?.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-blue-500/30 transition-all text-sm self-start md:self-center"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* About Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <UserCircle size={20} className="text-blue-500" /> Professional Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    Experienced {user?.role} specializing in {user?.skills?.join(", ")}. Dedicated to delivering high-quality work and professional collaboration.
                  </p>
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={20} className="text-blue-500" /> Core Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.length > 0 ? (
                      user.skills.map((skill) => (
                        <span key={skill} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">No skills listed yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Institution</h3>
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><MapPin size={18} /></div>
                    <span className="font-bold text-sm">{user?.college || "Not specified"}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Status</h3>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${user?.isVerified ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>
                    <div className={`p-2 bg-white rounded-lg shadow-sm ${user?.isVerified ? "text-green-600" : "text-yellow-600"}`}>
                      {user?.isVerified ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <span className="font-bold text-sm">{user?.isVerified ? "Verified Account" : "Verification Pending"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-100">
            <button onClick={() => setShowEdit(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition"><X size={20} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-6">Edit Your Profile</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">College/Company</label>
                <input value={college} onChange={(e) => setCollege(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Skills (comma separated)</label>
                <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium resize-none" />
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg border-b-4 border-blue-800 transition-all disabled:opacity-50">
                {saving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}