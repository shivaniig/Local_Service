"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!currentUser) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
