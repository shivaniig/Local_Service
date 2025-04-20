"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaStar, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa"
import { useBooking } from "../Contexts/BookingContext"
import { useAuth } from "../Contexts/AuthContext"
//import "../styles/Dashboard.css"

const Dashboard = () => {
  const { getAllServices, getServicesByCategory } = useBooking()
  const { currentUser } = useAuth()
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [location, setLocation] = useState("Mumbai, Maharashtra")
  const [isLoading, setIsLoading] = useState(true)

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      service: "Plumbing Service",
      rating: 5,
      comment: "Excellent service! The plumber was very professional and fixed the issue quickly.",
      date: "2023-04-15",
    },
    {
      id: 2,
      name: "Priya Patel",
      service: "Electrical Repair",
      rating: 4,
      comment: "Good service, arrived on time and completed the work efficiently.",
      date: "2023-04-10",
    },
    {
      id: 3,
      name: "Amit Kumar",
      service: "Cleaning Service",
      rating: 5,
      comment: "Very thorough cleaning. My house looks spotless now!",
      date: "2023-04-05",
    },
  ]

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true)
        const allServices = getAllServices()
        setServices(allServices)
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [getAllServices])

  const filterServicesByCategory = (category) => {
    setActiveCategory(category)
    const filteredServices = getServicesByCategory(category)
    setServices(filteredServices)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Professional Services at Your Doorstep</h1>
          <p>Book trusted professionals for all your home service needs</p>
          <div className="location-selector">
            <FaMapMarkerAlt className="location-icon" />
            <span>{location}</span>
          </div>
          {!currentUser && (
            <div className="hero-cta">
              <Link to="/register" className="cta-button">
                Sign Up Now
              </Link>
              <Link to="/login" className="cta-link">
                Already have an account? Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Service Categories */}
      <section className="category-section">
        <h2>Our Services</h2>
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => filterServicesByCategory("all")}
          >
            All Services
          </button>
          <button
            className={`category-tab ${activeCategory === "home" ? "active" : ""}`}
            onClick={() => filterServicesByCategory("home")}
          >
            Home Services
          </button>
          <button
            className={`category-tab ${activeCategory === "appliance" ? "active" : ""}`}
            onClick={() => filterServicesByCategory("appliance")}
          >
            Appliance Repair
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <motion.section className="services-section" variants={containerVariants} initial="hidden" animate="visible">
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service) => (
              <motion.div key={service._id} className="service-card" variants={itemVariants}>
                <div className="service-image">
                  <img src={service.image || "/placeholder.svg?height=200&width=300"} alt={service.name} />
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-meta">
                    <div className="service-rating">
                      <FaStar className="star-icon" />
                      <span>{service.rating}</span>
                      <span className="review-count">({service.reviews} reviews)</span>
                    </div>
                    <div className="service-price">
                      <FaRupeeSign className="rupee-icon" />
                      <span>{service.price}</span>
                    </div>
                  </div>
                  <div className="service-actions">
                    <Link to={`/service/${service._id}`} className="view-button">
                      View Details
                    </Link>
                    <Link to={currentUser ? `/booking/${service._id}` : "/login"} className="book-button">
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-services">
              <p>No services found in this category.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Choose a Service</h3>
            <p>Browse through our wide range of professional services</p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Book an Appointment</h3>
            <p>Select your preferred date and time for the service</p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Get it Done</h3>
            <p>Our professional will arrive and complete the service</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < testimonial.rating ? "star-filled" : "star-empty"} />
                ))}
              </div>
              <p className="testimonial-comment">{testimonial.comment}</p>
              <div className="testimonial-user">
                <div className="testimonial-user-avatar">{testimonial.name.charAt(0)}</div>
                <div className="testimonial-user-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Book a service today and experience the best professional services in your area.</p>
          <Link to={currentUser ? "/dashboard" : "/register"} className="cta-button">
            {currentUser ? "Explore Services" : "Sign Up Now"}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
