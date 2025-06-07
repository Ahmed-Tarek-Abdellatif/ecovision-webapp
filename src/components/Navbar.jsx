import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../App.css";

function Navbarr() {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <div className="navbar-brand">
          <img
            src="src/assets/Logo.png"
            alt="Ecovision Logo"
            className="navbar-logo"
          />
          <i className="fas fa-leaf text-green-500 text-2xl mr-2"></i>
          <span>Ecovision</span>
        </div>

        <Nav className="navbar-links mx-auto">
          <NavLink to="/" className="nav-link active">
            Home
          </NavLink>
          <NavLink to="/aqi" className="nav-link">
            Air Quality (AQI)
          </NavLink>
          <NavLink to="/wqi" className="nav-link">
            Water Quality (WQI)
          </NavLink>
          <NavLink
            to="https://docs.google.com/document/d/1J-6mRalaMcgo4ir5gT7oSHkPmytGK4uv0MjuuPoOEoo/edit?usp=sharing"
            className="nav-link"
          >
            Documentation
          </NavLink>
        </Nav>

        <a href="mailto:bit.x.byte@gmail.com" className="contact-btn">
          CONTACT
        </a>

        <NavLink to="/login" className="nav-link">
          Login / Register
        </NavLink>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
