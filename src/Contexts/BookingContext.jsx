"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { API_URL } from "../Config/Constants";

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/services`);
        setServices(response.data.services);
      } catch (err) {
        handleApiError(err, "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch bookings when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
  }, [currentUser]);

  // Generic error handler
  const handleApiError = (err, defaultMessage) => {
    const message = err.response?.data?.message || defaultMessage;
    console.error(message, err);
    setError(message);
    toast.error(message);
  };

  // Fetch user bookings
  const fetchUserBookings = async () => {
    if (!currentUser?.token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setBookings(response.data.bookings);
    } catch (err) {
      handleApiError(err, "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData) => {
    if (!currentUser?.token) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setBookings((prev) => [...prev, response.data.booking]);
      toast.success("Booking created successfully!");
      return response.data.booking;
    } catch (err) {
      handleApiError(err, "Failed to create booking.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    if (!currentUser?.token) return;

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setBookings((prev) =>
        prev.map((booking) => (booking._id === bookingId ? response.data.booking : booking))
      );

      toast.success(`Booking ${status} successfully!`);
      return response.data.booking;
    } catch (err) {
      handleApiError(err, `Failed to update booking status.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    return updateBookingStatus(bookingId, "cancelled");
  };

  // Process payment
  const processPayment = async (bookingId, paymentMethodId) => {
    if (!currentUser?.token) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/payments/${bookingId}`, { paymentMethodId }, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, isPaid: true, paymentMethod: "online", paymentDate: new Date() }
            : booking
        )
      );

      toast.success("Payment processed successfully!");
      return response.data;
    } catch (err) {
      handleApiError(err, "Payment processing failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add review to a booking
  const addReview = async (bookingId, reviewData) => {
    if (!currentUser?.token) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/bookings/${bookingId}/review`, reviewData, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, review: response.data.review } : booking
        )
      );

      toast.success("Review submitted successfully!");
      return response.data.review;
    } catch (err) {
      handleApiError(err, "Failed to submit review.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    services,
    loading,
    error,
    fetchUserBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    processPayment,
    addReview,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export default BookingContext;
