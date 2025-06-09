import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import Card from "../components/Card";
import "../App.css"; 

function WQI() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New: Column selection state
  const [selectedDataColumns, setSelectedDataColumns] = useState([]);
  const [selectedPredColumns, setSelectedPredColumns] = useState([]);
  // Row count selection state
  // const [dataRowCount, setDataRowCount] = useState(5);
  // const [predRowCount, setPredRowCount] = useState(5);
  // Dropdown open/close state
  const [showDataColDropdown, setShowDataColDropdown] = useState(false);
  const [showPredColDropdown, setShowPredColDropdown] = useState(false);

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

  // Helper: Get all possible columns from uploaded data or predictions
  const allDataColumns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const allPredColumns = React.useMemo(() => (predictions.length > 0 ? Object.keys(predictions[0]) : []), [predictions]);

  // Handlers for dropdown selection
  const handleDataColumnsChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedDataColumns(options.slice(0, 5));
  };
  const handlePredColumnsChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedPredColumns(options.slice(0, 5));
  };

  // Handlers for checkbox selection in dropdown
  const handleDataColCheckbox = (col) => {
    setSelectedDataColumns((prev) => {
      if (prev.includes(col)) return prev.filter((c) => c !== col);
      if (prev.length < 5) return [...prev, col];
      return prev;
    });
  };
  const handlePredColCheckbox = (col) => {
    setSelectedPredColumns((prev) => {
      if (prev.includes(col)) return prev.filter((c) => c !== col);
      if (prev.length < 5) return [...prev, col];
      return prev;
    });
  };

  // Columns to display (default: first 5 if none selected)
  const displayDataColumns = selectedDataColumns.length > 0 ? selectedDataColumns : allDataColumns.slice(0, 5);
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);

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
          <h1>Aiming for a Better Future</h1>
          <p>
            Join us in creating sustainable cities where clean water 
            drive healthier communities. Together, we can build a future
            that thrives in harmony with nature.
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
        Water Quality Index (WQI) Classification
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <table className="data-table" style={{ width: "80%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 20px", fontWeight: "bold", borderRight: "1px solid #e5e7eb" }}>WQI Range</th>
                <th style={{ padding: "10px 20px", fontWeight: "bold" }}>Classification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>90-100</td>
                <td style={{ padding: "8px 20px" }}>Excellent</td>
              </tr>
              <tr style={{ background: "#f3f4f6" }}>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>70-90</td>
                <td style={{ padding: "8px 20px" }}>Good</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>50-70</td>
                <td style={{ padding: "8px 20px" }}>Medium</td>
              </tr>
              <tr style={{ background: "#f3f4f6" }}>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>25-50</td>
                <td style={{ padding: "8px 20px" }}>Bad</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 20px", borderRight: "1px solid #e5e7eb" }}>0-25</td>
                <td style={{ padding: "8px 20px" }}>Very Bad</td>
              </tr>
            </tbody>
          </table>
        </div>
      </h1>
      <p className="aqi-subtitle">
        Dataset format <span className="format-tag">.csv</span>
      </p>
      <div style={{ width: "100%", overflowX: "auto", marginBottom: "20px" }}>
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Date</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>pH</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Dissolved Oxygen (DO)</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Biochemical Oxygen Demand (BOD)</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Temperature</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Turbidity</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Total Dissolved Solids (TDS)</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Nitrates</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Fecal Coliform</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Conductivity</th>
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
        {/* Column dropdown for Uploaded Data (moved below upload button) */}
        {allDataColumns.length > 0 && (
          <div style={{ margin: "16px 0 0 0", display: "flex", alignItems: "center", gap: 16, width: '100%', justifyContent: 'flex-start', maxWidth: 400 }}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowDataColDropdown(v => !v)}
                style={{
                  padding: "6px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  background: "#fff",
                  cursor: "pointer",
                  minWidth: 180,
                  textAlign: "left",
                  position: "relative"
                }}
              >
                <span style={{ color: selectedDataColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
                  {selectedDataColumns.length > 0
                    ? `Columns: ${selectedDataColumns.join(', ')}`
                    : 'Select columns (1-5)'}
                </span>
              </button>
              {showDataColDropdown && (
                <div style={{ position: "absolute", zIndex: 10, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 8, minWidth: 180, marginTop: 4 }}>
                  <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
                  {allDataColumns.map(col => (
                    <label key={col} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <input
                        type="checkbox"
                        checked={selectedDataColumns.includes(col)}
                        onChange={() => handleDataColCheckbox(col)}
                        disabled={
                          (!selectedDataColumns.includes(col) && selectedDataColumns.length >= 5) ||
                          (selectedDataColumns.length === 1 && selectedDataColumns.includes(col))
                        }
                      />
                      <span>{col}</span>
                    </label>
                  ))}
                  <button type="button" onClick={() => setShowDataColDropdown(false)} style={{ marginTop: 8, padding: "4px 12px", border: "none", background: "#3b82f6", color: "#fff", borderRadius: 3, cursor: "pointer" }}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {data.length > 0 && (
        <div>
          <h3>Uploaded Data</h3>
          <div style={{ width: displayDataColumns.length === 1 ? 180 : '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <table className="data-table" style={{ width: displayDataColumns.length === 1 ? 180 : '100%', minWidth: 0, tableLayout: displayDataColumns.length === 1 ? 'fixed' : 'auto', margin: '0 auto' }}>
              <thead>
                <tr>
                  {displayDataColumns.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {displayDataColumns.map((key, i) => (
                      <td key={i}>{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Column dropdown for Predictions */}
      {allPredColumns.length > 0 && (
        <div style={{ margin: "16px 0", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowPredColDropdown(v => !v)}
              style={{
                padding: "6px 16px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
                minWidth: 180,
                textAlign: "left",
                position: "relative"
              }}
            >
              <span style={{ color: selectedPredColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
                {selectedPredColumns.length > 0
                  ? `Columns: ${selectedPredColumns.join(', ')}`
                  : 'Select columns (1-5)'}
              </span>
            </button>
            {showPredColDropdown && (
              <div style={{ position: "absolute", zIndex: 10, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 8, minWidth: 180, marginTop: 4 }}>
                <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
                {allPredColumns.map(col => (
                  <label key={col} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <input
                      type="checkbox"
                      checked={selectedPredColumns.includes(col)}
                      onChange={() => handlePredColCheckbox(col)}
                      disabled={
                        (!selectedPredColumns.includes(col) && selectedPredColumns.length >= 5) ||
                        (selectedPredColumns.length === 1 && selectedPredColumns.includes(col))
                      }
                    />
                    <span>{col}</span>
                  </label>
                ))}
                <button type="button" onClick={() => setShowPredColDropdown(false)} style={{ marginTop: 8, padding: "4px 12px", border: "none", background: "#3b82f6", color: "#fff", borderRadius: 3, cursor: "pointer" }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div>
          <h3>Predictions</h3>
          <div style={{ width: displayPredColumns.length === 1 ? 180 : '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <table className="data-table" style={{ width: displayPredColumns.length === 1 ? 180 : '100%', minWidth: 0, tableLayout: displayPredColumns.length === 1 ? 'fixed' : 'auto', margin: '0 auto' }}>
              <thead>
                <tr>
                  {displayPredColumns.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {displayPredColumns.map((key, i) => (
                      <td key={i}>{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
