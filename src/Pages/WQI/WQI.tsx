import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import '../../App.css';
import { DataRow, PredictionRow } from '../AQI/Interface/Interface';
import Header from '../../Public Components/Header';
import Table from '../../Public Components/Table';
import { HandleOnDrop } from '../../Public Functions/HandleOnDrop';
import { HandleOnDragOver } from '../../Public Functions/HandleOnDragOver';
import { HandleOnDragLeave } from '../../Public Functions/HandleOnDragLeave';
import { handleDownload, handlePredColCheckbox } from '../WQI/Functions/Functions';
import { handleFilePreview } from '../AQI/Functions/Functions';
import Upload from '../../Public Components/Upload';

function WQI() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDataColumns, setSelectedDataColumns] = useState<string[]>([]);
  const [showDataColDropdown, setShowDataColDropdown] = useState<boolean>(false);
  const [showPredColDropdown, setShowPredColDropdown] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewHover, setPreviewHover] = useState<boolean>(false);
  const [showPreviewColDropdown, setShowPreviewColDropdown] = useState<boolean>(false);
  const allDataColumns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const displayDataColumns = selectedDataColumns.length > 0 ? selectedDataColumns : allDataColumns.slice(0, 5);
  const allPredColumns = React.useMemo(
    () => (predictions.length > 0 ? Object.keys(predictions[0]) : []),
    [predictions]
  );
  const [selectedPredColumns, setSelectedPredColumns] = useState<string[]>([]);
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);
  const [selectedPreviewColumns, setSelectedPreviewColumns] = useState<string[]>([]);
  const ranges = ['90-100', '70-90', '50-70', '25-50', '0-25'];

  const classification = ['Excellent', 'Good', 'Medium', 'Bad', 'Very Bad'];

  
  return (
    <div className="home-container">
      <Header
        details={
          ' Join us in creating sustainable cities where clean water drive healthier communities. Together, we can build a future that thrives in harmony with nature.'
        }
        header={'Aiming for a Better Future'}
      ></Header>
      <Table fullName={'Water Quality Index'} name={'WQI'} ranges={ranges} classification={classification}></Table>
      <Upload
        file={file}
        setFile={setFile}
        setData={setData}
        setEndDate={setEndDate}
        setPreviewHover={setPreviewHover}
        setSelectedPreviewColumns={setSelectedPreviewColumns}
        setShowPreview={setShowPreview}
        setShowPreviewColDropdown={setShowPreviewColDropdown}
        setStartDate={setStartDate}
        selectedPreviewColumns={selectedPreviewColumns}
        startDate={startDate}
        showPreview={showPreview}
        showPreviewColDropdown={showPreviewColDropdown}
        data={data}
        endDate={endDate}
        previewHover={previewHover}
        handleFilePreview={() => handleFilePreview({ file, setShowPreview, setData })}
      ></Upload>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

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
                        onChange={() => handlePredColCheckbox({col, setSelectedPredColumns})}
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
