import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {

    if (!file || !email) {
      setStatus("Please upload a file and enter email.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    setStatus("Generating AI summary...");

    try {

      await axios.post(
        "http://localhost:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus("✅ Summary successfully sent to email!");

    } catch (error) {

      console.error(error);
      setStatus("❌ Error generating summary.");

    }
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Sales Insight Automator</h1>

        <p className="subtitle">
          Upload sales data and receive an AI-generated executive summary.
        </p>

        <input
          className="file-input"
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          className="email-input"
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="submit-btn" onClick={submit}>
          Generate Summary
        </button>

        <p className="status">{status}</p>

      </div>

    </div>
  );
}

export default App;