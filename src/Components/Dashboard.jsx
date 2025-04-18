import React from "react";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaCommentAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Dashboard.css";
import BgImage from "../assets/Bg.png";

const Dashboard = () => {
  const [location, setLocation] = useState("Loading...");
  const [manualLocation, setManualLocation] = useState("");
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  // Sample services data
  const services = [
    {
      name: "Plumbing",
      description: "Fix leaks, installations & repairs",
      icon: "💧",
      color: "bg-blue-500",
      rating: 4.8,
      bookings: 1240,
    },
    {
      name: "Electrician",
      description: "Wiring, repairs & installations",
      icon: "⚡",
      color: "bg-yellow-500",
      rating: 4.7,
      bookings: 1560,
    },
    {
      name: "Cleaning",
      description: "Home & office deep cleaning",
      icon: "✨",
      color: "bg-green-500",
      rating: 4.9,
      bookings: 2150,
    },
    {
      name: "AC Repair",
      description: "Service, repair & installation",
      icon: "❄️",
      color: "bg-cyan-500",
      rating: 4.6,
      bookings: 980,
    },
    {
      name: "Carpentry",
      description: "Furniture repair & custom work",
      icon: "🔨",
      color: "bg-amber-600",
      rating: 4.5,
      bookings: 760,
    },
    {
      name: "Painting",
      description: "Interior & exterior painting",
      icon: "🎨",
      color: "bg-purple-500",
      rating: 4.7,
      bookings: 890,
    },
    {
      name: "Pest Control",
      description: "Eliminate all types of pests",
      icon: "🐜",
      color: "bg-red-500",
      rating: 4.8,
      bookings: 1120,
    },
    {
      name: "Laundry",
      description: "Wash, dry & premium care",
      icon: "👕",
      color: "bg-indigo-500",
      rating: 4.6,
      bookings: 1340,
    },
  ];

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "/placeholder.svg?height=50&width=50",
      service: "Plumbing Services",
      comment:
        "Excellent service! The plumber was professional and fixed the issue quickly.",
      rating: 5,
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=50&width=50",
      service: "Cleaning Services",
      comment: "Very thorough cleaning. My house looks spotless now!",
      rating: 5,
    },
    {
      id: 3,
      name: "Amit Kumar",
      avatar: "/placeholder.svg?height=50&width=50",
      service: "Electrical Repair",
      comment:
        "Fixed my electrical issues promptly. Great service at a reasonable price.",
      rating: 4,
    },
  ];
  const handleSearch = () => {
    const foundService = services.find(
      (service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) // case-insensitive search
    );
    if (foundService) {
      setSelectedService(foundService);
    } else {
      setSelectedService(null);
      setMessage("Sorry, no service found matching your search.");
    }
  };

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        console.log("Razorpay SDK loaded successfully.");
        resolve(true);
      };

      script.onerror = (error) => {
        console.error("Error loading Razorpay SDK:", error);
        resolve(false); // You could use reject() to handle the error case differently
      };

      document.body.appendChild(script);
    });

  const showRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection or try again later."
      );
      return;
    }

    const data = await fetch(
      "https://rb1lf190-8080.inc1.devtunnels.ms/razorpay",
      {
        method: "POST",
      }
    ).then((t) => t.json());

    console.log(data);

    const options = {
      key: "rzp_test_iIWN1rYDwiX3Yo",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Course Fee",
      description: "Thank you for nothing. Please give us some money",
      image: "http://localhost:2003/logo.svg",
      handler: (response) => {
        alert("Transaction successful");
      },
      prefill: {
        name: "ainwik",
        email: "ceo@ainwik.in",
        phone_number: "9899876758",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleReviewService = (service) => {
    setSelectedService(service);
    setShowReviewModal(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log({
      service: selectedService,
      date: bookingDate,
      time: bookingTime,
      paymentMethod,
      location,
    });

    // Reset form and close modal
    setBookingDate("");
    setBookingTime("");
    setPaymentMethod("cash");
    setShowBookingModal(false);

    // Show confirmation message
    alert(
      `Booking confirmed for ${selectedService.name} on ${bookingDate} at ${bookingTime}`
    );
  };
  useEffect(() => {
    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Call the reverse geocoding API with the coordinates
          fetchAddress(latitude, longitude);
        },
        (error) => {
          // If there is an error in getting the geolocation, allow manual entry
          setUseManualLocation(true);
        }
      );
    } else {
      setUseManualLocation(true);
    }
  }, []);
  const handleSaveLocation = () => {
    if (manualLocation) {
      setLocation(manualLocation);
      setUseManualLocation(false);
    }
  };

  const fetchAddress = async (lat, lon) => {
    // Use the OpenCage Geocoding API to fetch the address
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=YOUR_API_KEY`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      // Get the formatted address
      const formattedAddress = data.results[0].formatted;
      setLocation(formattedAddress); // Update the location with the address
    } else {
      setUseManualLocation(true);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically send the review data to your backend
    console.log({
      service: selectedService,
      rating,
      comment: reviewComment,
    });

    // Reset form and close modal
    setRating(0);
    setReviewComment("");
    setShowReviewModal(false);

    // Show confirmation message
    alert(`Thank you for your ${rating}-star review!`);
  };

  return (
    <div className="dashh">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">Fixzy</h1>
                <div className="ml-8 hidden md:flex space-x-6">
                  <a href="#" className="hover:text-blue-200 transition-colors">
                    Home
                  </a>
                  <a href="#services" className="hover:text-blue-200 transition-colors">
                    Services
                  </a>
                  <a href="/about" className="hover:text-blue-200 transition-colors">
                    About
                  </a>
                  <a href="about" className="hover:text-blue-200 transition-colors">
                    Contact
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-black border border-white rounded-full px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm">
                  <h1 className="mr-2 font-medium text-black">
                    Current Location:
                  </h1>
                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                  <span className="text-black">{location}</span>
                </div>

                {useManualLocation && (
                  <div className="flex flex-col items-start ml-4 ">
                    <input
                      type="text"
                      placeholder="Enter address manually"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      className="px-4 py-2 text-black bg-white rounded-lg border border-white bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white-300"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="mt-2 px-6 py-2 bg-black hover:bg-black-600 text-white rounded-lg transition-colors"
                    >
                      Save Location
                    </button>
                  </div>
                )}
                <div className="relative">
                  <button
                    className="flex items-center justify-center bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <FaUser className="text-blue-600 text-lg" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        Profile
                      </a>
                      <a
                        href="/bookings"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        My Bookings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        Settings
                      </a>
                      <a
                        href="/"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        Logout
                      </a>
                    </div>
                  )}
                </div>

                <button
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <a href="#" className="block py-2 text-blue-600">
                Home
              </a>
              <a href="#" className="block py-2 text-gray-800">
                Services
              </a>
              <a href="/bookings" className="block py-2 text-gray-800">
                Bookings
              </a>
              <a href="#" className="block py-2 text-gray-800">
                About
              </a>
              <a href="#" className="block py-2 text-gray-800">
                Contact
              </a>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Professional Services at Your Doorstep
            </motion.h1>

            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book trusted professionals for all your home service needs
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex w-full md:w-[500px] border border-white rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="flex-1 px-4 py-3 text-black placeholder-black bg-white focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 font-medium text-white hover:from-blue-600 hover:to-purple-600 text-white px-5 py-3 font-semibold transition-colors"
                >
                  Find
                </button>
              </div>
            </motion.div>

            {/* Display Service Card if found */}
            {selectedService && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                <div
                  className={`w-16 h-16 rounded-full ${selectedService.color} text-white flex items-center justify-center`}
                >
                  <span className="text-3xl">{selectedService.icon}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-gray-800">
                  {selectedService.name}
                </h3>
                <p className="text-gray-600">{selectedService.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Rating: {selectedService.rating} | Bookings:{" "}
                    {selectedService.bookings}
                  </p>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleBookService(selectedService)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )}

            {/* Display message if no service found */}
            {message && (
              <div className="mt-4 text-red-500 font-semibold text-lg">
                {message} {/* Show error message */}
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto" id="services">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Our Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-48 object-cover"
          /> */}
                  <div className="p-6">
                    {/* Service Icon */}
                    <div
                      className={`text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-full text-white ${service.color}`}
                    >
                      {service.icon}
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {service.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {service.price}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.floor(service.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 ml-2">
                        {service.rating} ({service.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        onClick={() => handleBookService(service)}
                      >
                        Book Now
                      </button>
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                        onClick={() => handleReviewService(service)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              What Our Customers Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.service}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Modal */}
        {showBookingModal && selectedService && (
          <div className="fixed inset-0 bg-blue bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Book {selectedService.name}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowBookingModal(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitBooking}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Service
                    </label>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {selectedService.name} - {selectedService.price}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaCalendarAlt className="text-gray-500" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaClock className="text-gray-500" />
                      </div>
                      <input
                        type="time"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="sr-only"
                        />
                        <FaMoneyBillWave
                          className={`mr-2 ${
                            paymentMethod === "cash"
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            paymentMethod === "cash"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }
                        >
                          Cash on Delivery
                        </span>
                      </label>

                      <label
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          paymentMethod === "online"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          className="sr-only"
                        />
                        <FaCreditCard
                          className={`mr-2 ${
                            paymentMethod === "online"
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            paymentMethod === "online"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }
                        >
                          Online Payment
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowBookingModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={showRazorpay}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Review {selectedService.name}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowReviewModal(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl focus:outline-none"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <FaStar
                            className={
                              (hoverRating || rating) >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Your Review
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-500">
                        <FaCommentAlt />
                      </div>
                      <textarea
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Share your experience with this service..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowReviewModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={!rating}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div id="about-section">
                <h3 className="text-xl font-bold mb-4">Fixzy</h3>
                <p className="text-gray-400">
                  Your trusted partner for all home service needs.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dash"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact-section"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Plumbing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Electrical
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Cleaning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Painting
                    </a>
                  </li>
                </ul>
              </div>

              <div id="contact-section">
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <address className="text-gray-400 not-italic">
                  123 Service Road
                  <br />
                  Mumbai, Maharashtra
                  <br />
                  India - 400001
                </address>
                <p className="text-gray-400 mt-2">
                  Email: info@fixzy.com
                  <br />
                  Phone: +91 9876543210
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Fixzy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
