import { useParams } from "react-router-dom";
import Header from "../components/Header";

const projectsData = [
  {
    id: 1,
    title: "Landing Page Design",
    skills: "HTML, CSS",
    budget: 1000,
    level: "Beginner",
    time: "2 Days",
    description: "Create a responsive landing page using HTML and CSS.",
  },
  {
    id: 2,
    title: "React Bug Fix",
    skills: "React",
    budget: 2000,
    level: "Intermediate",
    time: "1 Day",
    description: "Fix bugs in an existing React application.",
  },
  {
    id: 3,
    title: "Portfolio Website",
    skills: "HTML, JS",
    budget: 1500,
    level: "Beginner",
    time: "3 Days",
    description: "Build a personal portfolio website.",
  },
  {
    id: 4,
    title: "UI Redesign",
    skills: "Figma",
    budget: 2500,
    level: "Beginner",
    time: "5 Days",
    description: "Redesign UI for better user experience.",
  },
];

function ProjectDetails() {
  const { id } = useParams();

  const project = projectsData.find((p) => p.id === Number(id));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted!");
  };

  if (!project) return <h2 className="text-center mt-10">Project not found</h2>;

  return (
    <div className="bg-gray-100 min-h-screen">

      <Header />

      <div className="max-w-4xl mx-auto p-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h1 className="text-2xl font-bold">{project.title}</h1>

          <p className="text-gray-500">{project.skills}</p>

          <p className="text-sm text-gray-400 mb-4">
            ⏱ {project.time} | ₹{project.budget}
          </p>

          <p className="my-4">{project.description}</p>

          {/* APPLY FORM */}
          <h2 className="text-lg font-semibold mb-3">Apply Now</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <input
              placeholder="Your Name"
              className="border p-2 rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              required
            />

            <textarea
              placeholder="Why should we select you?"
              className="border p-2 rounded"
              required
            />

            <button className="bg-blue-600 text-white py-2 rounded">
              Submit
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default ProjectDetails;