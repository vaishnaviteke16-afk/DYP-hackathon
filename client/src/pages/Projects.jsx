import { useState } from "react";
import Header from "../components/Header";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projectsData = [
  {
    id: 1,
    title: "Landing Page Design",
    skills: "HTML, CSS",
    budget: 1000,
    level: "Beginner",
    time: "2 Days",
  },
  {
    id: 2,
    title: "React Bug Fix",
    skills: "React",
    budget: 2000,
    level: "Intermediate",
    time: "1 Day",
  },
  {
    id: 3,
    title: "Portfolio Website",
    skills: "HTML, JS",
    budget: 1500,
    level: "Beginner",
    time: "3 Days",
  },
  {
    id: 4,
    title: "UI Redesign",
    skills: "Figma",
    budget: 2500,
    level: "Beginner",
    time: "5 Days",
  },
];

function Projects() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [budget, setBudget] = useState("All");
  const [time, setTime] = useState("All");

  const navigate = useNavigate();

  const filteredProjects = projectsData.filter((p) => {
    return (
      p.skills.toLowerCase().includes(search.toLowerCase()) &&
      (level === "All" || p.level === level) &&
      (budget === "All" ||
        (budget === "low" && p.budget <= 1500) ||
        (budget === "medium" && p.budget > 1500 && p.budget <= 2200) ||
        (budget === "high" && p.budget > 2200)) &&
      (time === "All" || p.time === time)
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <div className="p-4 md:p-6">

        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Browse Projects 🚀
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="flex items-center bg-white border rounded-lg px-3 shadow-sm">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by skills..."
                className="flex-1 p-2 outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select onChange={(e) => setLevel(e.target.value)} className="p-2 border rounded-lg">
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
            </select>

            <select onChange={(e) => setBudget(e.target.value)} className="p-2 border rounded-lg">
              <option value="All">All Budget</option>
              <option value="low">Below ₹1500</option>
              <option value="medium">₹1500 - ₹2200</option>
              <option value="high">Above ₹2200</option>
            </select>

            <select onChange={(e) => setTime(e.target.value)} className="p-2 border rounded-lg">
              <option>All</option>
              <option>1 Day</option>
              <option>2 Days</option>
              <option>3 Days</option>
              <option>5 Days</option>
            </select>

          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl shadow">

              <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-500 text-sm">{project.skills}</p>
              <p className="text-gray-400 text-xs mb-3">⏱ {project.time}</p>

              <div className="flex justify-between">
                <span>{project.level}</span>
                <span className="text-green-600 font-bold">₹{project.budget}</span>
              </div>

              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Apply Now
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Projects;