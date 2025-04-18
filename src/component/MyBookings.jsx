import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaStar } from "react-icons/fa";
import { useBooking } from "../Contexts/BookingContext";
import { toast } from "react-toastify";

export default function MyBookings() {
  const { getUserBookings, updateBookingStatus, addReview } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getUserBookings();
        if (result.success) {
          setBookings(result.bookings);
        }
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch user bookings
    fetchBookings();
  }, [getUserBookings]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <FaExclamationTriangle className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <FaCheckCircle className="mr-1 h-3 w-3" /> Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <FaCheckCircle className="mr-1 h-3 w-3" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <FaTimesCircle className="mr-1 h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const result = await updateBookingStatus(bookingId, "cancelled");
      if (result.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
        );
      }
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.comment) {
      toast.error("Please enter a comment");
      return;
    }

    const result = await addReview(selectedBooking._id, reviewData);
    if (result.success) {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBooking._id ? { ...booking, review: result.review } : booking,
        ),
      );
      setShowReviewModal(false);
      toast.success("Review submitted successfully");
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
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">My Bookings</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 text-sm font-medium ${activeTab === "upcoming" ? "border-b-2 border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-4 text-sm font-medium ${activeTab === "completed" ? "border-b-2 border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`pb-4 text-sm font-medium ${activeTab === "cancelled" ? "border-b-2 border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
          >
            Cancelled
          </button>
        </nav>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <div className="mb-4 text-gray-400">
            <FaCalendarAlt className="mx-auto h-12 w-12" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">No bookings found</h2>
          <p className="mb-6 text-gray-600">
            {activeTab === "upcoming"
              ? "You don't have any upcoming bookings."
              : activeTab === "completed"
              ? "You don't have any completed bookings yet."
              : "You don't have any cancelled bookings."}
          </p>
          <Link to="/dashboard" className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Book a Service
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="rounded-lg bg-white p-6 shadow-md">
              {/* Other components */}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {/* Modal Content */}
          </div>
        </div>
      )}
    </div>
  );
}
