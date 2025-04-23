"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../Config/Constants";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debugging token
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return () => {
      delete axios.defaults.headers.common["Authorization"];
    };
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/auth/me");
        console.log("User data from auth/me:", response.data); // Log user data
        setCurrentUser(response.data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password, role });
      const { token, user } = response.data;

      console.log("Login Token:", token); // Debugging token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      toast.success("Logged in successfully!");

      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/auth/register", userData);
      const { token, user } = response.data;

      console.log("Register Token:", token); // Debugging token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      toast.success("Registration successful!");

      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    toast.success("Logged out successfully");
  }, []);

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.put("http://localhost:8080api/users/profile", userData);
      setCurrentUser(response.data.user);
      toast.success("Profile updated successfully");

      return response.data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Profile update failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = currentUser?.role === "admin";

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
