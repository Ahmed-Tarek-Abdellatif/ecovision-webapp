import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        userName,
        email,
        password,
        phone,
      });

      alert("User created successfully!");
      // Redirect to login page after successful registration
    } catch (error) {
      alert("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div className="home-container">
      <div className="register-page">
        <div className="register-left">
          <img
            src="path-to-your-image.jpg"
            alt="Nature Background"
            className="register-image"
          />
        </div>
        <div className="register-right">
          <h1 className="register-title">Create an Account</h1>
          <p className="register-subtitle">
            Join us to explore insights on air and water quality.
          </p>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
          <p className="register-footer">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
