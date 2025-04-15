import React, { useState } from "react";
import Papa from "papaparse";
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
            setData(rows.slice(0, 20));
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
    <div className="aqi-section">
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

      {data.length > 0 && (
        <div className="aqi-table">
          <div className="aqi-row">
            {Object.keys(data[0]).map((key, index) => (
              <div key={index} className="aqi-cell">
                {key}
              </div>
            ))}
          </div>
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="aqi-row">
              {Object.values(row).map((value, colIndex) => (
                <div key={colIndex} className="aqi-cell">
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AQI;