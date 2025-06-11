import React, { useState } from "react";
import Papa from "papaparse";
import Card from "../components/Card";
import "../App.css";

function AQI() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const rows = result.data;
          if (rows.length > 19) {
            setData(rows.slice(0, 20)); // Limit to first 20 rows
          } else {
            setData(rows);
          }
        },
        header: true,
      });
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div className="home-container">
        <div
        className="home-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div className="content" style={{ flex: 1 }}>
          <h1>Clean Air, Healthy Lives</h1>
          <p>
            Join us in building sustainable cities where clean air powers healthier communities. Together, we can create a future where everyone breathes easy and thrives in harmony with nature.
          </p>
        </div>
        <div
          style={{
            flex: "0 0 320px",
            marginLeft: "40px",
            display: "flex",
            alignItems: "center",
            marginTop: "70px",
          }}
        >
          <Card
            width="300px"
            height="400px"
            position="relative"
            path="src\assets\Page 1\WaterCard.jpg"
            alt="Header Image"
            style={{
              border: "1px solid ",
              borderRadius: "8px",
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
              marginLeft: "0",
            }}
          />
        </div>
      </div>
      <h1 className="aqi-title" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "30px", marginBottom: "10px", textAlign: "center" }}>
        Air Quality Index (AQI) Classification
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <table className="data-table" style={{ width: "80%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 20px", fontWeight: "bold", borderRight: "1px solid #e5e7eb" }}>AQI Range</th>
                <th style={{ padding: "10px 20px", fontWeight: "bold" }}>Classification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>0-50</td>
                <td style={{ padding: "8px 20px" }}>Good</td>
              </tr>
              <tr style={{ background: "#f3f4f6" }}>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>51-100</td>
                <td style={{ padding: "8px 20px" }}>Moderate</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>101-150</td>
                <td style={{ padding: "8px 20px" }}>Unhealthy for Sensitive Groups</td>
              </tr>
              <tr style={{ background: "#f3f4f6" }}>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>151-200</td>
                <td style={{ padding: "8px 20px" }}>Unhealthy</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>201-300</td>
                <td style={{ padding: "8px 20px" }}>Very Unhealthy</td>
              </tr>
              <tr style={{ background: "#f3f4f6" }}>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>301-500</td>
                <td style={{ padding: "8px 20px" }}>Hazardous</td>
              </tr>
            </tbody>
          </table>
        </div>
      </h1>
      <div style={{ width: "100%", overflowX: "auto", marginBottom: "20px" }}>
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Date</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>PM2.5</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>PM10</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>NO₂</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>SO₂</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>CO</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>O₃</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Drag and Drop Upload Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="file-input-label"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            border: "2px dashed #d1d5db",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "all 0.3s",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto 16px auto",
            background: "#fff"
          }}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
          onDragLeave={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
          onDrop={e => {
            e.preventDefault();
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#fff';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: "2.5rem", color: "#3b82f6", marginBottom: "0.5rem" }}></i>
          <span style={{ fontWeight: 500, color: "#374151" }}>
            Drag & drop your CSV file here, or <span style={{ color: "#3b82f6", textDecoration: "underline" }}>browse</span>
          </span>
          <span style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Only .csv files are supported
          </span>
          {file && (
            <span style={{ marginTop: "0.75rem", color: "#059669", fontWeight: 500 }}>
              Selected: {file.name}
            </span>
          )}
        </label>
        <button onClick={handleUpload} className="upload-button" style={{ marginTop: "8px" }}>
          Upload
        </button>
      </div>
      </div>


  );
}

export default AQI;
