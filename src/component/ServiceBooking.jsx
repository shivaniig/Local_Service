import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const sampleServices = [
  {
    _id: "1",
    name: "Plumbing",
    description: "Fix leaks, installations & repairs",
    icon: "💧",
    color: "bg-blue-500",
    rating: 4.8,
    reviews: 1240,
    price: 499,
    image: "/placeholder.svg?height=200&width=300",
  },
  // Add other services here
];

const ServiceBooking = () => {
  const { serviceId } = useParams(); // Get service ID from URL params
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // For payment selection
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchService = () => {
      const selectedService = sampleServices.find(
        (item) => item._id === serviceId
      );
      if (selectedService) {
        setService(selectedService);
      } else {
        toast.error("Service not found");
      }
      setLoading(false);
    };

    fetchService();
  }, [serviceId]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast.error("Please select both date and time");
      return;
    }
    if (step === 2 && !address) {
      toast.error("Please enter your address");
      return;
    }
    if (step === 3 && !paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsConfirmed(true);
  };

  const handleCloseDialog = () => {
    setIsConfirmed(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Book {service?.name} Service
        </h1>
        <div className="text-sm font-medium text-gray-500">Step {step} of 3</div>
      </div>

      {/* Conditional Step Content */}
      {step === 1 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Select Date & Time
          </h2>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
              {getAvailableDates().map((date, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedDate(date.toISOString().split("T")[0])
                  }
                  className={`flex flex-col items-center rounded-lg border p-2 ${
                    selectedDate === date.toISOString().split("T")[0]
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-xs">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-semibold">{date.getDate()}</span>
                  <span className="text-xs">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {["10:00 AM", "02:00 PM", "06:00 PM"].map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-lg border p-2 ${
                    selectedTime === time
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextStep}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Enter Address
          </h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500"
            placeholder="Enter your address"
          ></textarea>
          <button
            onClick={handlePrevStep}
            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

{step === 3 && (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <h2 className="mb-4 text-lg font-semibold text-gray-900">
      Review & Confirm
    </h2>
    {/* Displaying the selected service name */}
    <p className="mb-2 text-sm font-medium text-gray-700">
      Service: <span className="font-semibold text-gray-900">{service?.name}</span>
    </p>
    <p className="mb-2 text-sm font-medium text-gray-700">
      Date: <span className="font-semibold text-gray-900">{selectedDate}</span>
    </p>
    <p className="mb-2 text-sm font-medium text-gray-700">
      Time: <span className="font-semibold text-gray-900">{selectedTime}</span>
    </p>
    <p className="mb-4 text-sm font-medium text-gray-700">
      Address: <span className="font-semibold text-gray-900">{address}</span>
    </p>
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-medium text-gray-700">
        Select Payment Method
      </h3>
      <div>
        <button
          onClick={() => setPaymentMethod("cash")}
          className={`mb-2 w-full rounded-lg border p-3 ${
            paymentMethod === "cash"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          Cash on Delivery
        </button>
        <button
          onClick={() => setPaymentMethod("online")}
          className={`w-full rounded-lg border p-3 ${
            paymentMethod === "online"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          Online Payment
        </button>
      </div>
    </div>
    <div className="flex justify-between">
      <button
        onClick={handlePrevStep}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-200"
      >
        Back
      </button>
      <button
        onClick={handleSubmit}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  </div>
)}
           {isConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Confirmed!
            </h2>
            <p className="mt-2 text-gray-600">
              Your booking for {service?.name} is confirmed on {selectedDate} at{" "}
              {selectedTime}.
            </p>
            <button
              onClick={handleCloseDialog}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceBooking;
