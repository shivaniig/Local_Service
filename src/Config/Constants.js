// Constants.js

// API URL based on environment
export const API_URL = "http://localhost:8080";

// Stripe publishable key
export const STRIPE_PUBLIC_KEY = import.meta.env.STRIPE_PUBLIC_KEY || "pk_test_your_key";

// Default location
export const DEFAULT_LOCATION = "Mumbai, Maharashtra";

// Service categories
export const SERVICE_CATEGORIES = [
  { id: "all", name: "All Services" },
  { id: "home", name: "Home Services" },
  { id: "appliance", name: "Appliance Repair" },
  { id: "electronics", name: "Electronics" },
  { id: "cleaning", name: "Cleaning" },
];

// Booking statuses
export const BOOKING_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Payment methods
export const PAYMENT_METHODS = {
  ONLINE: "online",
  COD: "cod",
};
