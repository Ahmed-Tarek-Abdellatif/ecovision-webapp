import React from "react";
import { NavLink } from "react-router-dom";  // Use NavLink for navigation
import { Navbar, Nav, Container } from "react-bootstrap";  // Use Bootstrap Navbar for styling
import "../App.css";

function Navbarr() {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand href="/">
          <img src="src/assets/Logo.png" alt="Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Nav className="mx-auto">
          <NavLink to="/aqi" className="nav-link">
            AQI
          </NavLink>
          <NavLink to="/wqi" className="nav-link">
            WQI
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
            Login
          </NavLink>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
