import { createContext, useState, useContext } from "react"
import { toast } from "react-toastify"

// Create the BookingContext
const BookingContext = createContext()

// Sample data for demonstration - this would typically come from an API
const sampleBookings = [
  {
    _id: "b001",
    service: {
      name: "Plumbing Service",
      icon: "🔧",
      color: "bg-blue-500",
      price: 799,
    },
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: "10:00 AM - 12:00 PM",
    address: "123 Main Street, Mumbai",
    status: "confirmed",
    isPaid: true,
    paymentMethod: "online",
  },
  {
    _id: "b002",
    service: {
      name: "Electrical Repair",
      icon: "⚡",
      color: "bg-yellow-500",
      price: 599,
    },
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    time: "2:00 PM - 4:00 PM",
    address: "456 Park Avenue, Mumbai",
    status: "pending",
    isPaid: false,
  },
  {
    _id: "b003",
    service: {
      name: "Home Cleaning",
      icon: "🧹",
      color: "bg-green-500",
      price: 499,
    },
    date: new Date(Date.now() - 86400000), // Yesterday
    time: "9:00 AM - 1:00 PM",
    address: "789 Lake View, Mumbai",
    status: "completed",
    isPaid: true,
    paymentMethod: "cash",
    review: {
      rating: 4,
      comment: "Great service, very thorough cleaning!",
    },
  },
  {
    _id: "b004",
    service: {
      name: "Furniture Assembly",
      icon: "🪑",
      color: "bg-purple-500",
      price: 999,
    },
    date: new Date(Date.now() - 172800000), // Two days ago
    time: "11:00 AM - 2:00 PM",
    address: "101 Heights, Mumbai",
    status: "cancelled",
    isPaid: false,
  },
]

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null)
  const [bookings, setBookings] = useState(sampleBookings)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate API calls with setTimeout
  const createBooking = async (bookingData) => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBooking = {
            _id: `b${Math.floor(Math.random() * 10000)}`,
            ...bookingData,
            status: "pending",
            isPaid: bookingData.paymentMethod === "online",
            createdAt: new Date(),
          }

          setBookings((prev) => [...prev, newBooking])
          setCurrentBooking(newBooking)

          toast.success("Booking created successfully")
          resolve({ success: true, booking: newBooking })
          setIsLoading(false)
        }, 1000)
      })
    } catch (error) {
      toast.error("Failed to create booking")
      setIsLoading(false)
      return { success: false, message: "Failed to create booking" }
    }
  }

  const getUserBookings = async () => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, bookings })
          setIsLoading(false)
        }, 1000)
      })
    } catch (error) {
      toast.error("Failed to fetch bookings")
      setIsLoading(false)
      return { success: false, message: "Failed to fetch bookings" }
    }
  }

  const getBookingById = async (bookingId) => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const booking = bookings.find((b) => b._id === bookingId)
          if (booking) {
            setCurrentBooking(booking)
            resolve({ success: true, booking })
          } else {
            toast.error("Booking not found")
            resolve({ success: false, message: "Booking not found" })
          }
          setIsLoading(false)
        }, 500)
      })
    } catch (error) {
      toast.error("Failed to fetch booking")
      setIsLoading(false)
      return { success: false, message: "Failed to fetch booking" }
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedBookings = bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking,
          )

          setBookings(updatedBookings)
          const updatedBooking = updatedBookings.find((b) => b._id === bookingId)

          if (currentBooking && currentBooking._id === bookingId) {
            setCurrentBooking(updatedBooking)
          }

          toast.success(`Booking ${status} successfully`)
          resolve({ success: true, booking: updatedBooking })
          setIsLoading(false)
        }, 800)
      })
    } catch (error) {
      toast.error(`Failed to ${status} booking`)
      setIsLoading(false)
      return { success: false, message: `Failed to ${status} booking` }
    }
  }

  const processPayment = async (bookingId, paymentDetails) => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedBookings = bookings.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  isPaid: true,
                  paymentMethod: paymentDetails.method,
                  paymentDate: new Date(),
                }
              : booking,
          )

          setBookings(updatedBookings)
          const updatedBooking = updatedBookings.find((b) => b._id === bookingId)

          if (currentBooking && currentBooking._id === bookingId) {
            setCurrentBooking(updatedBooking)
          }

          toast.success("Payment processed successfully")
          resolve({ success: true, payment: { id: `pay_${Math.random().toString(36).substring(2, 10)}` } })
          setIsLoading(false)
        }, 1200)
      })
    } catch (error) {
      toast.error("Payment processing failed")
      setIsLoading(false)
      return { success: false, message: "Payment processing failed" }
    }
  }

  const addReview = async (bookingId, reviewData) => {
    try {
      setIsLoading(true)

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const review = {
            ...reviewData,
            createdAt: new Date(),
          }

          const updatedBookings = bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, review } : booking,
          )

          setBookings(updatedBookings)
          const updatedBooking = updatedBookings.find((b) => b._id === bookingId)

          if (currentBooking && currentBooking._id === bookingId) {
            setCurrentBooking(updatedBooking)
          }

          toast.success("Review submitted successfully")
          resolve({ success: true, review })
          setIsLoading(false)
        }, 800)
      })
    } catch (error) {
      toast.error("Failed to submit review")
      setIsLoading(false)
      return { success: false, message: "Failed to submit review" }
    }
  }

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        bookings,
        isLoading,
        createBooking,
        getUserBookings,
        getBookingById,
        updateBookingStatus,
        processPayment,
        addReview,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

export default BookingContext
