import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import { handleRegister } from './Functions/Functions';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  return (
    <div className="home-container">
      <div className="register-page">
        <div className="register-left">
          <img src="path-to-your-image.jpg" alt="Nature Background" className="register-image" />
        </div>
        <div className="register-right">
          <h1 className="register-title">Create an Account</h1>
          <p className="register-subtitle">Join us to explore insights on air and water quality.</p>
          <form
            className="register-form"
            onSubmit={(event) => handleRegister({ event, username, email, password, phone })}
          >
            <div className="input-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
