import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="path-to-logo.png" alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/aqi" className="nav-link">AQI</Link>
        </li>
        <li>
          <Link to="/wqi" className="nav-link">WQI</Link>
        </li>
        <li>
          <Link to="/documentation" className="nav-link">Documentation</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact</Link>
        </li>
        <li>
          <Link to="/login" className="nav-link login-link">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
