"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { API_URL } from "../Config/Constants"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    return () => {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/me`)
        setCurrentUser(response.data.user)
      } catch (err) {
        console.error("Auth check failed:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const loginUser = async (email, password, role) => {
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);  // Log to check if the token is stored
      } else {
        console.log("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  
    const response = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });
    
    const data = await response.json();
    console.log("Login response:", data);  // Check the response for the token
    
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setCurrentUser(null)
    toast.success("Logged out successfully")
  }, [])

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError("")
      setLoading(true)

      const response = await axios.put(`${API_URL}/api/users/profile`, userData)
      setCurrentUser(response.data.user)
      toast.success("Profile updated successfully")

      return response.data.user
    } catch (err) {
      const message = err.response?.data?.message || "Profile update failed"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Check if user is admin
  const isAdmin = currentUser?.role === "admin"

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
};
export default AuthContext
