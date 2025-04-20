"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "./AuthContext"
import { API_URL } from "../Config/Constants"

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/api/services`)
        setServices(response.data.services)
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Fetch user bookings when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserBookings()
    } else {
      setBookings([])
    }
  }, [currentUser])

  // Fetch user bookings
  const fetchUserBookings = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/bookings/user`)
      setBookings(response.data.bookings)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true)

      const response = await axios.post(`${API_URL}/api/bookings`, bookingData)

      // Add the new booking to the state
      setBookings((prev) => [...prev, response.data.booking])

      toast.success("Booking created successfully")
      return response.data.booking
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create booking"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get booking by ID
  const getBookingById = async (bookingId) => {
    try {
      setLoading(true)

      const response = await axios.get(`${API_URL}/api/bookings/${bookingId}`)
      return response.data.booking
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch booking"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true)

      const response = await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, { status })

      // Update the booking in the state
      setBookings((prev) => prev.map((booking) => (booking._id === bookingId ? response.data.booking : booking)))

      toast.success(`Booking ${status} successfully`)
      return response.data.booking
    } catch (err) {
      const message = err.response?.data?.message || `Failed to update booking status`
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    return updateBookingStatus(bookingId, "cancelled")
  }

  // Process payment with Stripe
  const processPayment = async (bookingId, paymentMethodId) => {
    try {
      setLoading(true)

      const response = await axios.post(`${API_URL}/api/payments/${bookingId}`, {
        paymentMethodId,
      })

      // Update the booking in the state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                isPaid: true,
                paymentMethod: "online",
                paymentDate: new Date(),
              }
            : booking,
        ),
      )

      toast.success("Payment processed successfully")
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || "Payment processing failed"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add review to a booking
  const addReview = async (bookingId, reviewData) => {
    try {
      setLoading(true)

      const response = await axios.post(`${API_URL}/api/bookings/${bookingId}/review`, reviewData)

      // Update the booking in the state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                review: response.data.review,
              }
            : booking,
        ),
      )

      toast.success("Review submitted successfully")
      return response.data.review
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit review"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get all services
  const getAllServices = () => {
    return services
  }

  // Get service by ID
  const getServiceById = async (serviceId) => {
    try {
      // Check if we already have the service in state
      const existingService = services.find((s) => s._id === serviceId)
      if (existingService) return existingService

      // Otherwise fetch it
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/services/${serviceId}`)
      return response.data.service
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch service"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get services by category
  const getServicesByCategory = (category) => {
    if (category === "all") return services
    return services.filter((service) => service.category === category)
  }

  // Get user bookings
  const getUserBookings = () => {
    return bookings
  }

  const value = {
    bookings,
    services,
    loading,
    error,
    createBooking,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    processPayment,
    addReview,
    getAllServices,
    getServiceById,
    getServicesByCategory,
    getUserBookings,
    fetchUserBookings,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export default BookingContext
