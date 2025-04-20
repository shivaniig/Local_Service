"use client"

import { useState } from "react"
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa"
import toast from "react-hot-toast"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    setTimeout(() => {
      toast.success("Message sent successfully!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch!</p>
      </header>

      <main className="contact-container">
        {/* Left Info Section */}
        <section className="contact-info">
          <h2>Get In Touch</h2>
          <p>Have questions about our services? Contact us via:</p>

          <div className="contact-methods">
            {/* Phone */}
            <div className="contact-method">
              <div className="contact-icon"><FaPhone /></div>
              <div>
                <h3>Phone</h3>
                <p>+91 9876543210</p>
                <p>+91 9876543211</p>
              </div>
            </div>

            {/* Email */}
            <div className="contact-method">
              <div className="contact-icon"><FaEnvelope /></div>
              <div>
                <h3>Email</h3>
                <p>info@fixzy.com</p>
                <p>support@fixzy.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="contact-method">
              <div className="contact-icon"><FaMapMarkerAlt /></div>
              <div>
                <h3>Address</h3>
                <p>123 Service Road, Andheri East</p>
                <p>Mumbai, Maharashtra 400069</p>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
            </div>
          </div>
        </section>

        {/* Right Contact Form */}
        <section className="contact-form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>

      {/* Map Section */}
      <section className="map-container">
        <h2>Our Location</h2>
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650721986071!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
