import React, { useState } from "react";
import Papa from "papaparse";
import "../App.css"; 
import Card from "../components/Card";

function WQI() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    const rows = result.data;
                    if (rows.length > 19) {
                        setData(rows.slice(0, 20)); // Limit to first 20 rows
                    } else {
                        setData(rows);
                    }
                },
                header: true
            });
        } else {
            alert("Please select a file first.");
        }
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <Card
                    width="110%"
                    height="500px"
                    position="absolute"
                    path="src/assets/Page 1/Page 1.1.png"
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
                    path="src/assets/Page 1/Page 1.2.png"
                    alt="Description of image"
                    style={{ border: '1px solid ', borderRadius: '8px', boxShadow: '0 6px 8px rgba(0, 0, 0)', left: '300px'  }}
                    marginTop="170px"
                    marginBottom="20px"
                    marginLeft="10px"
                    marginRight="50px"
                />
            </div>
            <h1>WQI Page</h1>
            <div className="upload-container">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-button">
                    Choose File
                </label>
                <button onClick={handleUpload} className="upload-button">
                    Upload
                </button>
            </div>
            {data.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default WQI;