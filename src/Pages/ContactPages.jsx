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

const ContactPages = () => {
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-600 mt-2">We'd love to hear from you. Get in touch!</p>
      </header>

      <main className="grid md:grid-cols-2 gap-10">
        {/* Left Info Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Get In Touch</h2>
          <p className="text-gray-600">Have questions about our services? Contact us via:</p>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="text-xl text-blue-600"><FaPhone /></div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-600">+91 9876543210</p>
                <p className="text-gray-600">+91 9876543211</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="text-xl text-blue-600"><FaEnvelope /></div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600">info@fixzy.com</p>
                <p className="text-gray-600">support@fixzy.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="text-xl text-blue-600"><FaMapMarkerAlt /></div>
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">123 Service Road, Andheri East</p>
                <p className="text-gray-600">Mumbai, Maharashtra 400069</p>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Follow Us</h3>
            <div className="flex gap-4 text-xl text-blue-500">
              <a href="#" className="hover:text-blue-700"><FaFacebook /></a>
              <a href="#" className="hover:text-blue-700"><FaTwitter /></a>
              <a href="#" className="hover:text-blue-700"><FaInstagram /></a>
            </div>
          </div>
        </section>

        {/* Right Contact Form */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>

      {/* Map Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Our Location</h2>
        <div className="w-full h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650721986071!5m2!1sen!2sin"
            width="100%"
            height="100%"
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

export default ContactPages
