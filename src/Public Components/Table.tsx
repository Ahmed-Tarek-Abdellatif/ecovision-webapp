import React from "react";

function Table({fullName ,name, ranges, classification}) {
  return (
    <h1
      className="aqi-title"
      style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '30px', marginBottom: '10px', textAlign: 'center' }}
    >
      {fullName} ({name}) Classification
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <table className="data-table" style={{ width: '80%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 20px', fontWeight: 'bold', borderRight: '1px solid #e5e7eb' }}>{name} Range</th>
              <th style={{ padding: '10px 20px', fontWeight: 'bold' }}>Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[0]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[0]}</td>
            </tr>
            <tr style={{ background: '#f3f4f6' }}>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[1]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[1]}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[2]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[2]}</td>
            </tr>
            <tr style={{ background: '#f3f4f6' }}>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[3]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[3]}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[4]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[4]}</td>
            </tr>
            <tr style={{ background: '#f3f4f6' }}>
              <td style={{ padding: '8px 20px', borderRight: '1px solid #e5e7eb' }}>{ranges[5]}</td>
              <td style={{ padding: '8px 20px' }}>{classification[5]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </h1>
  );
}


export default Table;