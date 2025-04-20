"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaStar,
} from "react-icons/fa"
import { useBooking } from "../Contexts/BookingContext"
import toast from "react-hot-toast"
//import "../styles/MyBookings.css"

const MyBookings = () => {
  const { getUserBookings, updateBookingStatus, addReview, fetchUserBookings } = useBooking()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        await fetchUserBookings()
        const userBookings = getUserBookings()
        setBookings(userBookings)
      } catch (error) {
        console.error("Error loading bookings:", error)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [fetchUserBookings, getUserBookings])

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge pending">
            <FaExclamationTriangle /> Pending
          </span>
        )
      case "confirmed":
        return (
          <span className="status-badge confirmed">
            <FaCheckCircle /> Confirmed
          </span>
        )
      case "completed":
        return (
          <span className="status-badge completed">
            <FaCheckCircle /> Completed
          </span>
        )
      case "cancelled":
        return (
          <span className="status-badge cancelled">
            <FaTimesCircle /> Cancelled
          </span>
        )
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateBookingStatus(bookingId, "cancelled")
        toast.success("Booking cancelled successfully")
      } catch (error) {
        console.error("Error cancelling booking:", error)
        toast.error("Failed to cancel booking")
      }
    }
  }

  const openReviewModal = (booking) => {
    setSelectedBooking(booking)
    setShowReviewModal(true)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!reviewData.comment) {
      toast.error("Please enter a comment")
      return
    }

    try {
      await addReview(selectedBooking._id, reviewData)
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: "" })
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    const today = new Date()

    if (activeTab === "upcoming") {
      return bookingDate >= today && booking.status !== "cancelled"
    } else if (activeTab === "completed") {
      return booking.status === "completed"
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled"
    }

    return true
  })

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    )
  }

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>

      {/* Tabs */}
      <div className="booking-tabs">
        <button onClick={() => setActiveTab("upcoming")} className={activeTab === "upcoming" ? "active" : ""}>
          Upcoming
        </button>
        <button onClick={() => setActiveTab("completed")} className={activeTab === "completed" ? "active" : ""}>
          Completed
        </button>
        <button onClick={() => setActiveTab("cancelled")} className={activeTab === "cancelled" ? "active" : ""}>
          Cancelled
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">
            <FaCalendarAlt />
          </div>
          <h2>No bookings found</h2>
          <p>
            {activeTab === "upcoming"
              ? "You don't have any upcoming bookings."
              : activeTab === "completed"
                ? "You don't have any completed bookings yet."
                : "You don't have any cancelled bookings."}
          </p>
          <Link to="/dashboard" className="book-service-btn">
            Book a Service
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <div className="booking-service-info">
                  <div className={`service-icon ${booking.service.color || "blue"}`}>
                    <span>{booking.service.icon || "🔧"}</span>
                  </div>
                  <div>
                    <h2>{booking.service.name}</h2>
                    <div className="booking-meta">
                      <span>Booking ID: {booking._id.substring(0, 8)}</span>
                      <span className="meta-separator">•</span>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
                <div className="booking-price">
                  <span>₹{booking.service.price}</span>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-detail">
                  <FaCalendarAlt />
                  <div>
                    <p className="detail-label">Date</p>
                    <p className="detail-value">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="booking-detail">
                  <FaClock />
                  <div>
                    <p className="detail-label">Time</p>
                    <p className="detail-value">{booking.time}</p>
                  </div>
                </div>

                <div className="booking-detail">
                  <FaMapMarkerAlt />
                  <div>
                    <p className="detail-label">Address</p>
                    <p className="detail-value">{booking.address}</p>
                  </div>
                </div>
              </div>

              {booking.review && (
                <div className="booking-review">
                  <div className="review-header">
                    <p>Your Review</p>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < booking.review.rating ? "star-filled" : "star-empty"} />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{booking.review.comment}</p>
                </div>
              )}

              <div className="booking-actions">
                {booking.status === "completed" && !booking.review && (
                  <button onClick={() => openReviewModal(booking)} className="review-btn">
                    Leave a Review
                  </button>
                )}

                {booking.status === "pending" && (
                  <button onClick={() => handleCancelBooking(booking._id)} className="cancel-btn">
                    Cancel Booking
                  </button>
                )}

                <Link to={`/booking-details/${booking._id}`} className="details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="review-modal">
            <h2>Leave a Review</h2>

            <div className="rating-input">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="star-btn"
                  >
                    <FaStar className={star <= reviewData.rating ? "star-filled" : "star-empty"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="comment-input">
              <label>Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience with this service..."
                rows="4"
              ></textarea>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowReviewModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleReviewSubmit} className="submit-btn">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
