import { useState, useEffect } from "react"
import axios from "axios"
import "./Login.css"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup && !formData.name) {
      alert("Please enter your name");
      return;
    }
    console.log(isSignup ? "Signing Up:" : "Logging In:", formData);
    navigate("/dash");
  };

  const handleFindServicesClick = () => {
    setShowLogin(true);
  };

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       navigate("/dash")
//     }
//   }, [navigate])

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simple validation
//     if (!formData.email || !formData.password || (isSignup && !formData.name)) {
//       toast.error("Please fill all required fields.")
//       setIsLoading(false)
//       return
//     }

//     try {
//       const endpoint = isSignup ? "http://localhost:8080/api/auth/signup" : "http://localhost:8080/api/auth/login"

//       const response = await axios.post(endpoint, formData)

//       const { token, user, message } = response.data

//       // Save to localStorage
//       localStorage.setItem("token", token)
//       localStorage.setItem("user", JSON.stringify(user))

//       // Show toast and navigate on close
//       toast.success(message || `${isSignup ? "Signup" : "Login"} successful!`, {
//         onClose: () => {
//           console.log("✅ Navigating to dashboard...")
//           navigate("/dash")
//         },
//         autoClose: 1500,
//       })
//     } catch (err) {
//       const msg = err.response?.data?.message || "Authentication failed!"
//       toast.error(msg)
//     } finally {
//       setIsLoading(false)
//     }
//   }

  return (
    <div className="main">
      <div className="formBox">
        <h2 className="title">{isSignup ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              autoComplete="name"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            autoComplete="current-password"
          />
                   <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white rounded-lg transition-none hover:bg-blue-500"
                >
                  {isSignup ? "Sign Up" : "Login"}
                </button>
        </form>

        
        <p className="text-white text-sm mt-4">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
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
  )
}
