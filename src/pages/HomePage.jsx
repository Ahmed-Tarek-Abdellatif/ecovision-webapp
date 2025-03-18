import React from "react";
import "../App.css"; 
import Card from "../components/Card";

function HomePage() {
    return (
        <div className="home-container">
            <div className="home-header">
            <Card
                width="110%"
                height="500px"
                position="absolute"
                path="src\assets\Page 1\Page 1.1.png"
                alt="Description of image"
                style={{ border: '1px solid ', borderRadius: '8px', zIndex: 0 }}
                marginTop="0px"
                marginBottom="20px"
                marginLeft="-30px"
                marginRight="0px"
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
                path="src\assets\Page 1\Page 1.2.png"
                alt="Description of image"
                style={{ border: '1px solid ', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0)', left: '300px'  }}
                marginTop="170px"
                marginBottom="20px"
                marginLeft="10px"
                marginRight="50px"
            />
            </div>
            <div className="services-section">
                <div className="services-header">
                    <h2>Air, Water, and Green Solutions</h2>
                    <p>Harness advanced tools to predict Air Quality Index (AQI) and Water Quality Index (WQI), and calculate the green land required to offset pollutants. Empowering you with the knowledge to create cleaner, healthier, and more sustainable communities.</p>
                    <button className="more-button">MORE</button>
                </div>
                <div className="services-cards">
                    <Card
                        width="200px"
                        height="300px"
                        position="relative"
                        path="src\assets\Page 1\Page 1.3.png"
                        alt="Air Quality"
                        style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)' }}
                        marginTop="20px"
                        marginBottom="20px"
                        marginLeft="10px"
                        marginRight="10px"
                    />
                    <Card
                        width="200px"
                        height="300px"
                        position="relative"
                        path="src\assets\Page 1\Page 1.4.png"
                        alt="Water Quality"
                        style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)' }}
                        marginTop="20px"
                        marginBottom="20px"
                        marginLeft="10px"
                        marginRight="10px"
                    />
                    <Card
                        width="200px"
                        height="300px"
                        position="relative"
                        path="src\assets\Page 1\Page 1.5.png"
                        alt="Green Coverage"
                        style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)' }}
                        marginTop="20px"
                        marginBottom="20px"
                        marginLeft="10px"
                        marginRight="10px"
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;