import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../App.css";

function Navbarr() {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

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
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/aqi" className="nav-link">
            Air Quality Index (AQI)
          </NavLink>
          <NavLink to="/wqi" className="nav-link">
            Water Quality Index (WQI)
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

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        )}
      </Container>
    </Navbar>
  );
}

export default Navbarr;
