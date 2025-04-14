import React, { useEffect, useState } from "react";

const HealthPython: React.FC = () => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("https://prospectivetool.raapidinc.com:7000/health")
      .then((res) => {
        if (res.ok) return res.json(); // Use .json() instead of .text() to parse JSON response
        throw new Error("Failed");
      })
      .then((data) => setStatus(data.message)) // Use the 'message' property from the response
      .catch(() => setStatus("Python Backend is down ❌"));
  }, []);

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
      <h3>Python Backend Health Status:</h3>
      <p>{status}</p>
    </div>
  );
};

export default HealthPython;
