import Header from "../components/Header";

const applications = [
  {
    title: "Mobile App UI/UX Design",
    company: "TechStart Inc.",
    status: "Pending",
    budget: "$800 - $1,200",
    time: "2-3 weeks",
    date: "March 28, 2026",
  },
  {
    title: "React Developer for E-commerce",
    company: "ShopFlow",
    status: "Accepted",
    budget: "$1,500 - $2,000",
    time: "4-6 weeks",
    date: "March 25, 2026",
  },
];

export default function Applications() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">My Applications</h1>
        <p className="text-gray-500 mb-6">
          Track your applications and projects
        </p>

        <div className="space-y-4">
          {applications.map((app, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow">

              <div className="flex justify-between">
                <h2 className="font-semibold">{app.title}</h2>

                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    app.status === "Accepted"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-gray-500">{app.company}</p>

              <div className="flex gap-6 text-sm text-gray-500 mt-2">
                <span>{app.budget}</span>
                <span>{app.time}</span>
                <span>Applied on {app.date}</span>
              </div>

              <button className="mt-3 border px-4 py-1 rounded-lg">
                Message
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}