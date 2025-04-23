import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./Contexts/AuthContext"
import { BookingProvider } from "./Contexts/BookingContext"
import Layout from "./component/Layout"
import Start from "./Pages/Start"
import Dashboard from "./Pages/Dashboard"
// import ServiceDetails from "./Pages/ServiceDetails"
// import BookingPage from "./Pages/BookingPage"
import PaymentPage from "./Pages/PaymentPage"
// import BookingSuccess from "./Pages/BookingSuccess"
import MyBookings from "./Pages/MyBookings"
import ContactPages from "./Pages/ContactPages"
import AboutPages from "./Pages/AboutPages"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminServices from "./Pages/Admin/AdminServices"
// import AdminBookings from "./pages/Admin/AdminBookings"
// import AdminUsers from "./pages/admin/AdminUsers"
// import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./component/ProtectedRoutes"
import AdminRoute from "./component/AdminRoutes"
import StripeCheckout from "./Pages/StripeCheckout"
import CheckoutReturn from "./Pages/CheckoutReturn"
import UserProfile from "./Pages/UserProfile"
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Start />} />

            {/* Redirect to layout-based dashboard */}
            <Route path="/dashboard" element={<Navigate to="/lay/dashboard" replace />} />

            {/* Layout for nested routes */}
            <Route path="/lay" element={<Layout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* About & Contact */}
              <Route path="about" element={<AboutPages />} />
              <Route path="contact" element={<ContactPages />} />
              <Route path="profile" element={<UserProfile />} />
              {/* Protected Routes */}
              <Route
                path="bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* 
              <Route
                path="booking/:serviceId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              /> 
              */}

              <Route
                path="payment/:bookingId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="checkout/:bookingId"
                element={
                  <ProtectedRoute>
                    <StripeCheckout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="return"
                element={
                  <ProtectedRoute>
                    <CheckoutReturn />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="admin/services"
                element={
                  <AdminRoute>
                    <AdminServices />
                  </AdminRoute>
                }
              />

              {/* Future Admin Routes */}
              {/* 
              <Route
                path="admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />
              
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              */}
            </Route>

            {/* Catch-all: redirect to dashboard */}
            <Route path="*" element={<Navigate to="/lay/dashboard" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
