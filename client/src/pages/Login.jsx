import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
// import Cookies from "js-cookie" (If you're using cookies for tokens)

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // If you're remembering user credentials in cookies, e.g.:
  // const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize the Google sign-in
      window.google.accounts.id.initialize({
        client_id:
          "268942872776-ulvhmack82ul53133h6fkdd4f7ehnsgb.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = async (googleResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential: googleResponse.credential },
        { withCredentials: true }
      );

      console.log("Google login response data:", res.data);

      // Check if token is returned
      if (res.data.token) {
        // Save the token
        localStorage.setItem("token", res.data.token);
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Access Granted",
        text: "You've successfully accessed your EliteFit.",
        background: "#ffffff",
        color: "#000000",
        confirmButtonColor: "#61090b",
      }).then(() => navigate("/"));
    } catch (error) {
      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: error.response?.data?.message || "Authentication failed.",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonColor: "#61090b",
      });
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending request with credentials:", credentials);
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials
      );

      console.log("Received response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored in localStorage:", response.data.token);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${response.data.user.firstName}!`,
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response
          ? error.response.data.message
          : "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Visuals */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg">Log in to access your fashion world.</p>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Google Sign-In Button Container */}
          <div className="flex items-center justify-center mt-4">
            <div id="google-signin-btn"></div>
          </div>

          <p className="mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
