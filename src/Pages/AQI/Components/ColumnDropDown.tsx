import React from 'react';
import { ColumnDropDownProps } from '../Interface/Interface';

function ColumnDropdown({
  columns,
  selectedColumns,
  setSelectedColumns,
  showDropdown,
  setShowDropdown,
  label = 'Select Columns',
}: ColumnDropDownProps) {
  return (
    <div style={{ position: 'relative', marginLeft: 16 }}>
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        className="upload-button"
        style={{
          minWidth: 180,
          textAlign: 'left',
          background: '#fff',
          color: '#111827',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <span style={{ color: selectedColumns.length === 0 ? '#6b7280' : '#111827', fontWeight: 500 }}>
          {selectedColumns.length > 0 ? `Columns: ${selectedColumns.join(', ')}` : label || 'Select columns (1-5)'}
        </span>
      </button>
      {showDropdown && (
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
          {columns.map((col) => (
            <label key={col} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => {
                  setSelectedColumns((prev) => {
                    if (prev.includes(col)) return prev.filter((c) => c !== col);
                    if (prev.length < 5) return [...prev, col];
                    return prev;
                  });
                }}
                disabled={
                  (!selectedColumns.includes(col) && selectedColumns.length >= 5) ||
                  (selectedColumns.length === 1 && selectedColumns.includes(col))
                }
              />
              <span>{col}</span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => setShowDropdown(false)}
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
  );
}

export default ColumnDropdown;
