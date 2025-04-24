"use client"

import { useState, useEffect } from "react"
import { Link , useNavigate } from "react-router-dom"
import {
  FaUsers, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaList, FaTable
} from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../Contexts/AuthContext"

const AdminDashboard = () => {
  const navigate = useNavigate();
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

        const statsResponse = await axios.get("http://localhost:8080/api/admin/stats")
        const bookingsResponse = await axios.get("http://localhost:8080/api/admin/bookings/recent")

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
        <div className="loading-spinner animate-spin border-4 border-blue-400 border-t-transparent rounded-full w-12 h-12"></div>
        <p className="ml-4 text-lg">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
            <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            // Add your logout logic here (e.g., clear session, remove token)
            localStorage.clear(); // Example: Clearing local storage
            navigate("/"); // Redirect to the home page
          }}
        >
          Logout
        </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FaUsers />} title="Total Users" value={stats.totalUsers} trend="+12%" color="text-blue-500" />
        <StatCard icon={<FaCalendarCheck />} title="Total Bookings" value={stats.totalBookings} trend="+8%" color="text-green-500" />
        <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value={`₹${stats.totalRevenue}`} trend="+15%" color="text-yellow-500" />
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl text-red-500">
            <FaCalendarCheck />
          </div>
          <h3 className="text-xl">Pending Bookings</h3>
          <p className="text-lg font-semibold">{stats.pendingBookings}</p>
          <Link to="/lay/adminservices" className="text-sm text-blue-500">View all pending</Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <ChartCard title="Bookings Overview" />
        <ChartCard title="Revenue Trends" />
      </div>

      {/* Recent Bookings Section */}
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
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <BookingTable bookings={recentBookings} />
        )}
      </div>

      {/* Quick Navigation */}
      <div className="flex gap-4 mt-6">
        <Link to="/admin/services" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Services</Link>
        <Link to="/admin/users" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Users</Link>
        <Link to="/admin/bookings" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Bookings</Link>
      </div>
    </div>
  )
}

export default AdminDashboard

// --- Reusable Components ---

const StatCard = ({ icon, title, value, trend, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className={`text-2xl ${color}`}>{icon}</div>
    <h3 className="text-xl">{title}</h3>
    <p className="text-lg font-semibold">{value}</p>
    <p className="text-sm text-green-500">{trend} from last month</p>
  </div>
)

const ChartCard = ({ title }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <select className="p-2 border rounded">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 3 months</option>
      </select>
    </div>
    <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg mt-4">
      <FaChartLine className="text-4xl text-gray-400" />
      <p className="ml-2">Chart will appear here</p>
    </div>
  </div>
)

const BookingCard = ({ booking }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${booking.service.color || "bg-blue-500"}`}>
          <span>{booking.service.icon || "🔧"}</span>
        </div>
        <div className="ml-2">
          <h3 className="text-lg font-semibold">{booking.service.name}</h3>
          <p className="text-sm text-gray-500">ID: {booking._id.slice(0, 8)}</p>
        </div>
      </div>
      <div className={`text-sm ${booking.status === "completed" ? "text-green-500" : "text-red-500"}`}>
        {booking.status}
      </div>
    </div>
    <div className="mt-4 space-y-1">
      <p><strong>Customer:</strong> {booking.user.name}</p>
      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {booking.time}</p>
      <p><strong>Amount:</strong> ₹{booking.service.price}</p>
    </div>
    <Link to={`/admin/bookings/${booking._id}`} className="block mt-4 text-blue-500 text-center">View Details</Link>
  </div>
)

const BookingTable = ({ bookings }) => (
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
        {bookings.map((booking) => (
          <tr key={booking._id} className="border-b">
            <td className="py-2 px-4">{booking._id.slice(0, 8)}</td>
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
)
