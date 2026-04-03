import { useState } from "react";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const handlePost = async () => {
    const res = await fetch("http://localhost:5000/api/jobs/create-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        skillsRequired: skills.split(",")
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error");
      return;
    }

    alert(`Emails sent to ${data.matchedUsers} users 🚀`);
  };

  return (
    <div>
      <h2>Post Job</h2>

      <input placeholder="Job Title" onChange={(e) => setTitle(e.target.value)} />

      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />

      <input
        placeholder="Skills (comma separated)"
        onChange={(e) => setSkills(e.target.value)}
      />

      <button onClick={handlePost}>Post Job</button>
    </div>
  );
}