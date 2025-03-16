import React from 'react';

const Card = ({ size, position, path, alt, style }) => {
  return (
    <div className="card" style={{ ...style, position: position }}>
      <img src={path} alt={alt} style={{ width: size, height: size }} />
    </div>
  );
};

export default Card;