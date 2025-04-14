// Start.jsx
import React, { useState } from "react";
import LoginSignup from "./LoginSignup"; 
import "./Start.scss";

export default function Start() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false); 

  const handleFindServicesClick = () => {
    setShowLogin(true); 
  };

  return (
    <div className="mainn">
      <div className="app-container">
        <header className="header">
          
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

          
            <div className="floating-element floating-1"></div>
            <div className="floating-element floating-2"></div>
            <div className="floating-element floating-3"></div>
          </main>
        ) : (
          <LoginSignup isSignup={isSignup} setIsSignup={setIsSignup} />  
        )}
      </div>
    </div>
  );
}
