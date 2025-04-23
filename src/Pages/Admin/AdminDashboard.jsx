"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUsers, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaList, FaTable } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../../Config/Constants"
import { useAuth } from "../../Contexts/AuthContext"

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
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner animate-spin"></div>
        <p className="ml-4">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {currentUser?.name}</span>
          <div className="flex space-x-2">
            <button
              className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded`}
              onClick={() => setViewMode("grid")}
            >
              <FaTable />
            </button>
            <button
              className={`p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded`}
              onClick={() => setViewMode("list")}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl text-blue-500">
            <FaUsers />
          </div>
          <h3 className="text-xl">Total Users</h3>
          <p className="text-lg font-semibold">{stats.totalUsers}</p>
          <p className="text-sm text-green-500">+12% from last month</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl text-green-500">
            <FaCalendarCheck />
          </div>
          <h3 className="text-xl">Total Bookings</h3>
          <p className="text-lg font-semibold">{stats.totalBookings}</p>
          <p className="text-sm text-green-500">+8% from last month</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl text-yellow-500">
            <FaMoneyBillWave />
          </div>
          <h3 className="text-xl">Total Revenue</h3>
          <p className="text-lg font-semibold">₹{stats.totalRevenue}</p>
          <p className="text-sm text-green-500">+15% from last month</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl text-red-500">
            <FaCalendarCheck />
          </div>
          <h3 className="text-xl">Pending Bookings</h3>
          <p className="text-lg font-semibold">{stats.pendingBookings}</p>
          <Link to="/lay/adminservices" className="text-sm text-blue-500">View all pending</Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bookings Overview</h2>
            <select className="p-2 border rounded">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg mt-4">
            <FaChartLine className="text-4xl text-gray-400" />
            <p className="mt-2">Booking statistics chart will appear here</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Revenue Trends</h2>
            <select className="p-2 border rounded">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg mt-4">
            <FaChartLine className="text-4xl text-gray-400" />
            <p className="mt-2">Revenue trends chart will appear here</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-blue-500">View all</Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center mt-4">
            <p>No recent bookings found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${booking.service.color || "bg-blue-500"}`}>
                      <span>{booking.service.icon || "🔧"}</span>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold">{booking.service.name}</h3>
                      <p className="text-sm text-gray-500">ID: {booking._id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div className={`text-sm ${booking.status === "completed" ? "text-green-500" : "text-red-500"}`}>
                    {booking.status}
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Customer:</strong> {booking.user.name}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Amount:</strong> ₹{booking.service.price}</p>
                </div>
                <Link to={`/admin/bookings/${booking._id}`} className="block mt-4 text-blue-500 text-center">View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Service</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Date & Time</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b">
                    <td className="py-2 px-4">{booking._id.substring(0, 8)}</td>
                    <td className="py-2 px-4">{booking.service.name}</td>
                    <td className="py-2 px-4">{booking.user.name}</td>
                    <td className="py-2 px-4">{new Date(booking.date).toLocaleDateString()} {booking.time}</td>
                    <td className="py-2 px-4">₹{booking.service.price}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded ${booking.status === "completed" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/admin/bookings/${booking._id}`} className="text-blue-500">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <Link to="/admin/services" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Services</Link>
        <Link to="/admin/users" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Users</Link>
        <Link to="/admin/bookings" className="bg-blue-500 text-white py-2 px-4 rounded-lg">All Bookings</Link>
      </div>
    </div>
  )
}

export default AdminDashboard
