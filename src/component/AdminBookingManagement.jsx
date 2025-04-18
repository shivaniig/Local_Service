import React, { useState } from "react";

const initialBookings = [
  {
    _id: "1",
    user: { name: "Ravi Sharma", email: "ravi@gmail.com" },
    service: { name: "AC Repair", icon: "🛠️" },
    date: "2025-04-20",
    time: "11:00 AM",
    status: "pending",
  },
  {
    _id: "2",
    user: { name: "Meera Jain", email: "meera@gmail.com" },
    service: { name: "Plumbing", icon: "🚰" },
    date: "2025-04-18",
    time: "2:00 PM",
    status: "completed",
  },
  {
    _id: "3",
    user: { name: "Amit Verma", email: "amitv@gmail.com" },
    service: { name: "Painting", icon: "🎨" },
    date: "2025-04-22",
    time: "9:30 AM",
    status: "pending",
  },
  {
    _id: "4",
    user: { name: "Nikita Rao", email: "nikita@gmail.com" },
    service: { name: "Plumbing", icon: "🚰" },
    date: "2025-04-21",
    time: "4:00 PM",
    status: "pending",
  },
];

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = (id, newStatus) => {
    const updated = bookings.map((booking) =>
      booking._id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updated);
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard - Pending Bookings
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">S.No.</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{booking.user.name}</td>
                    <td className="px-6 py-4">{booking.user.email}</td>
                    <td className="px-6 py-4">
                      {booking.service.icon} {booking.service.name}
                    </td>
                    <td className="px-6 py-4">{booking.date}</td>
                    <td className="px-6 py-4">{booking.time}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleStatusChange(booking._id, "accepted")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, "rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No pending bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManagement;
