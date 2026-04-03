import { useState } from "react";

export default function UploadID() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("collegeId", file);

    const res = await fetch("http://localhost:5000/api/upload-id", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token")
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    alert("Upload successful ✅");
  };

  return (
    <div>
      <h2>Upload College ID</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}