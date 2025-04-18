"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./Contexts/AuthContext"
import { BookingProvider } from "./Contexts/BookingContext"
import Layout from "./component/Layout"
import LoginSignup from "./Components/LoginSignup"
import Dashboard from "./Components/Dashboard"
import MyBookings from "./component/MyBookings"
//import Contact from "./pages/Contact"
//import About from "./pages/About"
import AdminDashboard from "./component/AdminDashboard"
import "./index.css"
import Start from "./Main/Start"
import AboutUs from "./Components/AboutUs"

// Protected route component
// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth()

//   if (!currentUser) {
//     return <Navigate to="/dash" replace />
//   }

//   return children
// }

// Admin route component
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth()

  if (!currentUser || !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* <Route path="/" element={<Start />} /> */}
            <Route path="/" element={<Start/>}>
              {/* <Route index element={<Navigate to="/dash" replace />} /> */}
              <Route path="/dash" element={<Dashboard />} />
              <Route
                path="/bookings"
                element={

                  <MyBookings />

                }
              />
              <Route path="/about" element={<AboutUs />} />
              {/* <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} /> */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/dash" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App




