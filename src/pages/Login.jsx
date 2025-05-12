import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sending login request to the backend
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // On successful login, save tokens to localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Set Authorization header globally for axios
      axios.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

      alert("Login successful!");

      // Redirect to dashboard or home page after successful login
      window.location.href = "/aqi"; 
    } catch (error) {
      // Handle errors from the backend (like invalid credentials)
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
    <div className="home-container">
      <div className="login-page">
        <div className="login-left">
          <img
            src="path-to-your-image.jpg"
            alt="Login Background"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <h1 className="login-title">Log In to Your Account</h1>
          <p className="login-subtitle">
            Welcome back! Please login to continue.
          </p>
          <form className="login-form" onSubmit={handleLogin}>
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
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          <p className="login-footer">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;