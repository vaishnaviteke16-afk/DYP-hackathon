import { BrowserRouter, Routes, Route } from "react-router-dom";
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
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
         <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload-id" element={<UploadID />} />
        <Route path="/student" element={<Student />} />
        <Route path="/client" element={<Client />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* ✅ Footer should be here */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;

 