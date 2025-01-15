import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ProviderHeader from "../../components/ProviderHeader";

const ServiceProviderProfile = ({ serviceProviderId }) => {
  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const serviceOptions = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Painting",
    "Carpentry",
    "Appliance Repair",
    "HVAC Services",
    "Pest Control",
    "Gardening & Landscaping",
    "Beauty & Wellness",
    "Fitness Training",
    "Tutoring",
  ];

  const availabilityOptions = ["available", "not available"];

  useEffect(() => {
    // Fetch service provider profile data
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "https://smart-utility-system.onrender.com/api/v1/serviceprovider/find",
          // `http://localhost:3300/api/v1/serviceprovider/find`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        console.log(response.data);
        setProfileData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [serviceProviderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    setErrorMessage(""); // Reset error message
    try {
      await axios.post(
        "https://smart-utility-system.onrender.com/api/v1/serviceprovider/update",
        // `http://localhost:3300/api/v1/serviceprovider/update`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.message || "Error updating profile"
      );
    }
  };

  const handleDelete = async () => {
    setErrorMessage(""); // Reset error message
    try {
      await axios.delete(
        "https://smart-utility-system.onrender.com/api/v1/serviceprovider/delete",
        // `http://localhost:3300/api/v1/serviceprovider/delete`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      alert("Account deleted successfully!");
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage(
        error.response?.data?.message || "Error deleting account"
      );
    }
  };

  return (
    <>
      <ProviderHeader />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Service Provider Profile
          </h2>

          {/* Error message display */}
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
                value={profileData.name || ""}
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
                value={profileData.email || ""}
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
                value={profileData.mobilenumber || ""}
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
                value={profileData.address || ""}
                onChange={handleInputChange}
                disabled={!editMode}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service:
              </label>
              {editMode ? (
                <select
                  name="service"
                  value={profileData.service || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {serviceOptions.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="service"
                  value={profileData.service || ""}
                  disabled
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Availability Status:
              </label>
              {editMode ? (
                <select
                  name="availabilitystatus"
                  value={profileData.availabilitystatus || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {availabilityOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="availabilitystatus"
                  value={profileData.availabilitystatus || ""}
                  disabled
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
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

export default ServiceProviderProfile;
