import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../App.css"; 

function Navbarr() {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="src\assets\Logo.png" // Replace with your logo path
            alt="Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {/* Navigation Links */}
        <Nav className="mx-auto">
          <NavLink to="/about" className="nav-link">ABOUT</NavLink>
          <NavLink to="/aqi" className="nav-link">AQI</NavLink>
          <NavLink to="/wqi" className="nav-link">WQI</NavLink>
          <NavLink to="/guide" className="nav-link">Guide</NavLink>
        </Nav>

        {/* Contact Button */}
        <NavLink to="/contact" className="contact-btn">CONTACT</NavLink>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
