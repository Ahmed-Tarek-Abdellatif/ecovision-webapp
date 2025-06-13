import React, { useState } from 'react';
import Card from '../../Public Components/Card';
import '../../App.css';
import { handleDownload} from './Functions/Functions';
import Table from '../../Public Components/Table';
import Header from '../../Public Components/Header';
import Grid from '../../Public Components/Grid';
import Upload from '../../Public Components/Upload';

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

  const classification = ['Excellent', 'Good', 'Medium', 'Bad', 'Very Bad'];
  const columns = [
    'Date',
    'pH',
    'Dissolved Oxygen (DO)',
    'Biochemical Oxygen Demand (BOD)',
    'Temperature',
    'Turbidity',
    'Total Dissolved Solids (TDS)',
    'Nitrates',
    'Fecal Coliform',
    'Conductivity',
  ];
  function handlePredColCheckbox(col: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="home-container">
      <Header
        header={'Aiming for a Better Future'}
        details={
          'Join us in creating sustainable cities where clean water drive healthier communities. Together, we can build a future that thrives in harmony with nature.'
        }
      ></Header>
      <Table fullName={'Water Quality Index'} name={'WQI'} ranges={ranges} classification={classification}></Table>
      <Grid columns={columns}></Grid>
      <Upload file={file}  setFile={setFile} setData={setData}></Upload>
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
