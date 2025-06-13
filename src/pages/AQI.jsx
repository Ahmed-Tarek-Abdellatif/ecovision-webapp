import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import Card from "../components/Card";
import "../App.css";

// Reusable ColumnDropdown component
function ColumnDropdown({ columns, selectedColumns, setSelectedColumns, showDropdown, setShowDropdown, label }) {
  return (
    <div style={{ position: 'relative', marginLeft: 16 }}>
      <button
        type="button"
        onClick={() => setShowDropdown(v => !v)}
        className="upload-button"
        style={{ minWidth: 180, textAlign: "left", background: "#fff", color: "#111827", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", position: "relative" }}
      >
        <span style={{ color: selectedColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
          {selectedColumns.length > 0
            ? `Columns: ${selectedColumns.join(', ')}`
            : label || 'Select columns (1-5)'}
        </span>
      </button>
      {showDropdown && (
        <div style={{ position: "absolute", zIndex: 10, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 8, minWidth: 180, marginTop: 4 }}>
          <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
          {columns.map(col => (
            <label key={col} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => {
                  setSelectedColumns(prev => {
                    if (prev.includes(col)) return prev.filter(c => c !== col);
                    if (prev.length < 5) return [...prev, col];
                    return prev;
                  });
                }}
                disabled={
                  (!selectedColumns.includes(col) && selectedColumns.length >= 5) ||
                  (selectedColumns.length === 1 && selectedColumns.includes(col))
                }
              />
              <span>{col}</span>
            </label>
          ))}
          <button type="button" onClick={() => setShowDropdown(false)} style={{ marginTop: 8, padding: "4px 12px", border: "none", background: "#3b82f6", color: "#fff", borderRadius: 3, cursor: "pointer" }}>Close</button>
        </div>
      )}
    </div>
  );
}

// Reusable DataTable component
function DataTable({ columns, rows, maxRows = 10 }) {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, maxRows).map((row, idx) => (
            <tr key={idx}>
              {columns.map((col, i) => (
                <td key={i}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AQI() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Column selection state
  const [selectedPredColumns, setSelectedPredColumns] = useState([]);
  const [showPredColDropdown, setShowPredColDropdown] = useState(false);
  // Add state for preview visibility
  const [showPreview, setShowPreview] = useState(false);
  // Add state for preview button hover
  const [previewHover, setPreviewHover] = useState(false);

  // Separate state for preview table columns and dropdown
  const [selectedPreviewColumns, setSelectedPreviewColumns] = useState([]);
  const [showPreviewColDropdown, setShowPreviewColDropdown] = useState(false);

  // Helper: Get all possible columns from predictions
  const allPredColumns = React.useMemo(() => (predictions.length > 0 ? Object.keys(predictions[0]) : []), [predictions]);
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFilePreview = () => {
    if (!file) return;
    // Toggle preview visibility
    setShowPreview((prev) => {
      if (!prev) {
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
      }
      return !prev;
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }
    setLoading(true);
    setError(null);

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
    formData.append("start_date", startDate);
    if (endDate) formData.append("end_date", endDate);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/aqi/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log("AQI backend response:", response.data);
      setPredictions(response.data.predictions || response.data.savedToDB?.predictions || []);
    } catch (err) {
      // Improved error handling: show backend error message/details if available
      let backendMsg = "";
      if (err?.response?.data?.details) {
        if (typeof err.response.data.details === "object") {
          backendMsg = JSON.stringify(err.response.data.details);
        } else {
          backendMsg = err.response.data.details;
        }
      } else if (err?.response?.data?.message) {
        backendMsg = err.response.data.message;
      } else if (err?.response?.data?.error) {
        backendMsg = err.response.data.error;
      } else if (err?.response?.data) {
        backendMsg = JSON.stringify(err.response.data);
      } else {
        backendMsg = err?.message || "";
      }
      setError("Failed to upload or predict. " + backendMsg);
      console.error("Error response:", err.response);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for checkbox selection in dropdown
  const handlePredColCheckbox = (col) => {
    setSelectedPredColumns((prev) => {
      if (prev.includes(col)) return prev.filter((c) => c !== col);
      if (prev.length < 5) return [...prev, col];
      return prev;
    });
  };

  // Handlers for preview table column selection
  const handlePreviewColCheckbox = (col) => {
    setSelectedPreviewColumns((prev) => {
      if (prev.includes(col)) return prev.filter((c) => c !== col);
      if (prev.length < 5) return [...prev, col];
      return prev;
    });
  };

  const [totalArea, setTotalArea] = useState("");
  const [greenAreaResult, setGreenAreaResult] = useState(null);
  const [greenAreaLoading, setGreenAreaLoading] = useState(false);
  const [greenAreaError, setGreenAreaError] = useState(null);

  return (
    <div className="home-container" style={{ overflowX: 'hidden', width: '100vw' }}>
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
            path="src\\assets\\Page 1\\WaterCard.jpg"
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

      {/* Upload controls */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div>
            <label htmlFor="start-date" style={{ fontWeight: 500, marginRight: 8 }}>Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ padding: 6, borderRadius: 4, border: "1px solid #d1d5db" }}
            />
          </div>
          <div>
            <label htmlFor="end-date" style={{ fontWeight: 500, marginRight: 8 }}>End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ padding: 6, borderRadius: 4, border: "1px solid #d1d5db" }}
            />
          </div>
        </div>
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleUpload} className="upload-button" style={{ marginTop: "8px" }}>
            Upload
          </button>
          {file && (
            <button
              onClick={handleFilePreview}
              className="upload-button"
              style={{
                marginTop: "8px",
                background: previewHover ? '#2563eb' : '#e0e7ff',
                color: previewHover ? '#fff' : '#1e40af',
                transition: 'background 0.2s, color 0.2s'
              }}
              onMouseEnter={() => setPreviewHover(true)}
              onMouseLeave={() => setPreviewHover(false)}
            >
              {showPreview ? 'Close Preview' : 'Preview CSV'}
            </button>
          )}
        </div>
        {/* CSV Preview Table with column dropdown */}
        {showPreview && data.length > 0 && (
          <div className="table-section">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
              <h4 style={{ marginBottom: 8, marginLeft: 35 }}>CSV Preview (first 10 rows):</h4>
              <ColumnDropdown
                columns={Object.keys(data[0])}
                selectedColumns={selectedPreviewColumns}
                setSelectedColumns={setSelectedPreviewColumns}
                showDropdown={showPreviewColDropdown}
                setShowDropdown={setShowPreviewColDropdown}
              />
            </div>
            <DataTable
              columns={selectedPreviewColumns.length > 0 ? selectedPreviewColumns : Object.keys(data[0]).slice(0, 5)}
              rows={data}
              maxRows={10}
            />
          </div>
        )}
      </div>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Predictions Table */}
      {allPredColumns.length > 0 && predictions.length > 0 && (
        <div className="table-section" style={{ maxWidth: 1200, margin: '0 auto 32px auto' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginLeft: 75, marginBottom: 20, marginTop: 40, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, marginRight: 16 }}>Predictions</h3>
            <ColumnDropdown
              columns={allPredColumns}
              selectedColumns={selectedPredColumns}
              setSelectedColumns={setSelectedPredColumns}
              showDropdown={showPredColDropdown}
              setShowDropdown={setShowPredColDropdown}
            />
          </div>
          <DataTable
            columns={displayPredColumns}
            rows={predictions}
            maxRows={5}
          />
          {/* Download Predictions Button at the bottom */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              className="upload-button"
              style={{ marginRight: 35, marginTop: 10, marginBottom: 20 }}
              onClick={() => {
                // Download displayed predictions as CSV
                const csvRows = [];
                csvRows.push(displayPredColumns.join(","));
                predictions.forEach(row => {
                  csvRows.push(displayPredColumns.map(col => JSON.stringify(row[col] ?? "")).join(","));
                });
                const csvContent = csvRows.join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "aqi_predictions.csv";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </button>
          </div>
          {/* Green Area Calculation Section */}
          <div className="green-area-section">
            <label htmlFor="total-area" className="green-area-label">Total Area (sq meters):</label>
            <input
              id="total-area"
              className="green-area-input"
              type="number"
              min="0"
              placeholder="Enter total area..."
              value={totalArea}
              onChange={e => setTotalArea(e.target.value)}
            />
            <button
              className="upload-button"
              style={{ marginLeft: 12, marginTop: 0 }}
              onClick={async () => {
                setGreenAreaResult(null);
                setGreenAreaError(null);
                if (!totalArea || isNaN(totalArea) || Number(totalArea) <= 0) {
                  setGreenAreaError("Please enter a valid total area.");
                  return;
                }
                setGreenAreaLoading(true);
                try {
                  const token = localStorage.getItem("accessToken");
                  const response = await axios.post(
                    "http://localhost:3000/api/aqi/calculate-green-area",
                    { totalArea },
                    { headers: { "Authorization": `Bearer ${token}` } }
                  );
                  setGreenAreaResult(response.data);
                } catch (err) {
                  let backendMsg = "";
                  if (err?.response?.data?.details) {
                    backendMsg = typeof err.response.data.details === "object" ? JSON.stringify(err.response.data.details) : err.response.data.details;
                  } else if (err?.response?.data?.message) {
                    backendMsg = err.response.data.message;
                  } else if (err?.response?.data?.error) {
                    backendMsg = err.response.data.error;
                  } else if (err?.response?.data) {
                    backendMsg = JSON.stringify(err.response.data);
                  } else {
                    backendMsg = err?.message || "";
                  }
                  setGreenAreaError("Failed to calculate green area. " + backendMsg);
                } finally {
                  setGreenAreaLoading(false);
                }
              }}
            >
              Calculate Green Area
            </button>
            {greenAreaLoading && <span className="green-area-loading">Calculating...</span>}
            {greenAreaError && <span className="green-area-error">{greenAreaError}</span>}
            {greenAreaResult && (
              <div className="green-area-result">
                <strong>Required Green Area:</strong> {greenAreaResult.greenArea} {greenAreaResult.unit}<br />
                <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  (GSF: {greenAreaResult.gsf}, Factor: {greenAreaResult.factor})
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AQI;
