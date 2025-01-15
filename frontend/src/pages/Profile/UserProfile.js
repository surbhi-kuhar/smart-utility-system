import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/Header";

const UserProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "https://smart-utility-system.onrender.com/api/v1/user/find",
          // `http://localhost:3300/api/v1/user/find`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        console.log(response);
        const userData = response.data.user;
        setProfileData({
          name: userData.name,
          email: userData.email,
          mobilenumber: userData.mobilenumber,
          address: userData.address,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch profile data"
        );
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.post(
        'https://smart-utility-system.onrender.com/api/v1/user/update',
        // `http://localhost:3300/api/v1/user/update`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log(data);
      setEditMode(false);
      alert("Profile updated successfully!");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        "https://smart-utility-system.onrender.com/api/v1/user/delete",
        // `http://localhost:3300/api/v1/user/delete`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Clear the token from cookies
      Cookies.remove("token");

      alert("Account deleted successfully!");
      navigate("/signup"); // Redirect to home after deletion
      window.location.reload(); // Reload the page to update the header
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            User Profile
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-600">{errorMessage}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number:
              </label>
              <input
                type="text"
                name="mobilenumber"
                value={profileData.mobilenumber}
                onChange={handleInputChange}
                disabled={!editMode}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!editMode}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            {editMode ? (
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
