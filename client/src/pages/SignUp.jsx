import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

// Yup Schema
const schema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  number: yup.string().required("Mobile number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // -----------------------------
  // 1. LOAD GOOGLE IDENTITY SCRIPT
  // -----------------------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "268942872776-ulvhmack82ul53133h6fkdd4f7ehnsgb.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"), // Container ID
        {
          theme: "outline",
          size: "large",
          text: "signup_with",
          shape: "pill",
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  // -----------------------------
  // 2. GOOGLE SIGN-UP FUNCTION
  // -----------------------------
  const handleGoogleLogin = async (googleResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential: googleResponse.credential },
        { withCredentials: true }
      );

      console.log("Google login response data:", res.data);

      // If token is returned, save it to localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "Access Granted",
        text: "You've successfully accessed EliteFit",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonColor: "#61090b",
      }).then(() => navigate("/"));
    } catch (error) {
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

  // -----------------------------
  // 3. REGULAR SIGN-UP SUBMIT
  // -----------------------------
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        data
      );

      // If a token is returned, store it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: response.data.message,
        confirmButtonText: "Login Now",
      }).then(() => navigate("/"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text:
          error.response?.data?.message || "An error occurred during signup.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // 4. RENDER COMPONENT
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Visuals */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 p-10 text-white flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to EliteFit</h1>
          <p className="text-lg mb-4">
            Join the ultimate fashion destination and explore the latest trends.
          </p>
        </div>

        {/* Right Section - Sign-Up Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  {...register("number")}
                  placeholder="Mobile Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.number && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.number.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Google Sign-Up Button Container */}
          <div className="flex items-center justify-center mt-6">
            <div id="google-signin-btn"></div>
          </div>

          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
