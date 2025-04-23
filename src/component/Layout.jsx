"use client"

import { useState, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { FaHome, FaCalendarAlt, FaSignOutAlt, FaUserShield, FaBars, FaTimes, FaMapMarkerAlt } from "react-icons/fa"
import { useAuth } from "../Contexts/AuthContext"

const Layout = () => {
  const { currentUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const pathLocation = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [location, setLocation] = useState("Mumbai, Maharashtra")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header
        className={`sticky top-0 z-50 w-full ${scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"} transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* <div className="flex items-center">
            <Link to="/lay/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                F
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Fixzy
              </span>
            </Link>
          </div> */}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/lay/dashboard"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathLocation.pathname === "/lay/dashboard" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathLocation.pathname === "/about" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathLocation.pathname === "/contact" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav> */}

          <div className="hidden md:flex items-right space-x-6">
            {/* Location */}
            {/* <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-1 text-blue-500" />
              <span>{location}</span>
            </div> */}

{/*           
            {currentUser ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                </div>

              
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-right">
                  <div className="py-1">
                    <Link
                      to="/lay/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaHome className="mr-2 text-gray-500" /> Dashboard
                    </Link>
                    <Link
                      to="/bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaCalendarAlt className="mr-2 text-gray-500" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaUserShield className="mr-2 text-gray-500" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-400 rounded-md hover:from-blue-600 hover:to-teal-500 transition-colors shadow-md"
                >
                  Register
                </Link>
              </div>
            )} */}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/lay/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathLocation.pathname === "/lay/dashboard"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathLocation.pathname === "/about" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathLocation.pathname === "/contact" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              {currentUser ? (
                <>
                  <div className="border-t border-gray-200 my-3"></div>
                  <Link
                    to="/bookings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    <FaCalendarAlt className="inline mr-2" /> My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={closeMobileMenu}
                    >
                      <FaUserShield className="inline mr-2" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      closeMobileMenu()
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-gray-200 mt-3 pt-3 flex space-x-3 px-3">
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-400 rounded-md hover:from-blue-600 hover:to-teal-500 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fixzy</h3>
              <p className="text-gray-300 mb-4">Your trusted local service provider for all home and office needs.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/lay/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/lay/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/lay/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                {currentUser && (
                  <li>
                    <Link to="/bookings" className="text-gray-300 hover:text-white transition-colors">
                      My Bookings
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic text-gray-300 space-y-2">
                <p>Email: info@fixzy.com</p>
                <p>Phone: +91 9876543210</p>
                <p>Address: 123 Service Road, Mumbai, Maharashtra</p>
              </address>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-900 py-4">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Fixzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
