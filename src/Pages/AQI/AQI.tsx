import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import { DataRow, GreenAreaResult, PredictionRow } from './Interface/Interface';
import Header from '../../Public Components/Header';
import Table from '../../Public Components/Table';
import Upload from '../../Public Components/Upload';
import { handleFileChange, handleFilePreview, handleUpload } from './Functions/Functions';
import ColumnDropdown from './Components/ColumnDropDown';
import DataTable from './Components/DataTable';

function AQI() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedPredColumns, setSelectedPredColumns] = useState<string[]>([]);
  const [showPredColDropdown, setShowPredColDropdown] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewHover, setPreviewHover] = useState<boolean>(false);

  const [selectedPreviewColumns, setSelectedPreviewColumns] = useState<string[]>([]);
  const [showPreviewColDropdown, setShowPreviewColDropdown] = useState<boolean>(false);

  const allPredColumns = React.useMemo(
    () => (predictions.length > 0 ? Object.keys(predictions[0]) : []),
    [predictions]
  );
  const displayPredColumns = selectedPredColumns.length > 0 ? selectedPredColumns : allPredColumns.slice(0, 5);

  const [totalArea, setTotalArea] = useState<number>();
  const [greenAreaResult, setGreenAreaResult] = useState<GreenAreaResult | null>(null);
  const [greenAreaLoading, setGreenAreaLoading] = useState<boolean>(false);
  const [greenAreaError, setGreenAreaError] = useState<string | null>(null);
  const ranges = ['0-50', '51-100', '101-150', '151-200', '201-300', '301-500'];

  const classification = [
    'Good',
    'Moderate',
    'Unhealthy for Sensitive Groups',
    'Unhealthy',
    'Very Unhealthy',
    'Very Hazardous',
  ];
  return (
    <div className="home-container" style={{ overflowX: 'hidden', width: '100vw' }}>
      <Header
        details={
          'Join us in building sustainable cities where clean air powers healthier communities. Together, we can create a future where everyone breathes easy and thrives in harmony with nature.'
        }
        header={'Clean Air, Healthy Lives'}
      ></Header>
      <Table fullName={'Air Quality Index'} name={'AQI'} ranges={ranges} classification={classification}></Table>
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
        handleFilePreview={handleFilePreview}

      ></Upload>

      {loading && <p>Loading predictions...</p>}
      {error && <p className="error-message">{error}</p>}

      {allPredColumns.length > 0 && predictions.length > 0 && (
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
            <ColumnDropdown
              columns={allPredColumns}
              selectedColumns={selectedPredColumns}
              setSelectedColumns={setSelectedPredColumns}
              showDropdown={showPredColDropdown}
              setShowDropdown={setShowPredColDropdown}
              label={undefined}
            />
          </div>
          <DataTable columns={displayPredColumns} rows={predictions} maxRows={5} />
          {/* Download Predictions Button at the bottom */}
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
                a.download = 'aqi_predictions.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </button>
          </div>
          <div className="green-area-section">
            <label htmlFor="total-area" className="green-area-label">
              Total Area (sq meters):
            </label>
            <input
              id="total-area"
              className="green-area-input"
              type="number"
              min="0"
              placeholder="Enter total area..."
              value={totalArea}
              onChange={(e) => setTotalArea(Number(e.target.value))}
            />
            <button
              className="upload-button"
              style={{ marginLeft: 12, marginTop: 0 }}
              onClick={async () => {
                setGreenAreaResult(null);
                setGreenAreaError(null);
                if (!totalArea || isNaN(totalArea) || Number(totalArea) <= 0) {
                  setGreenAreaError('Please enter a valid total area.');
                  return;
                }
                setGreenAreaLoading(true);
                try {
                  const token = localStorage.getItem('accessToken');
                  const response = await axios.post(
                    'http://localhost:3000/api/aqi/calculate-green-area',
                    { totalArea },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setGreenAreaResult(response.data);
                } catch (err) {
                  let backendMsg = '';
                  if (err?.response?.data?.details) {
                    backendMsg =
                      typeof err.response.data.details === 'object'
                        ? JSON.stringify(err.response.data.details)
                        : err.response.data.details;
                  } else if (err?.response?.data?.message) {
                    backendMsg = err.response.data.message;
                  } else if (err?.response?.data?.error) {
                    backendMsg = err.response.data.error;
                  } else if (err?.response?.data) {
                    backendMsg = JSON.stringify(err.response.data);
                  } else {
                    backendMsg = err?.message || '';
                  }
                  setGreenAreaError('Failed to calculate green area. ' + backendMsg);
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
                <strong>Required Green Area:</strong> {greenAreaResult.greenArea} {greenAreaResult.unit}
                <br />
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
