import React from "react";
import Card from "./Card";
import { HeaderProps } from "./interfaces";

function Header ({header, details} : HeaderProps) {
  return (
    <div
        className="home-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div className="content" style={{ flex: 1 }}>
          <h1>{header}</h1>
          <p>
            {details}
          </p>
        </div>
        <div
          style={{
            flex: '0 0 320px',
            marginLeft: '40px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '70px',
          }}
        >
          <Card
            width="300px"
            height="400px"
            position="relative"
            path="src\assets\Page 1\WaterCard.jpg"
            alt="Header Image"
            style={{
              border: '1px solid ',
              borderRadius: '8px',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
              marginLeft: '0',
            }}
          />
        </div>
      </div>
  );
}

export default Header;