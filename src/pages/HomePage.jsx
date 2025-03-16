import React from "react";
import "../App.css"; 
import Card from "../components/Card";

function HomePage() {
    return (
        <div className="home-container">
            <div>
                <Card
                    size="150px"
                    position="flex-right"
                    path="src/assets/Logo.png"
                    alt="Description of image"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                />
            </div>
        </div>
    );
}

export default HomePage;