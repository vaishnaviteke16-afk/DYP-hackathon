import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Applications from "./pages/Applications";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadID from "./pages/UploadID";
import Student from "./pages/Student";
import Client from "./pages/Client";
import Admin from "./pages/Admin";
import Apply from "./pages/Apply";
import ChatBot from "./components/ChatBot";
import { useState } from "react";

// 🔒 Protected Route Component for RBAC
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    user = {};
  }
  
  // Fallback to standalone role if user object is incomplete
  const role = user.role || localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard if they try to access others
    const redirectPath = role === "admin" ? "/admin" : role === "client" ? "/client" : "/student";
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        
        {/* PUBLIC AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED SHARED ROUTES */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute allowedRoles={["student"]}><Applications /></ProtectedRoute>} />
        <Route path="/apply/:id" element={<ProtectedRoute allowedRoles={["student"]}><Apply /></ProtectedRoute>} />
        <Route path="/upload-id" element={<ProtectedRoute allowedRoles={["student"]}><UploadID /></ProtectedRoute>} />

        {/* ROLE-SPECIFIC DASHBOARDS */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Student />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client" 
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Client />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <Footer />

      {/* Chatbot Interface (only for logged-in users and not on auth pages) */}
      {localStorage.getItem("token") && !["/login", "/signup"].includes(window.location.pathname) && (
        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}

      {/* Floating Chatbot Toggle (only for logged-in users and not on auth pages) */}
      {localStorage.getItem("token") && !["/login", "/signup"].includes(window.location.pathname) && (
        <div className="fixed bottom-8 right-8 z-[100] group">
          <div className={`absolute -top-12 right-0 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-gray-100 text-xs font-bold text-blue-600 transition-all duration-300 transform ${isChatOpen ? "opacity-0 translate-y-2 pointer-events-none" : "group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 opacity-0 pointer-events-none"} whitespace-nowrap`}>
            {isChatOpen ? "" : "How can I help you today?"}
          </div>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-500 border-4 border-white/20 backdrop-blur-sm ${isChatOpen ? "rotate-12 scale-90" : ""}`}
          >
            {isChatOpen ? (
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;

 