import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./App.css";

// Register required components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function App() {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData(data);
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharts = () => {
    if (!responseData) return null;

    // Extract gender data
    const genderLabels = Object.keys(responseData.gender).filter((key) => key !== "comment");
    const genderValues = genderLabels.map((label) => responseData.gender[label]);
    
    const genderData = {
      labels: genderLabels,
      datasets: [
        {
          label: "Gender Distribution",
          data: genderValues,
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };

    //Extract ethnicity data
    const ethnicityLabels = Object.keys(responseData.ethnicity);
    const ethnicityValues = Object.values(responseData.ethnicity);

    const ethnicityData = {
      labels: ethnicityLabels,
      datasets: [
        {
          label: "Ethnicity Distribution",
          data: ethnicityValues,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    };

    return (
      <div className="charts-container">
        {/* Gender Pie Chart */}
        <div className="chart">
          <h2>Gender Distribution</h2>
          <Pie data={genderData} />
          <p className="chart-comment">{responseData.gender.comment || "No comments available."}</p>
        </div>

        {/* Ethnicity Bar Chart */}
        <div className="chart">
          <h2>Ethnicity Distribution </h2>
          <Bar data={ethnicityData} />
          <p className="chart-comment">{responseData.ethnicityComment || "No comments available."}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="main-header">
        <h1>DiversityIQ</h1>
      </header>
      <div className="App-content">
        <header className="App-header">
          <h2>Check the diversity of your dataset</h2>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="file-label">
            {file ? file.name : "Choose File"}
          </label>
          <button
            className={`upload-button ${
              isLoading ? "upload-button-disabled" : ""
            }`}
            onClick={handleFileUpload}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload File"}
          </button>

          {isLoading && <div className="loading-screen">Loading...</div>}
          {responseData && !isLoading && renderCharts()}
        </header>
      </div>
    </div>
  );
}

export default App;