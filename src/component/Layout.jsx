"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { FaHome, FaCalendarAlt, FaSignOutAlt, FaUserShield, FaBars, FaTimes, FaMapMarkerAlt } from "react-icons/fa"
import { useAuth } from "../Contexts/AuthContext"
//import "../styles/Layout.css"

const Layout = () => {
  const { currentUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const pathLocation = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [location, setLocation] = useState("Mumbai, Maharashtra")

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="layout-container">
      <header className="header">
        <div className="logo-container">
          <Link to="/dashboard" className="logo">
            <div className="logo-icon">F</div>
            <span className="logo-text">Fixzy</span>
          </Link>
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link
                to="/dashboard"
                className={pathLocation.pathname === "/dashboard" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={pathLocation.pathname === "/about" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={pathLocation.pathname === "/contact" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-right">
          <div className="location-display">
            <FaMapMarkerAlt />
            <span>{location}</span>
          </div>

          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <div className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
              </div>
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">
                  <FaHome /> Dashboard
                </Link>
                <Link to="/bookings" className="dropdown-item">
                  <FaCalendarAlt /> My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item">
                    <FaUserShield /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Fixzy</h3>
            <p>Your trusted local service provider for all home and office needs.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/dashboard">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              {currentUser && (
                <li>
                  <Link to="/bookings">My Bookings</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@fixzy.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Address: 123 Service Road, Mumbai, Maharashtra</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fixzy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
