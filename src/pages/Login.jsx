import React from "react";
import "../App.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src="path-to-your-image.jpg"
          alt="Nature Background"
          className="login-image"
        />
      </div>
      <div className="login-right">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">
          Log in to access your dashboard and explore insights on air and water
          quality.
        </p>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;