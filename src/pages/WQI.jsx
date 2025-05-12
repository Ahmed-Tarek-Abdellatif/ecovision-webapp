import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import "../App.css";  // Ensure this has your styles for tables and buttons

function WQI() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    // Parse the CSV file to display the first few rows in the frontend
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

    // Retrieve the access token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    // Create FormData to send the file to the backend for prediction
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Sending the file to backend with the token in the headers
      const response = await axios.post("http://localhost:3000/api/predict/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Ensuring it's sent as multipart/form-data
          "Authorization": `Bearer ${token}`,    // Add the token here in the Authorization header
        },
      });

      // Handle the response containing predictions
      setPredictions(response.data.predictions);
    } catch (err) {
      setError("Failed to upload or predict. Please try again.");
      console.error("Error response:", err.response);
    } finally {
      setLoading(false);
    }
  };

  // Function to download predictions as CSV with structured columns
  const handleDownload = () => {
    const predictionData = [];

    // Add headers from the predictions object
    const headers = Object.keys(predictions[0] || {});
    predictionData.push(headers);

    // Create rows for each prediction set
    predictions.forEach((row) => {
      const rowData = headers.map((header) => row[header]);
      predictionData.push(rowData);
    });

    const csv = Papa.unparse(predictionData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "predictions.csv");
    link.click();
  };

  return (
    <div className="home-container">
      <h1 className="aqi-title">Data Uploading</h1>
      <p className="aqi-subtitle">
        Dataset format <span className="format-tag">.csv</span>
      </p>

      <div className="upload-container">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          Choose File
        </label>
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {data.length > 0 && (
        <div>
          <h3>Uploaded Data</h3>
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {predictions.length > 0 && (
        <div>
          <h3>Predictions</h3>
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(predictions[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {predictions.length > 0 && (
        <button onClick={handleDownload} className="download-button">
          Download Predictions
        </button>
      )}
    </div>
  );
}

export default WQI;
