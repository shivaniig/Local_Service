"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  MapPin,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Star,
  Clock,
  Shield,
  MessageSquare,
  CheckCircle,
  Calendar,
} from "lucide-react"
import axios from "axios"
import { useAuth } from "../Contexts/AuthContext"
import { useBooking } from "../Contexts/BookingContext"

// Sample data for services (fallback if API fails)
const sampleServices = [
  {
    _id: "1",
    name: "Plumbing",
    description: "Fix leaks, installations & repairs",
    icon: "💧",
    color: "bg-blue-500",
    rating: 4.8,
    reviews: 1240,
    price: 499,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "2",
    name: "Electrician",
    description: "Wiring, repairs & installations",
    icon: "⚡",
    color: "bg-yellow-500",
    rating: 4.7,
    reviews: 1560,
    price: 599,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "3",
    name: "Cleaning",
    description: "Home & office deep cleaning",
    icon: "✨",
    color: "bg-green-500",
    rating: 4.9,
    reviews: 2150,
    price: 799,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "4",
    name: "AC Repair",
    description: "Service, repair & installation",
    icon: "❄️",
    color: "bg-cyan-500",
    rating: 4.6,
    reviews: 980,
    price: 699,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "5",
    name: "Carpentry",
    description: "Furniture repair & custom work",
    icon: "🔨",
    color: "bg-amber-600",
    rating: 4.5,
    reviews: 760,
    price: 899,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "6",
    name: "Painting",
    description: "Interior & exterior painting",
    icon: "🎨",
    color: "bg-purple-500",
    rating: 4.7,
    reviews: 890,
    price: 1299,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "7",
    name: "Pest Control",
    description: "Eliminate all types of pests",
    icon: "🐜",
    color: "bg-red-500",
    rating: 4.8,
    reviews: 1120,
    price: 999,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "8",
    name: "Laundry",
    description: "Wash, dry & premium care",
    icon: "👕",
    color: "bg-indigo-500",
    rating: 4.6,
    reviews: 1340,
    price: 599,
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    service: "Cleaning",
    comment: "The cleaning service was exceptional! My home has never looked better.",
    rating: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Rahul Patel",
    service: "Electrician",
    comment: "Fixed my electrical issues quickly and professionally. Highly recommend!",
    rating: 4,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Ananya Singh",
    service: "Plumbing",
    comment: "Prompt service and reasonable pricing. Will definitely use again!",
    rating: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function Dashboard() {
  // State variables
  const [locationName, setLocationName] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [services, setServices] = useState(sampleServices)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Get auth context
  const { currentUser } = useAuth()

  // Get booking context
  const { getAllServices, getServicesByCategory } = useBooking()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load services from API or context
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true)

        // Try to get services from context first
        const contextServices = getAllServices()

        if (contextServices && contextServices.length > 0) {
          setServices(contextServices)
        } else {
          // Fallback to API call if context doesn't have services
          try {
            const response = await axios.get("http://localhost:8080/api/services")
            if (response.data && response.data.services && response.data.services.length > 0) {
              setServices(response.data.services)
            }
          } catch (error) {
            console.error("API call failed, using sample data:", error)
            // Keep using sample data if API fails
          }
        }
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [getAllServices])
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Reverse geocoding using OpenStreetMap's Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            const data = await response.json()
            if (data && data.address) {
              const { city, town, village, state, country } = data.address
              setLocationName(city || town || village || state || country || "")
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }, [])

  // Filter services by category
  const filterServicesByCategory = (category) => {
    setActiveCategory(category)

    if (category === "all") {
      // Try to get all services from context
      const allServices = getAllServices()
      if (allServices && allServices.length > 0) {
        setServices(allServices)
      } else {
        // Fallback to sample data
        setServices(sampleServices)
      }
      return
    }

    // Try to get filtered services from context
    const filteredServices = getServicesByCategory(category)
    if (filteredServices && filteredServices.length > 0) {
      setServices(filteredServices)
    } else {
      // Fallback to filtering sample data
      const filtered = sampleServices.filter((service) => service.category === category || !service.category)
      setServices(filtered)
    }
  }

  // Function to handle booking a service
  const handleBookService = (service) => {
    setSelectedService(service)
    setShowBookingModal(true)

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setBookingDate(tomorrow.toISOString().split("T")[0])
  }

  // Function to handle reviewing a service
  const handleReviewService = (service) => {
    setSelectedService(service)
    setShowReviewModal(true)
  }

  // Function to submit a booking
  const handleSubmitBooking = () => {
    // In a real app, you would send this data to your backend
    console.log("Booking submitted:", {
      service: selectedService,
      date: bookingDate,
      time: bookingTime,
      paymentMethod,
      location,
    })

    // Reset form and close modal
    setBookingDate("")
    setBookingTime("")
    setPaymentMethod("online")
    setShowBookingModal(false)

    // Show success message
    alert("Booking successful! You will receive a confirmation shortly.")
  }

  // Function to submit a review
  const handleSubmitReview = () => {
    // In a real app, you would send this data to your backend
    console.log("Review submitted:", {
      serviceId: selectedService._id,
      rating: reviewRating,
      comment: reviewText,
    })

    // Reset form and close modal
    setReviewText("")
    setReviewRating(5)
    setShowReviewModal(false)

    // Show success message
    alert("Thank you for your review!")
  }


  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-3 text-lg text-gray-700">Loading services...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <header
        className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white">
              F
            </div>
            <h1 className="text-xl font-bold text-gray-900">Fixzy</h1>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                className="w-[300px] rounded-full border-none bg-slate-100 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-gray-700">
        <MapPin className="mr-1 h-4 w-4 text-blue-500" />
        {locationName ? (
          <span>{locationName}</span>
        ) : (
          <input
            type="text"
            placeholder="Enter location"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="h-7 w-32 border-none bg-transparent p-0 focus:outline-none focus:ring-0"
          />
        )}
        <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
      </div>
      </div>

            <button className="relative rounded-full p-2 text-gray-700 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="relative">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm transition-transform hover:scale-105"
                onClick={() => document.getElementById("userMenu").classList.toggle("hidden")}
              >
                {currentUser?.name?.charAt(0) || "U"}
              </button>
              <div
                id="userMenu"
                className="absolute right-0 mt-2 hidden w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email || "user@example.com"}</p>
                </div>
                <Link to="/lay/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/lay/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Bookings
                </Link>
                <Link to="/lay/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <Link to="/" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            </div>
          </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-16 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              Your Home Services Expert
            </h1>
            <p className="mb-8 text-lg text-blue-100 md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Book trusted professionals for all your home service needs in minutes
            </p>
            <div className="relative mx-auto mb-4 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="What service do you need today?"
                className="h-14 w-full rounded-full border-none bg-white/95 pl-12 pr-4 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-1 top-1/2 h-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 font-medium text-white hover:from-blue-600 hover:to-purple-600">
                Search
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450">
              <div className="flex items-center">
                <Shield className="mr-1 h-4 w-4" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4" />
                <span>4.8/5 Average Rating</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>Same-day Service</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => filterServicesByCategory("all")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-gray-700 hover:bg-slate-200"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => filterServicesByCategory("home")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === "home" ? "bg-blue-600 text-white" : "bg-slate-100 text-gray-700 hover:bg-slate-200"
              }`}
            >
              Home Services
            </button>
            <button
              onClick={() => filterServicesByCategory("appliance")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === "appliance"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-gray-700 hover:bg-slate-200"
              }`}
            >
              Appliance Repair
            </button>
            <button
              onClick={() => filterServicesByCategory("cleaning")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === "cleaning"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-gray-700 hover:bg-slate-200"
              }`}
            >
              Cleaning
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Popular Services</h2>
            <button className="hidden items-center text-blue-600 hover:text-blue-700 md:flex">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-lg border-none bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-24 items-center justify-between p-6 ${service.color || "bg-blue-500"} text-white`}
                >
                  <div>
                    <span className="text-3xl">{service.icon || "🔧"}</span>
                  </div>
                  <div className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                    {service.rating} ★
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="mb-4 text-gray-600">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{service.reviews || 0}+ bookings</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBookService(service)}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-slate-200"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => handleReviewService(service)}
                        className="rounded-full bg-white border border-slate-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-slate-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Services
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 md:text-3xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Choose a Service</h3>
              <p className="text-gray-600">Browse through our wide range of professional services</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Book an Appointment</h3>
              <p className="text-gray-600">Select your preferred date and time for the service</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get it Done</h3>
              <p className="text-gray-600">Our professional will arrive and complete the service</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">What Our Customers Say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg border-none bg-white p-6 shadow-md">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="mb-4 text-gray-700">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service} Service</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-lg md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Become a Service Provider</h2>
            <p className="mb-8 text-slate-300">
              Join our network of professionals and grow your business. Get more customers and manage your work
              efficiently.
            </p>
            <button className="rounded-full bg-white px-8 py-3 text-lg font-medium text-slate-900 hover:bg-gray-100">
              Apply Now
            </button>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Book {selectedService.name}</h2>
            <div className="mb-4 flex items-center">
              <div
                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg ${selectedService.color || "bg-blue-500"} text-white`}
              >
                <span>{selectedService.icon || "🔧"}</span>
              </div>
              <div>
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-gray-500">₹{selectedService.price}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Select Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Select Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mr-2"
                    />
                    Online Payment
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                disabled={!bookingDate || !bookingTime}
              >
                Book Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Review {selectedService.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service..."
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                disabled={!reviewText}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
