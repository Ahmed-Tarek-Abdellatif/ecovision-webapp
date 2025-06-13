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
  // Column selection state for data and predictions
  const [selectedDataColumns, setSelectedDataColumns] = useState([]);
  const [showDataColDropdown, setShowDataColDropdown] = useState(false);
  const [selectedPredColumns, setSelectedPredColumns] = useState([]);
  const [showPredColDropdown, setShowPredColDropdown] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const [selectedPreviewColumns, setSelectedPreviewColumns] = useState([]);
  const [showPreviewColDropdown, setShowPreviewColDropdown] = useState(false);

  // Helper: Get all possible columns from data/predictions
  const allDataColumns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const displayDataColumns = selectedDataColumns.length > 0 ? selectedDataColumns : allDataColumns.slice(0, 5);
  const allPredColumns = React.useMemo(() => (predictions.length > 0 ? Object.keys(predictions[0]) : []), [predictions]);
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);

  // File change handler
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // File preview handler (like AQI)
  const handleFilePreview = () => {
    if (!file) return;
    setShowPreview((prev) => {
      if (!prev) {
        Papa.parse(file, {
          complete: (result) => {
            const rows = result.data;
            if (rows.length > 19) {
              setData(rows.slice(0, 20));
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

  // Upload handler (connect to backend)
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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_date", startDate);
    if (endDate) formData.append("end_date", endDate);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/wqi/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setPredictions(response.data.predictions || response.data.savedToDB?.predictions || []);
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
      setError("Failed to upload or predict. " + backendMsg);
    } finally {
      setLoading(false);
    }
  };

  // Checkbox handlers for column dropdowns
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

  // Download predictions as CSV
  const handleDownload = () => {
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
    a.download = "wqi_predictions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        Water Quality Index Classification
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

      {/* Upload controls (like AQI) */}
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
              {/* ColumnDropdown for preview table */}
              {data.length > 0 && (
                <div style={{ position: 'relative', marginLeft: 16 }}>
                  <button
                    type="button"
                    onClick={() => setShowPreviewColDropdown(v => !v)}
                    className="upload-button"
                    style={{ minWidth: 180, textAlign: "left", background: "#fff", color: "#111827", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", position: "relative" }}
                  >
                    <span style={{ color: selectedPreviewColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
                      {selectedPreviewColumns.length > 0
                        ? `Columns: ${selectedPreviewColumns.join(', ')}`
                        : 'Select columns (1-5)'}
                    </span>
                  </button>
                  {showPreviewColDropdown && (
                    <div style={{ position: "absolute", zIndex: 10, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 8, minWidth: 180, marginTop: 4 }}>
                      <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
                      {Object.keys(data[0]).map(col => (
                        <label key={col} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <input
                            type="checkbox"
                            checked={selectedPreviewColumns.includes(col)}
                            onChange={() => {
                              setSelectedPreviewColumns(prev => {
                                if (prev.includes(col)) return prev.filter(c => c !== col);
                                if (prev.length < 5) return [...prev, col];
                                return prev;
                              });
                            }}
                            disabled={
                              (!selectedPreviewColumns.includes(col) && selectedPreviewColumns.length >= 5) ||
                              (selectedPreviewColumns.length === 1 && selectedPreviewColumns.includes(col))
                            }
                          />
                          <span>{col}</span>
                        </label>
                      ))}
                      <button type="button" onClick={() => setShowPreviewColDropdown(false)} style={{ marginTop: 8, padding: "4px 12px", border: "none", background: "#3b82f6", color: "#fff", borderRadius: 3, cursor: "pointer" }}>Close</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    {(selectedPreviewColumns.length > 0 ? selectedPreviewColumns : Object.keys(data[0]).slice(0, 5)).map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {(selectedPreviewColumns.length > 0 ? selectedPreviewColumns : Object.keys(data[0]).slice(0, 5)).map((col, i) => (
                        <td key={i}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Column dropdown for Predictions */}
      {allPredColumns.length > 0 && predictions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: displayDataColumns.length === 1 ? 180 : '100%', marginLeft: 75, marginBottom: 20, marginTop: 120 }}>
            <h3 style={{ margin: 0, marginRight: 16 }}>Predictions</h3>
            <div style={{ position: 'relative', marginLeft: 0 }}>
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
        <button onClick={handleDownload} className="upload-button" style={{ marginLeft: 1295, marginTop: 10, marginBottom: 20 }}>
          Download Predictions
        </button>
      )}
    </div>
  );
}

export default WQI;
