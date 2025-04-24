// src/Contexts/BookingContext.jsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../Config/Constants";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bookings`);
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const addBooking = async (booking) => {
    try {
      const res = await axios.post(`${API_URL}/api/bookings`, booking);
      setBookings((prev) => [...prev, res.data.booking]);
    } catch (err) {
      console.error("Error adding booking", err);
    }
  };

  const updateBooking = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/api/bookings/${id}`, data);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data.booking : b))
      );
    } catch (err) {
      console.error("Error updating booking", err);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  return (
    <BookingContext.Provider
      value={{ bookings, loading, addBooking, updateBooking, deleteBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
