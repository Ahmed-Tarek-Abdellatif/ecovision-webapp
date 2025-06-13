import React from 'react';
import { handleFileChange, handleUpload } from '../Pages/AQI/Functions/Function';
import { HandleOnDragOver } from '../Public Functions/HandleOnDragOver';
import { UploadProps } from './interfaces';
import { HandleOnDrop } from '../Public Functions/HandleOnDrop';

function Upload({ file, setFile, setData }: UploadProps) {
  const style :  React.CSSProperties = {
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
        style={style}
        onDragOver={HandleOnDragOver}
        onDragLeave={HandleOnDragOver}
        onDrop={(event) => {
          HandleOnDrop({ event, setFile });
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
        <span style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Only .csv files are supported</span>
        {file && <span style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 500 }}>Selected: {file.name}</span>}
      </label>
      <button onClick={() => handleUpload({ file, setData })} className="upload-button" style={{ marginTop: '8px' }}>
        Upload
      </button>
    </div>
  );
}

export default Upload;
