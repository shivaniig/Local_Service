// Start.jsx
import React, { useState } from "react";
import LoginSignup from "./LoginSignup"; // Import the LoginSignup component
import "./Start.css";

export default function Start() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login & signup

  const handleFindServicesClick = () => {
    setShowLogin(true); // Show the login/signup form when the button is clicked
  };

  return (
    <div className="mainn">
      <div className="app-container">
        <header className="header">
          {/* Add your navbar here if needed */}
        </header>

        {!showLogin ? (
          <main className="hero-section">
            <h1>Connect with Skilled Service Providers Today</h1>
            <p>TRUSTED LOCAL PROFESSIONALS</p>
            <button
              className="find-services-button"
              onClick={handleFindServicesClick}
            >
              FIND SERVICES
            </button>

            {/* Floating Elements for Cool Effect */}
            <div className="floating-element floating-1"></div>
            <div className="floating-element floating-2"></div>
            <div className="floating-element floating-3"></div>
          </main>
        ) : (
          <LoginSignup isSignup={isSignup} setIsSignup={setIsSignup} /> // Conditionally render LoginSignup component
        )}
      </div>
    </div>
  );
}
