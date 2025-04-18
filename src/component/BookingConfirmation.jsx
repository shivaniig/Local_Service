import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, Calendar, DollarSign, TrendingUp, BarChart2, PieChart, List, Grid } from "lucide-react"
import axios from "axios"

export default function AdminDashboard() {
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
    const fetchAdminData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await axios.get("http://localhost:8080/api/admin/stats")
        setStats(statsResponse.data)

        // Fetch recent bookings
        const bookingsResponse = await axios.get("http://localhost:8080/api/admin/bookings/recent")
        setRecentBookings(bookingsResponse.data.bookings)
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Admin Dashboard</h1>
        <div className="mt-4 flex space-x-2 sm:mt-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-2 ${
              viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-md p-2 ${
              viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>12% increase</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>8% increase</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>15% increase</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-yellow-100 p-3 text-yellow-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all pending
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Bookings Overview</h2>
            <select className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex h-64 items-center justify-center">
            <BarChart2 className="h-32 w-32 text-gray-300" />
            <p className="text-gray-500">Booking statistics chart will appear here</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Service Distribution</h2>
            <select className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex h-64 items-center justify-center">
            <PieChart className="h-32 w-32 text-gray-300" />
            <p className="text-gray-500">Service distribution chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No recent bookings found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg ${booking.service.color || "bg-blue-500"} text-white`}
                    >
                      <span className="text-lg">{booking.service.icon || "🔧"}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.service.name}</h3>
                      <p className="text-xs text-gray-500">ID: {booking._id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  <p>Customer: {booking.user.name}</p>
                  <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p>Time: {booking.time}</p>
                </div>
                <Link
                  to={`/admin/bookings/${booking._id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-gray-900">{booking._id.substring(0, 8)}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg ${booking.service.color || "bg-blue-500"} text-white`}
                        >
                          <span>{booking.service.icon || "🔧"}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{booking.service.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-gray-900">{booking.user.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Link to={`/admin/bookings/${booking._id}`} className="text-blue-600 hover:text-blue-900">
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
    </div>
  )
}
