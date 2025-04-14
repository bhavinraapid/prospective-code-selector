import React, { useEffect, useState } from "react";

const HealthBackend: React.FC = () => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://localhost:8081/research/health")
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("Failed");
      })
      .then((data) => setStatus(data))
      .catch(() => setStatus("Backend is down ❌"));
  }, []);

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
      <h3>Backend Health Status:</h3>
      <p>{status}</p>
    </div>
  );
};

export default HealthBackend;
