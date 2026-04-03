import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      
      <h1 className="text-2xl font-bold text-blue-600">
        StudentFreelance
      </h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/projects" className="hover:text-blue-500">Projects</Link>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>

        <Link
          to="/auth"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
         <Link to="/login" className="hover:text-blue-500">Login</Link>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;