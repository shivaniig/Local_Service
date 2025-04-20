"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUsers, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaList, FaTable } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../../Config/Constants"
import { useAuth } from "../../Contexts/AuthContext"
//import "../../styles/AdminDashboard.css"

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard stats
        const statsResponse = await axios.get(`${VITE_API_URL}/api/admin/stats`)

        // Fetch recent bookings
        const bookingsResponse = await axios.get(`${VITE_API_URL}/api/admin/bookings/recent`)

        setStats(statsResponse.data)
        setRecentBookings(bookingsResponse.data.bookings)
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {currentUser?.name}</span>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <FaTable />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <p className="stat-change positive">+12% from last month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings}</p>
            <p className="stat-change positive">+8% from last month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue}</p>
            <p className="stat-change positive">+15% from last month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>Pending Bookings</h3>
            <p className="stat-value">{stats.pendingBookings}</p>
            <Link to="/admin/bookings" className="view-all">
              View all pending
            </Link>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Bookings Overview</h2>
            <select className="chart-period-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <FaChartLine />
            <p>Booking statistics chart will appear here</p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Revenue Trends</h2>
            <select className="chart-period-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <FaChartLine />
            <p>Revenue trends chart will appear here</p>
          </div>
        </div>
      </div>

      <div className="recent-bookings-section">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <Link to="/admin/bookings" className="view-all-link">
            View all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="no-data">
            <p>No recent bookings found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="bookings-grid">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="service-info">
                    <div className={`service-icon ${booking.service.color || "blue"}`}>
                      <span>{booking.service.icon || "🔧"}</span>
                    </div>
                    <div>
                      <h3>{booking.service.name}</h3>
                      <p className="booking-id">ID: {booking._id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                </div>
                <div className="booking-details">
                  <p>
                    <strong>Customer:</strong> {booking.user.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {booking.time}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{booking.service.price}
                  </p>
                </div>
                <div className="booking-actions">
                  <Link to={`/admin/bookings/${booking._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id.substring(0, 8)}</td>
                    <td>
                      <div className="service-cell">
                        <div className={`service-icon-small ${booking.service.color || "blue"}`}>
                          <span>{booking.service.icon || "🔧"}</span>
                        </div>
                        <span>{booking.service.name}</span>
                      </div>
                    </td>
                    <td>{booking.user.name}</td>
                    <td>
                      <div>
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="booking-time">{booking.time}</div>
                      </div>
                    </td>
                    <td>₹{booking.service.price}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                    </td>
                    <td>
                      <Link to={`/admin/bookings/${booking._id}`} className="action-btn">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-quick-links">
        <Link to="/admin/services" className="quick-link">
          Manage Services
        </Link>
        <Link to="/admin/users" className="quick-link">
          Manage Users
        </Link>
        <Link to="/admin/bookings" className="quick-link">
          All Bookings
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
