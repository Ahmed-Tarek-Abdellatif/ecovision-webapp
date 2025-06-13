import React, { useState } from 'react';
import Card from '../../Public Components/Card';
import '../../App.css';
import { handleDownload, handleFileChange, handleUpload } from './Functions/Functions';
import Table from '../../Public Components/Table';


function WQI() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState([]); // TODO: Someone Make this Datatype
  const [predictions, setPredictions] = useState(); // TODO: Someone Make this Datatype
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDataColumns, setSelectedDataColumns] = useState([]);
  const [selectedPredColumns, setSelectedPredColumns] = useState([]);
  const [showDataColDropdown, setShowDataColDropdown] = useState(false);
  const [showPredColDropdown, setShowPredColDropdown] = useState(false);

  const allDataColumns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const allPredColumns = React.useMemo(
    () => (predictions.length > 0 ? Object.keys(predictions[0]) : []),
    [predictions]
  );

  const displayDataColumns = selectedDataColumns.length > 0 ? selectedDataColumns : allDataColumns.slice(0, 5);
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);
  const ranges = ['90-100', '70-90', '50-70', '25-50', '0-25'];

  const classification = [
    "Excellent",
    "Good",
    "Medium",
    "Bad",
    "Very Bad",
  ]

  function handlePredColCheckbox(col: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="home-container">
      <div
        className="home-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div className="content" style={{ flex: 1 }}>
          <h1>Aiming for a Better Future</h1>
          <p>
            Join us in creating sustainable cities where clean water drive healthier communities. Together, we can build
            a future that thrives in harmony with nature.
          </p>
        </div>
        <div
          style={{
            flex: '0 0 320px',
            marginLeft: '40px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '70px',
          }}
        >
          <Card
            width="300px"
            height="400px"
            position="relative"
            path="src\assets\Page 1\WaterCard.jpg"
            alt="Header Image"
            style={{
              border: '1px solid ',
              borderRadius: '8px',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
              marginLeft: '0',
            }}
          />
        </div>
      </div>
     <Table fullName={'Water Quality Index'} name={'WQI'} ranges={ranges} classification={classification}></Table>
      <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Date</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>pH</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Dissolved Oxygen (DO)</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Biochemical Oxygen Demand (BOD)</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Temperature</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Turbidity</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Total Dissolved Solids (TDS)</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Nitrates</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Fecal Coliform</th>
              <th style={{ padding: '8px', fontWeight: 'bold' }}>Conductivity</th>
            </tr>
          </thead>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => handleFileChange({ event, setFile })}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="file-input-label"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            border: '2px dashed #d1d5db',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto 16px auto',
            background: '#fff',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.background = '#f0f9ff';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#fff';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#fff';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <i
            className="fas fa-cloud-upload-alt"
            style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}
          ></i>
          <span style={{ fontWeight: 500, color: '#374151' }}>
            Drag & drop your CSV file here, or{' '}
            <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>browse</span>
          </span>
          <span style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Only .csv files are supported
          </span>
          {file && (
            <span style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 500 }}>Selected: {file.name}</span>
          )}
        </label>
        <button
          onClick={() => handleUpload({ file, setLoading, setError, setData, setPredictions })}
          className="upload-button"
          style={{ marginTop: '8px' }}
        >
          Upload
        </button>
      </div>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: displayDataColumns.length === 1 ? 180 : '100%',
              marginLeft: 35,
              marginBottom: 20,
            }}
          >
            <h3 style={{ margin: 0, marginRight: 16 }}>Uploaded Data</h3>
            {allDataColumns.length > 0 && (
              <div style={{ position: 'relative', marginLeft: 0 }}>
                <button
                  type="button"
                  onClick={() => setShowDataColDropdown((v) => !v)}
                  style={{
                    padding: '6px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    background: '#fff',
                    cursor: 'pointer',
                    minWidth: 180,
                    textAlign: 'left',
                    position: 'relative',
                  }}
                >
                  <span style={{ color: selectedDataColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
                    {selectedDataColumns.length > 0
                      ? `Columns: ${selectedDataColumns.join(', ')}`
                      : 'Select columns (1-5)'}
                  </span>
                </button>
                {showDataColDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: 4,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      padding: 8,
                      minWidth: 180,
                      marginTop: 4,
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
                    {allDataColumns.map((col) => (
                      <label key={col} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <input
                          type="checkbox"
                          checked={selectedDataColumns.includes(col)}
                          onChange={() => handlePredColCheckbox(col)}
                          disabled={
                            (!selectedDataColumns.includes(col) && selectedDataColumns.length >= 5) ||
                            (selectedDataColumns.length === 1 && selectedDataColumns.includes(col))
                          }
                        />
                        <span>{col}</span>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowDataColDropdown(false)}
                      style={{
                        marginTop: 8,
                        padding: '4px 12px',
                        border: 'none',
                        background: '#3b82f6',
                        color: '#fff',
                        borderRadius: 3,
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            style={{
              width: displayDataColumns.length === 1 ? 180 : '100%',
              overflowX: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <table
              className="data-table"
              style={{
                width: displayDataColumns.length === 1 ? 180 : '100%',
                minWidth: 0,
                tableLayout: displayDataColumns.length === 1 ? 'fixed' : 'auto',
                margin: '0 auto',
              }}
            >
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

      {allPredColumns.length > 0 && predictions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: displayDataColumns.length === 1 ? 180 : '100%',
              marginLeft: 75,
              marginBottom: 20,
              marginTop: 120,
            }}
          >
            <h3 style={{ margin: 0, marginRight: 16 }}>Predictions</h3>
            <div style={{ position: 'relative', marginLeft: 0 }}>
              <button
                type="button"
                onClick={() => setShowPredColDropdown((v) => !v)}
                style={{
                  padding: '6px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  background: '#fff',
                  cursor: 'pointer',
                  minWidth: 180,
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                <span style={{ color: selectedPredColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
                  {selectedPredColumns.length > 0
                    ? `Columns: ${selectedPredColumns.join(', ')}`
                    : 'Select columns (1-5)'}
                </span>
              </button>
              {showPredColDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    background: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: 8,
                    minWidth: 180,
                    marginTop: 4,
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: 6, color: '#2563eb' }}>Select columns to display</div>
                  {allPredColumns.map((col) => (
                    <label key={col} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
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
                  <button
                    type="button"
                    onClick={() => setShowPredColDropdown(false)}
                    style={{
                      marginTop: 8,
                      padding: '4px 12px',
                      border: 'none',
                      background: '#3b82f6',
                      color: '#fff',
                      borderRadius: 3,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              width: displayPredColumns.length === 1 ? 180 : '100%',
              overflowX: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <table
              className="data-table"
              style={{
                width: displayPredColumns.length === 1 ? 180 : '100%',
                minWidth: 0,
                tableLayout: displayPredColumns.length === 1 ? 'fixed' : 'auto',
                margin: '0 auto',
              }}
            >
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
        <button
          onClick={() => handleDownload({ predictions })}
          className="upload-button"
          style={{ marginLeft: 1295, marginTop: 10, marginBottom: 20 }}
        >
          Download Predictions
        </button>
      )}
    </div>
  );
}

export default WQI;
