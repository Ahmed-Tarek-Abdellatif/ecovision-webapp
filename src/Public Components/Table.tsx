import React from "react";

// Helper to map AQI class names to CSS classes
const getAqiClassName = (classification) => {
  if (!classification) return "aqi-class";
  const map = {
    "Good": "aqi-class aqi-good",
    "Moderate": "aqi-class aqi-moderate",
    "Unhealthy for Sensitive Groups": "aqi-class aqi-unhealthy-sensitive",
    "Unhealthy": "aqi-class aqi-unhealthy",
    "Very Unhealthy": "aqi-class aqi-very-unhealthy",
    "Very Hazardous": "aqi-class aqi-very-hazardous",
  };
  return map[classification] || "aqi-class";
};

// Helper to map WQI class names to CSS classes
const getWqiClassName = (classification) => {
  if (!classification) return "wqi-class";
  const map = {
    "Excellent": "wqi-class wqi-excellent",
    "Good": "wqi-class wqi-good",
    "Medium": "wqi-class wqi-medium",
    "Bad": "wqi-class wqi-bad",
    "Very Bad": "wqi-class wqi-very-bad",
  };
  return map[classification] || "wqi-class";
};

function Table({fullName ,name, ranges, classification}) {
  const isWQI = name && name.toUpperCase().includes('WQI');
  return (
    <h1
      className="aqi-title"
      style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '30px', marginBottom: '10px', textAlign: 'center' }}
    >
      {fullName} ({name}) Classification
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <table className="data-table aqi-classification-table" style={{ width: '50vw', minWidth: 420, maxWidth: '900px', borderCollapse: 'collapse', border: '1px solid #e5e7eb', fontSize: '1.15rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <thead>
            <tr>
              <th style={{ padding: '18px 32px', fontWeight: 'bold', borderRight: '1px solid #e5e7eb', width: '50%', fontSize: '1.18rem' }}>Classification</th>
              <th style={{ padding: '18px 32px', fontWeight: 'bold', width: '50%', fontSize: '1.18rem' }}>{name} Range</th>
            </tr>
          </thead>
          <tbody>
            {classification.map((cls, i) => (
              <tr key={i} style={i % 2 === 1 ? { background: '#f3f4f6' } : {}}>
                <td style={{ padding: '18px 32px', borderRight: '1px solid #e5e7eb', fontSize: '1.12rem' }}>
                  <span
                    className={isWQI ? getWqiClassName(cls) : getAqiClassName(cls)}
                    style={{ fontSize: '1.08rem', minWidth: 120, display: 'inline-block' }}
                  >
                    {cls}
                  </span>
                </td>
                <td style={{ padding: '18px 32px', fontSize: '1.12rem', fontWeight: 500 }}>{ranges[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </h1>
  );
}

export default Table;