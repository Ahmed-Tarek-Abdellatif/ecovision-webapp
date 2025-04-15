import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../App.css";

function Navbarr() {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand href="/">
          <img src="src\assets\Logo.png" alt="Logo" className="navbar-logo" />
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
      </Container>
    </Navbar>
  );
}

export default Navbarr;
