import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p style={{ marginTop: "15px", fontWeight: "700", color: "#3b82f6" }}>
        AI is writing your winning proposal...
      </p>
    </div>
  );
};

export default LoadingSpinner;
