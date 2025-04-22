"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CreditCard, Wallet, CheckCircle, ChevronRight } from "lucide-react"
import { useBooking } from "../Contexts/BookingContext"
import { useAuth } from "../Contexts/AuthContext"
import { toast } from "react-toastify"
import axios from "axios"

export default function ServiceBooking() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { createBooking } = useBooking()
  const { user } = useAuth()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [step, setStep] = useState(1)

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ]

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/services/${serviceId}`)
        setService(response.data.service)
      } catch (error) {
        toast.error("Failed to load service details")
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceId, navigate])

  // Get available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date.toISOString().split("T")[0])
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast.error("Please select both date and time")
      return
    }

    if (step === 2 && !address) {
      toast.error("Please enter your address")
      return
    }

    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      const bookingData = {
        service: serviceId,
        date: selectedDate,
        time: selectedTime,
        address,
        notes,
        paymentMethod,
      }

      const result = await createBooking(bookingData)

      if (result.success) {
        navigate(`/booking-confirmation/${result.booking._id}`)
      }
    } catch (error) {
      toast.error("Failed to create booking")
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Book {service?.name} Service</h1>
        <div className="text-sm font-medium text-gray-500">Step {step} of 3</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 w-full rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between">
          <div className={`text-xs font-medium ${step >= 1 ? "text-blue-500" : "text-gray-500"}`}>Schedule</div>
          <div className={`text-xs font-medium ${step >= 2 ? "text-blue-500" : "text-gray-500"}`}>Address</div>
          <div className={`text-xs font-medium ${step >= 3 ? "text-blue-500" : "text-gray-500"}`}>Payment</div>
        </div>
      </div>

      {/* Service Summary */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-lg ${service?.color || "bg-blue-500"} text-white`}
          >
            <span className="text-3xl">{service?.icon || "🔧"}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{service?.name}</h2>
            <p className="text-gray-600">{service?.description}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                <span className="mr-1 text-yellow-400">★</span>
                {service?.rating || 4.8}
              </span>
              <span className="mx-2">•</span>
              <span>{service?.bookings || 1000}+ bookings</span>
              <span className="mx-2">•</span>
              <span>₹{service?.price || 499}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Schedule */}
      {step === 1 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Date & Time</h2>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Select Date</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
              {getAvailableDates().map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`flex flex-col items-center rounded-lg border p-2 transition-colors ${
                    selectedDate === date.toISOString().split("T")[0]
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="text-lg font-semibold">{date.getDate()}</span>
                  <span className="text-xs">{date.toLocaleDateString("en-US", { month: "short" })}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Select Time</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className={`rounded-lg border p-2 text-center transition-colors ${
                    selectedTime === time
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextStep}
              className="flex items-center rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Address</h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your complete address"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="2"
              placeholder="Any specific instructions for the service provider"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h2>

          <div className="mb-6 space-y-3">
            <div
              onClick={() => setPaymentMethod("cash")}
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                paymentMethod === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <div className="mr-4">
                <Wallet className="h-6 w-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Pay after the service is completed</p>
              </div>
              {paymentMethod === "cash" && <CheckCircle className="h-5 w-5 text-blue-500" />}
            </div>

            <div
              onClick={() => setPaymentMethod("online")}
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                paymentMethod === "online" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <div className="mr-4">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Online Payment</h3>
                <p className="text-sm text-gray-500">Pay now using card, UPI, or net banking</p>
              </div>
              {paymentMethod === "online" && <CheckCircle className="h-5 w-5 text-blue-500" />}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-medium text-gray-900">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-blue-600">₹{service?.price || 499}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button onClick={handleSubmit} className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
