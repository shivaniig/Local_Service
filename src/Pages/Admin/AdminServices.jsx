"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"
import { API_URL, SERVICE_CATEGORIES } from "../../Config/Constants"
//import "../../styles/AdminServices.css"

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" or "edit"
  const [selectedService, setSelectedService] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "home",
    image: "",
    isActive: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_URL}/api/services/admin`)
      setServices(response.data.services)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const openAddModal = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "home",
      image: "",
      isActive: true,
    })
    setModalMode("add")
    setShowModal(true)
  }

  const openEditModal = (service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      image: service.image,
      isActive: service.isActive,
    })
    setModalMode("edit")
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === "add") {
        const response = await axios.post(`${VITE_API_URL}/api/services`, formData)
        setServices([...services, response.data.service])
        toast.success("Service added successfully")
      } else {
        const response = await axios.put(`${VITE_API_URL}/api/services/${selectedService._id}`, formData)
        setServices(services.map((s) => (s._id === selectedService._id ? response.data.service : s)))
        toast.success("Service updated successfully")
      }
      setShowModal(false)
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error(error.response?.data?.message || "Failed to save service")
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${VITE_API_URL}/api/services/${serviceId}`)
        setServices(services.filter((service) => service._id !== serviceId))
        toast.success("Service deleted successfully")
      } catch (error) {
        console.error("Error deleting service:", error)
        toast.error("Failed to delete service")
      }
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    )
  }

  return (
    <div className="admin-services">
      <div className="admin-header">
        <h1>Manage Services</h1>
        <button className="add-service-btn" onClick={openAddModal}>
          <FaPlus /> Add New Service
        </button>
      </div>

      <div className="filters-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="no-services">
          <p>No services found matching your criteria.</p>
        </div>
      ) : (
        <div className="services-table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div className="service-name-cell">
                      <div className="service-icon">{service.icon || "🔧"}</div>
                      <div>
                        <div className="service-name">{service.name}</div>
                        <div className="service-description">{service.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>{service.category}</td>
                  <td>₹{service.price}</td>
                  <td>
                    <div className="rating">
                      <span className="stars">{"★".repeat(Math.floor(service.rating))}</span>
                      <span className="rating-value">({service.rating})</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${service.isActive ? "active" : "inactive"}`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => openEditModal(service)}>
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteService(service._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="service-modal">
            <h2>{modalMode === "add" ? "Add New Service" : "Edit Service"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="home">Home Services</option>
                    <option value="appliance">Appliance Repair</option>
                    <option value="electronics">Electronics</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL or leave blank for default"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {modalMode === "add" ? "Add Service" : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminServices
