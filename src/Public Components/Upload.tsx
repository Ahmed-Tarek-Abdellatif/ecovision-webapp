import React from 'react';
import { handleFileChange, handleUpload as handleUploadDefault } from '../Pages/AQI/Functions/Functions';
import { HandleOnDragOver } from '../Public Functions/HandleOnDragOver';
import { UploadProps } from './interfaces';
import { HandleOnDrop } from '../Public Functions/HandleOnDrop';
import DataTable from '../Pages/AQI/Components/DataTable';
import ColumnDropdown from '../Pages/AQI/Components/ColumnDropDown';

function Upload({
  file,
  setFile,
  data,
  setData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  previewHover,
  setPreviewHover,
  showPreview,
  selectedPreviewColumns,
  setSelectedPreviewColumns,
  showPreviewColDropdown,
  setShowPreviewColDropdown,
  handleFilePreview,
  handleUpload,
  setShowPreview
}: UploadProps) {
  const style: React.CSSProperties = {
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
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div>
          <label htmlFor="start-date" style={{ fontWeight: 500, marginRight: 8 }}>
            Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label htmlFor="end-date" style={{ fontWeight: 500, marginRight: 8 }}>
            End Date:
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: 6, borderRadius: 4, border: '1px solid #d1d5db' }}
          />
        </div>
      </div>
      <input type="file" accept=".csv" onChange={(event) => handleFileChange({event, setFile})} style={{ display: 'none' }} id="file-upload" />
      <label
        htmlFor="file-upload"
        className="file-input-label"
        style={style}
        onDragOver={HandleOnDragOver}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = '#fff';
        }}
        onDrop={(event) => HandleOnDrop({event, setFile })}
      >
        <i
          className="fas fa-cloud-upload-alt"
          style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}
        ></i>
        <span style={{ fontWeight: 500, color: '#374151' }}>
          Drag & drop your CSV file here, or{' '}
          <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>browse</span>
        </span>
        <span style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Only .csv files are supported</span>
        {file && <span style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 500 }}>Selected: {file.name}</span>}
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleUpload ? handleUpload : () => handleUploadDefault({file, setData})} className="upload-button" style={{ marginTop: '8px' }}>
          Upload
        </button>
        {file && (
          <button
            onClick={() => handleFilePreview && handleFilePreview({ file, setShowPreview, setData })}
            className="upload-button"
            style={{
              marginTop: '8px',
              background: previewHover ? '#2563eb' : '#e0e7ff',
              color: previewHover ? '#fff' : '#1e40af',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={() => setPreviewHover(true)}
            onMouseLeave={() => setPreviewHover(false)}
          >
            {showPreview ? 'Close Preview' : 'Preview CSV'}
          </button>
        )}
      </div>
      {showPreview && data.length > 0 && (
        <div className="table-section">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <h4 style={{ marginBottom: 8, marginLeft: 35 }}>CSV Preview (first 10 rows):</h4>
            <ColumnDropdown
              columns={Object.keys(data[0])}
              selectedColumns={selectedPreviewColumns}
              setSelectedColumns={setSelectedPreviewColumns}
              showDropdown={showPreviewColDropdown}
              setShowDropdown={setShowPreviewColDropdown} label={undefined}            />
          </div>
          <DataTable
            columns={selectedPreviewColumns.length > 0 ? selectedPreviewColumns : Object.keys(data[0]).slice(0, 5)}
            rows={data}
            maxRows={10}
          />
        </div>
      )}
    </div>
  );
}

export default Upload;
