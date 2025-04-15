import React, { useState } from "react";
import "./Calculator.css";

const Calculator = () => {
  const [area, setArea] = useState("");
  const [mixingHeight, setMixingHeight] = useState("");
  const [requiredGreenArea, setRequiredGreenArea] = useState("");

  const calculateGreenArea = () => {
    if (area && mixingHeight) {
      const result = (parseFloat(area) * parseFloat(mixingHeight)) / 10000; // Convert to hectares
      setRequiredGreenArea(result.toFixed(2));
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-left">
        <img
          src="path-to-your-image.jpg"
          alt="Green Landscape"
          className="calculator-image"
        />
      </div>
      <div className="calculator-right">
        <h1 className="calculator-title">Calculate Your Green Impact</h1>
        <p className="calculator-description">
          Easily estimate the green land area required to offset air pollutants
          like PM2.5, PM10, NO, CO, O3, and SO2. Leverage your data to take
          actionable steps toward creating a cleaner and more sustainable
          environment.
        </p>
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="area">Area (m²):</label>
            <input
              type="number"
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area in m²"
            />
          </div>
          <div className="input-group">
            <label htmlFor="mixingHeight">Mixing Height (m):</label>
            <input
              type="number"
              id="mixingHeight"
              value={mixingHeight}
              onChange={(e) => setMixingHeight(e.target.value)}
              placeholder="Enter mixing height in m"
            />
          </div>
        </div>
        <button className="calculate-button" onClick={calculateGreenArea}>
          Calculate
        </button>
        {requiredGreenArea && (
          <div className="result">
            <h3>Required Green Area (ha):</h3>
            <p>{requiredGreenArea}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;