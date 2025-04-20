import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import ContactPage from "./Pages/ContactPages"
import AboutPage from "./Pages/AboutPages"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminServices from "./Pages/Admin/AdminServices"
// import AdminBookings from "./pages/Admin/AdminBookings"
// import AdminUsers from "./pages/admin/AdminUsers"
// import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./component/ProtectedRoutes"
import AdminRoute from "./component/AdminRoutes"
import StripeCheckout from "./Pages/StripeCheckout"
import CheckoutReturn from "./Pages/CheckoutReturn"
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

            {/* Main Layout with Header and Footer */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              {/* <Route path="service/:id" element={<ServiceDetails />} /> */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />

              {/* Protected Routes */}
              <Route
                path="bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="booking/:serviceId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              /> */}

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


              <Route
                path="booking-success/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingSuccess />
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
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
