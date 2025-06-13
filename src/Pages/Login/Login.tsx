import React, { useState } from "react";
import axios from "axios";
import Card from "../../Public Components/Card";
import "../../App.css";
import { handleLogin } from "./Functions/Functions";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  return (
    <div className="home-container">
      <div className="login-page">
        <div className="login-left">
          <Card
            width="350px"
            height="450px"
            position="relative"
            path="src\assets\Login.png"
            alt="Header Image"
            style={{
              border: "1px solid ",
              borderRadius: "8px",
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
              marginLeft: "0",
            }}
          />
        </div>
        <div className="login-right">
          <h1 className="login-title">Log In to Your Account</h1>
          <p className="login-subtitle">
            Welcome back! Please login to continue.
          </p>
          <form className="login-form" onSubmit={(event) => handleLogin({event, email,password})}>
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