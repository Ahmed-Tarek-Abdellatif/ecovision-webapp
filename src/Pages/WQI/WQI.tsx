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
import Analytics from '../../Analytics';
import DataTable from '../AQI/Components/DataTable';

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
        imagePath={'src/assets/Page 1/WaterCard.jpg'}
      ></Header>
      <Table fullName={'Water Quality Index'} name={'WQI'} ranges={ranges} classification={classification}></Table>
      {/* Constraints Section */}
      <div
        style={{
          maxWidth: 700,
          margin: '32px auto 16px auto',
          padding: '16px 24px',
          background: '#f5f7fa',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          color: '#333',
          fontSize: '1rem',
        }}
      >
        <strong>Data Upload Constraints:</strong>
        <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
          <li>Minimum <b>15 rows</b> required</li>
          <li>Minimum <b>2 columns</b> required</li>
          <li>
            Allowed column names: <b>pH</b>, <b>DO</b>, <b>BOD</b>, <b>Nitrates</b>, <b>Phosphates</b>, <b>Turbidity</b>
          </li>
        </ul>
      </div>
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
        handleUpload={async () => {
          if (!file) {
            alert('Please select a file first.');
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('start_date', startDate || '');
            const response = await axios.post('http://localhost:8070/predict-wqi-smart', formData);
            if (response.data && response.data.results) {
              setPredictions(response.data.results);
            } else if (response.data && response.data.predictions) {
              setPredictions(response.data.predictions);
            } else {
              setError('No predictions returned.');
            }
          } catch (err) {
            setError('Failed to upload or predict.');
          } finally {
            setLoading(false);
          }
        }}
      ></Upload>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {allPredColumns.length > 0 && predictions.length > 0 && (
        <>
          <div className="table-section" style={{ maxWidth: 1200, margin: '0 auto 32px auto' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                marginLeft: 75,
                marginBottom: 20,
                marginTop: 40,
                flexWrap: 'wrap',
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
            <DataTable columns={displayPredColumns} rows={predictions} maxRows={5} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                className="upload-button"
                style={{ marginRight: 35, marginTop: 10, marginBottom: 20 }}
                onClick={() => {
                  const csvRows = [] as string[];
                  csvRows.push(displayPredColumns.join(','));
                  predictions.forEach((row) => {
                    csvRows.push(displayPredColumns.map((col) => JSON.stringify(row[col] ?? '')).join(','));
                  });
                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'wqi_predictions.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Download
              </button>
            </div>
          </div>
          <div style={{ marginTop: 40 }}>
            <Analytics data={predictions} qualityIndexField="WQI" dateField="timestamp"/>
          </div>
        </>
      )}
    </div>
  );
}

export default WQI;
