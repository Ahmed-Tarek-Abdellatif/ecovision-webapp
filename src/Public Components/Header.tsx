import React from "react";
import Card from "./Card";
import { HeaderProps } from "./interfaces";

interface ExtendedHeaderProps extends HeaderProps {
  imagePath?: string;
}

function Header ({ header, details, imagePath }: ExtendedHeaderProps) {
  // Default images for AQI, WQI, and Home
  let cardImage = imagePath;
  if (!cardImage) {
    if (header?.toLowerCase().includes('water')) {
      cardImage = 'src/assets/Page 1/WaterCard.jpg';
    } else if (header?.toLowerCase().includes('air')) {
      cardImage = 'src/assets/Page 1/AirCard.jpg';
    } else {
      cardImage = 'src/assets/Page 1/DefaultCard.jpg';
    }
  }
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
            path={cardImage}
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