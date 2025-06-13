import React from 'react';
import { GridProps } from './interfaces';

function Grid({columns} : GridProps) {
  const style :  React.CSSProperties  = {
    padding: '8px',
    fontWeight: 'bold',
  };
  return (
    <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((header, index) => (
              <th key={index} style={style}>
              {header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default Grid;
