"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import toast from "react-hot-toast";
import BgImage from "../assets/Bg.png";

function Start() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && !formData.name) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        const user = await register(formData);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const user = await login(formData.email, formData.password, formData.role)
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/lay/dashboard")
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setLoading(false);
    }
  };

  const handleFindServicesClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat animate-bgfade"
        style={{ backgroundImage: `url(${BgImage})`, zIndex: -2 }}
      ></div>

      {/* Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-20 animate-overlayfade"
        style={{ zIndex: -1 }}
      ></div>

      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        {!showLogin ? (
          <div>
            <h1 className="text-black text-4xl font-bold animate-float">
              Connect with Skilled Service Providers Today
            </h1>
            <p className="text-black text-xl opacity-90 mt-4 animate-pulse">
              TRUSTED LOCAL PROFESSIONALS
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-full text-black text-xl bg-opacity-10 backdrop-blur-md border-2 border-white shadow-md transition-all transform hover:scale-110 hover:-translate-y-1 animate-bounce"
              onClick={handleFindServicesClick}
            >
              FIND SERVICES
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <div className="relative p-6 max-w-sm w-full rounded-xl bg-black border border-white shadow-lg">
              <h2 className="text-white text-2xl mb-4">
                {isSignup ? "Sign Up" : "Login"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Role field (shown in both login and signup) */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>

                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white rounded-lg transition-none hover:bg-blue-500"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                </button>
              </form>

              <p className="text-white text-sm mt-4">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </span>
              </p>

              <button
                className="mt-4 px-4 py-2 rounded border-2 border-white text-white"
                onClick={() => setShowLogin(false)}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          @keyframes bgfade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }

          .animate-bgfade {
            animation: bgfade 8s ease-in-out infinite;
          }

          @keyframes overlayfade {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.3; }
          }

          .animate-overlayfade {
            animation: overlayfade 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Start;
