import React from "react";
import "../App.css";
import Card from "../components/Card";
import FAQItem from "../components/FAQ";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-container">
      <div
        className="home-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div className="content" style={{ flex: 1 }}>
          <h1>Aiming for a Green Future</h1>
          <p>
            Join us in creating sustainable cities where clean air and pure
            water drive healthier communities. Together, we can build a future
            that thrives in harmony with nature.
          </p>
        </div>
        <div
          style={{
            flex: "0 0 320px",
            marginLeft: "40px",
            display: "flex",
            alignItems: "center",
            marginTop: "70px",
          }}
        >
          <Card
            width="300px"
            height="400px"
            position="relative"
            path="src\assets\Page 1\Header.jpg"
            alt="Header Image"
            style={{
              border: "1px solid ",
              borderRadius: "8px",
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
              marginLeft: "0",
            }}
          />
        </div>
      </div>
      <div className="services-section">
        <div className="services-header">
          <h2>Air, Water, and Green Solutions</h2>
          <p>
            Harness advanced tools to predict Air Quality Index (AQI) and Water
            Quality Index (WQI), and calculate the green land required to offset
            pollutants. Empowering you with the knowledge to create cleaner,
            healthier, and more sustainable communities.
          </p>
        </div>
        <div className="services-cards">
          <Link to="/aqi" style={{ textDecoration: "none" }}>
            <Card
              width="200px"
              height="300px"
              position="relative"
              path="src\assets\Page 1\AirCard.jpg"
              alt="Air Quality Card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
              }}
              marginTop="20px"
              marginBottom="20px"
              marginLeft="10px"
              marginRight="10px"
            />
          </Link>
          <Link to="/wqi" style={{ textDecoration: "none" }}>
            <Card
              width="200px"
              height="300px"
              position="relative"
              path="src\assets\Page 1\WaterCard.jpg"
              alt="Water Quality Card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
              }}
              marginTop="20px"
              marginBottom="20px"
              marginLeft="10px"
              marginRight="10px"
            />
          </Link>
          <Link to="/aqi" style={{ textDecoration: "none" }}>
            <Card
              width="200px"
              height="300px"
              position=""
              path="src\assets\Page 1\GreenSolutionCard.jpg"
              alt="Green Land Card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
              }}
              marginTop="20px"
              marginBottom="20px"
              marginLeft="10px"
              marginRight="10px"
            />
          </Link>
        </div>
      </div>
      <div className="faq-section">
        <h2>FAQs about AQI, WQI and Pollutants</h2>
        {[
          {
            question: "What is AQI, and why is it important?",
            answer:
              "The Air Quality Index (AQI) is a scale used to measure and communicate the quality of air in a specific area. It provides information about air pollutant levels and their potential health effects, helping people take precautions to protect their health.",
          },
          {
            question: "What are the common pollutants measured in AQI?",
            answer:
              "Common pollutants measured in AQI include particulate matter (PM2.5 and PM10), ground-level ozone (O3), carbon monoxide (CO), sulfur dioxide (SO2), and nitrogen dioxide (NO2).",
          },
          {
            question:
              "What is WQI, and how does it help monitor water quality?",
            answer:
              "The Water Quality Index (WQI) is a scale used to measure and communicate the quality of water in a specific area. It provides information about water pollutant levels and their potential health effects, helping people take precautions to protect their health.",
          },
          {
            question: "What pollutants are commonly monitored in WQI?",
            answer:
              "Common pollutants monitored in WQI include pH, dissolved oxygen (DO), biochemical oxygen demand (BOD), nitrates, phosphates, and turbidity.",
          },
          {
            question: "How do AQI and WQI affect public health?",
            answer:
              "High levels of air and water pollutants can have adverse effects on public health, including respiratory and cardiovascular diseases, waterborne illnesses, and other health issues. Monitoring AQI and WQI helps identify and mitigate these risks.",
          },
          {
            question:
              "How can green land help balance pollutants in air and water?",
            answer:
              "Green land, such as forests and parks, can help absorb pollutants from the air and water, improve air quality, and provide natural filtration for water sources. This helps create a healthier environment and supports biodiversity.",
          },
        ].map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
