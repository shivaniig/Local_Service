import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If the form is valid, navigate to /dash
    navigate("/dash");
  };

  return (
    <div className="logmain">
      <div className="formBox">
        <h2 className="title">{isSignup ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              autoComplete="name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="button">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggleText">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="toggleLink"
            onClick={() => setIsSignup(!isSignup)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
