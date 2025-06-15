import React from "react";
import { CardProps } from "./interfaces";

const Card = ({
  width,
  height,
  position,
  path,
  alt,
  style,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: CardProps) => {
  return (
    <div
      className="card"
      style={{
        position: position || 'relative',
        width: width,
        height: height,
        marginTop: marginTop,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        marginRight: marginRight,
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'block',
        ...style,
      }}
    >
      <img
        src={path}
        alt={alt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default Card;
