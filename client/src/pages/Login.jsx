import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, UserCircle } from "lucide-react";export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data.user)); // 🔥 NEW: STORE COMPLETE USER OBJECT
    localStorage.setItem("userId", data.user._id); // 🔥 NEW: STORE USER ID DIRECTLY

    // 🔥 ROLE BASED REDIRECT
    if (data.role === "student") navigate("/student");
    else if (data.role === "client") navigate("/client");
    else if (data.role === "admin") navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 relative z-10 transition-all">
        
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-full drop-shadow-sm">
            <UserCircle size={48} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Sign in to access your UniHire account
        </p>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center group mt-4"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline transition-all">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}