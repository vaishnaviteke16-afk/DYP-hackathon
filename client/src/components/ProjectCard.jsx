function ProjectCard({ project }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition">

      <h2 className="text-xl font-semibold mb-2">
        {project.title}
      </h2>

      <p className="text-gray-500 mb-3">
        {project.skills}
      </p>

      <div className="flex justify-between items-center">
        <span className="font-bold text-green-600">
          ₹{project.budget}
        </span>

        <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
          Beginner
        </span>
      </div>

    </div>
  );
}

export default ProjectCard;