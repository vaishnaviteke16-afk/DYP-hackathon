import Header from "../components/Header";

export default function Profile() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/150"
              className="w-24 h-24 rounded-full"
            />

            <div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-500">
                UI/UX Designer & Product Designer
              </p>
              <p className="text-sm text-gray-400">
                john@example.com
              </p>
            </div>

            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">
              Edit Profile
            </button>
          </div>

          <p className="mt-4 text-gray-600">
            Passionate UI/UX designer with experience creating
            beautiful digital experiences.
          </p>

          <div className="mt-4 flex gap-2 flex-wrap">
            {["Figma", "UI Design", "Web Design"].map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}