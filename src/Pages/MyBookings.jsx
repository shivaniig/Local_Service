"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaStar,
} from "react-icons/fa";
import { useBooking } from "../Contexts/BookingContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { fetchUserBookings, updateBookingStatus, addReview } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const userBookings = await fetchUserBookings();
        setBookings(userBookings || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-500 text-white",
      confirmed: "bg-green-500 text-white",
      completed: "bg-blue-500 text-white",
      cancelled: "bg-red-500 text-white",
    };

    const statusIcons = {
      pending: <FaExclamationTriangle />,
      confirmed: <FaCheckCircle />,
      completed: <FaCheckCircle />,
      cancelled: <FaTimesCircle />,
    };

    return (
      <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${statusClasses[status] || "bg-gray-500 text-white"}`}>
        {statusIcons[status]} {status}
      </span>
    );
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateBookingStatus(bookingId, "cancelled");
        setBookings((prev) =>
          prev.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking))
        );
        toast.success("Booking cancelled successfully");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
      }
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const updatedBooking = await addReview(selectedBooking._id, reviewData);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id ? { ...booking, review: updatedBooking.review } : booking
        )
      );
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: "" });
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();

    if (activeTab === "upcoming") {
      return bookingDate >= today && booking.status !== "cancelled";
    } else if (activeTab === "completed") {
      return booking.status === "completed";
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
        <p className="ml-4 text-lg text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center">
          <FaCalendarAlt className="text-4xl text-gray-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700 mt-4">No bookings found</h2>
          <Link to="/dashboard" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Book a Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{booking.service.name}</h2>
                {getStatusBadge(booking.status)}
              </div>

              <div className="mt-3 text-gray-700">
                <p><FaCalendarAlt /> {new Date(booking.date).toLocaleDateString()}</p>
                <p><FaClock /> {booking.time}</p>
                <p><FaMapMarkerAlt /> {booking.address}</p>
              </div>

              {booking.review && (
                <div className="mt-4">
                  <p className="font-semibold">Your Review:</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < booking.review.rating ? "text-yellow-500" : "text-gray-400"} />
                    ))}
                  </div>
                  <p>{booking.review.comment}</p>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                {booking.status === "completed" && !booking.review && (
                  <button onClick={() => openReviewModal(booking)} className="px-3 py-2 bg-green-500 text-white rounded-md">
                    Leave a Review
                  </button>
                )}
                {booking.status === "pending" && (
                  <button onClick={() => handleCancelBooking(booking._id)} className="px-3 py-2 bg-red-500 text-white rounded-md">
                    Cancel Booking
                  </button>
                )}
                <Link to={`/booking-details/${booking._id}`} className="px-3 py-2 bg-blue-600 text-white rounded-md">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
