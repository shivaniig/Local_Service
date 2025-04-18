import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h1 className="text-5xl font-bold text-center mb-16 text-blue-400">
          About Us & Contact
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* About Us Section */}
          <section id="about-section" className="bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-300 mb-4 border-b border-blue-500 pb-2">About Us</h2>
            <p className="text-lg text-gray-300 mb-4">
              We are a team of developers and designers committed to creating powerful, user-friendly digital experiences.
              Our goal is to simplify everyday processes using modern technologies, clean UI, and efficient systems.
            </p>
            <p className="text-gray-400">
              Through innovation and continuous improvement, we strive to deliver products that not only meet expectations but go beyond them.
            </p>
          </section>

          {/* Contact Section */}
          <section id="contact-section" className="bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-300 mb-4 border-b border-green-500 pb-2">Contact</h2>
            <ul className="text-gray-300 text-lg space-y-6 mt-6">
              <li className="flex items-center gap-4">
                <FaEnvelope className="text-blue-400" />
                <a href="mailto:info@example.com" className="hover:text-blue-400 transition">info@example.com</a>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-400" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
