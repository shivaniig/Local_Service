"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [addressInput, setAddressInput] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data); // Set the user data from the response
          setLoading(false); // Set loading to false after data is fetched
        } else {
          console.error("Failed to fetch user profile");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleAddressSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8080/api/user/address", 
        { address: addressInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevData) => ({
        ...prevData,
        address: addressInput,
      }));
      toast.success("Address updated successfully");
    } catch (err) {
      toast.error("Failed to update address");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="bg-white rounded shadow p-4 space-y-4">
        <div>
          <p className="font-medium text-gray-700">Username:</p>
          <p>{userData?.name}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Email:</p>
          <p>{userData?.email}</p>
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
                onClick={handleAddressSubmit}
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Save Address
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
