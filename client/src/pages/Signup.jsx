import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserPlus, GraduationCap, Building2, Mail, Lock, User, ArrowRight, Upload, Briefcase, Globe } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialRole = queryParams.get("role") || "student";

  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    if (queryParams.get("role")) {
      setRole(queryParams.get("role"));
    }
  }, [search]);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    skills: [],
    companyName: "",
    companyWebsite: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const handleSignup = async () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "skills") {
        data.append("skills", JSON.stringify(formData.skills));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append("role", role);

    if (file) data.append("collegeId", file);

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: data
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.msg);
      return;
    }

    alert("Signup successful 🎉");
    navigate("/login");
  };

  const skillsList = ["Coding", "Design", "Writing", "Marketing"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="bg-white w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 relative z-10 my-8 py-8 h-auto overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-full drop-shadow-sm">
            <UserPlus size={40} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Join UniHire and start exploring opportunities
        </p>

        {/* ROLE SELECT */}
        <div className="flex gap-3 mb-6 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg font-medium transition-all duration-300 ${
              role === "student" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Student
          </button>

          <button
            onClick={() => setRole("client")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg font-medium transition-all duration-300 ${
              role === "client" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Client
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              name="email" 
              type="email"
              placeholder="Email address" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
            />
          </div>

          {/* 👨‍🎓 STUDENT FIELDS */}
          {role === "student" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  name="college" 
                  placeholder="College Name" 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 font-medium hover:underline">Upload College ID</span>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <p className="text-xs text-gray-500 mt-1">{file ? file.name : "JPEG, PNG, PDF up to 5MB"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Select your skills:</p>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.skills.includes(skill)
                          ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 🏢 CLIENT FIELDS */}
          {role === "client" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  name="companyName" 
                  placeholder="Company Name" 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  name="companyWebsite" 
                  placeholder="Company Website" 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400" 
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSignup}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center group mt-6"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline transition-all">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}