import React from "react";
import "../App.css"; 
import Card from "../components/Card";

function HomePage() {
    return (
        <div className="home-container">
            <Card
                width="100%"
                height="450px"
                position="absolute"
                path="src/assets/HomeScreenValley.jpg"
                alt="Description of image"
                style={{ border: '1px solid ', borderRadius: '8px', zIndex: 0 }}
                marginTop="0px"
                marginBottom="20px"
                marginLeft="0px"
                marginRight="10px"
            />
            <div className="content">
                <h1>Aiming for a Green Future</h1>
                <p>Join us in creating sustainable cities where clean air and pure water drive healthier communities. Together, we can build a future that thrives in harmony with nature.</p>
                <div className="buttons">
                    <button className="start-button">START</button>
                    <button className="more-button">FIND OUT MORE</button>
                </div>
            </div>
            <Card
                width="300px"
                height="400px"
                position="relative"
                path="src/assets/GreenCityHomeScreen.jpg"
                alt="Description of image"
                style={{ border: '1px solid ', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0)' }}
                marginTop="170px"
                marginBottom="20px"
                marginLeft="10px"
                marginRight="50px"
            />
        </div>
    );
}

export default HomePage;