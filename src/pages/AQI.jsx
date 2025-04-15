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
    <div className="home-container">
      <h1>AQI Page</h1>
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
      )}
    </div>
  );
}

export default AQI;
