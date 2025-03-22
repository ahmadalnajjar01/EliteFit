import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Get token from localStorage

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
        withCredentials: true,
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Profile Fetch Error:", err));
  }, []);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex flex-col items-center">
          {/* User Profile Icon */}
          <UserCircle className="w-24 h-24 text-gray-600 mb-4" />

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600 text-lg mb-6">{user.email}</p>

          {/* Profile Info Section */}
          <div className="w-full border-t border-gray-300 pt-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Profile Information
            </h3>
            <div className="text-left text-gray-600">
              <p className="mb-2">
                <strong>First Name:</strong> {user.firstName}
              </p>
              <p className="mb-2">
                <strong>Last Name:</strong> {user.lastName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
