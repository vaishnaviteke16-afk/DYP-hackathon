import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const role = user.role || localStorage.getItem("role");

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="UniHire Logo" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-black text-blue-600 tracking-tight italic">
          Uni<span className="text-gray-900">Hire</span>
        </span>
      </Link>

      <div className="flex gap-6 items-center font-semibold text-sm">
        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
        <Link to="/projects" className="text-gray-600 hover:text-blue-600 transition-colors">Gigs</Link>

        {token ? (
          <>
            <Link
              to={user.role === 'admin' ? '/admin' : user.role === 'client' ? '/client' : '/student'}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link to="/messages" className="text-gray-600 hover:text-blue-600 transition-colors">Messages</Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Join Free
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;