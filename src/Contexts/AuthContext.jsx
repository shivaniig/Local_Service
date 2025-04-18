import { createContext, useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"

// Create the AuthContext
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      
      // For demo purposes, we'll simulate a successful login
      // In a real app, you would make an API call here
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const userData = {
          id: "user123",
          name: "John Doe",
          email: email,
          role: email.includes("admin") ? "admin" : "user",
          avatar: null
        }
        
        // Mock token
        const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)
        
        // Store in localStorage
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        
        toast.success("Login successful!")
        return { success: true }
      } else {
        toast.error("Invalid credentials")
        return { success: false, message: "Invalid credentials" }
      }
    } catch (error) {
      toast.error("Login failed")
      return { success: false, message: "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      setIsLoading(true)
      
      // For demo purposes, we'll simulate a successful registration
      // In a real app, you would make an API call here
      if (name && email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock user data
        const userData = {
          id: "user" + Math.random().toString(36).substring(2),
          name: name,
          email: email,
          role: "user",
          avatar: null
        }
        
        // Mock token
        const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)
        
        // Store in localStorage
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        
        toast.success("Registration successful!")
        return { success: true }
      } else {
        toast.error("Please fill all required fields")
        return { success: false, message: "Please fill all required fields" }
      }
    } catch (error) {
      toast.error("Registration failed")
      return { success: false, message: "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    toast.success("Logged out successfully")
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      const updatedUser = { ...user, ...userData }
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      // Update state
      setUser(updatedUser)
      
      toast.success("Profile updated successfully!")
      return { success: true }
    } catch (error) {
      toast.error("Failed to update profile")
      return { success: false, message: "Failed to update profile" }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
