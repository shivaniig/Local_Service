// src/pages/Admin/AdminServices.jsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_URL } from "../../Config/Constants";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/services`);
        setServices(res.data.services);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/services/${id}`);
        setServices((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Error deleting service", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
          Manage Services
        </h1>
        <Link
          to="/admin/services/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Service
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`text-2xl p-2 rounded-full text-white ${
                    service.color || "bg-blue-500"
                  }`}
                >
                  {service.icon || "🛠"}
                </div>
                <h2 className="text-xl font-semibold">{service.name}</h2>
              </div>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-sm text-gray-800 font-medium">
                Price: ₹{service.price}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Link
                to={`/admin/services/edit/${service._id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm flex items-center gap-1"
              >
                <FaEdit />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(service._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center gap-1"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
