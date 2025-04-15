import React from "react";

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
}) => {
  return (
    <div
      className="card"
      style={{
        ...style,
        position: position,
        width: width,
        height: height,
        marginTop: marginTop,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        marginRight: marginRight,
      }}
    >
      <img
        src={path}
        alt={alt}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      />
    </div>
  );
};

export default Card;
