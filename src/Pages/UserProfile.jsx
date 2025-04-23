"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [addressInput, setAddressInput] = useState("");
  const [roleInput, setRoleInput] = useState(""); // Add state for role input
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Decode token function
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/login");
        return;
      }

      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 < Date.now()) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setUserData(null);
        if (err.response?.status === 404) {
          toast.error("User not found");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error("Something went wrong while loading profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Submit updated address and role
  const handleProfileSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/address",
        { address: addressInput, role: roleInput }, // Include role in the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");
      setUserData((prev) => ({
        ...prev,
        address: addressInput,
        role: roleInput, // Update role in the userData state
      }));

      setAddressInput("");
      setRoleInput(""); // Reset role input
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.status === 400) {
        toast.error("Invalid data.");
      } else {
        toast.error("Failed to update profile.");
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white rounded shadow p-4 space-y-4">
        <div>
          <p className="font-medium text-gray-700">Username:</p>
          <p>{userData?.name || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Email:</p>
          <p>{userData?.email || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Role:</p>
          {userData?.role ? (
            <p>{userData.role}</p>
          ) : (
            <div>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Enter your role"
                className="mt-1 w-full rounded border p-2"
              />
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-700">Address:</p>
          {userData?.address ? (
            <p>{userData.address}</p>
          ) : (
            <div>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter your address"
                className="mt-1 w-full rounded border p-2"
              />
              <button
                onClick={handleProfileSubmit}
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Save Address & Role
              </button>
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-700">Past Bookings:</p>
          <ul className="list-disc pl-5">
            {userData?.bookings?.length ? (
              userData.bookings.map((booking, index) => (
                <li key={index}>{booking}</li>
              ))
            ) : (
              <li>No bookings yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
