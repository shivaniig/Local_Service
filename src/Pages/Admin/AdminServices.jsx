"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_URL } from "../../Config/Constants";
import toast from "react-hot-toast";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/services`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching admin services:", error.response?.data || error.message);
        toast.error("Failed to load admin services. Please try again.");
      }
    };});

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication failed. Please log in.");
        return;
      }

      await axios.delete(`${API_URL}/api/admin/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted successfully!");
    } catch (err) {
      setError("Failed to delete service. Please try again.");
      console.error("Error deleting service:", err.response?.data || err.message);
      toast.error("Unable to delete the service.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
        <Link
          to="/admin/services/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-600">No services available</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`text-2xl p-3 rounded-full text-white ${service.color || "bg-blue-500"}`}>
                    {service.icon || "🛠"}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <p className="text-sm font-medium text-gray-800">
                  <span className="text-gray-500">Price:</span> ₹{service.price}
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Link
                  to={`/admin/services/edit/${service._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm flex items-center gap-1 transition"
                >
                  <FaEdit />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center gap-1 transition"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
