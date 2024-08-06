// src/SignupPage.js
import React, { useState } from "react";
import customerImage from "../../images/customer.png"; // adjust the path as necessary
import serviceProviderImage from "../../images/service-provider-image.png"; // adjust the path as necessary

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-8">
        {selectedRole === null ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="mt-2 text-gray-600">Choose your role to continue</p>
            </div>
            <div className="flex flex-col md:flex-row justify-around items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col items-center space-y-4">
                <img src={customerImage} alt="Customer" className="h-24 w-24" />
                <button
                  onClick={() => handleRoleSelect("customer")}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up as Customer
                </button>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={serviceProviderImage}
                  alt="Service Provider"
                  className="h-24 w-24"
                />
                <button
                  onClick={() => handleRoleSelect("service-provider")}
                  className="py-2 px-4 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Sign Up as Service Provider
                </button>
              </div>
            </div>
          </>
        ) : selectedRole === "customer" ? (
          <CustomerSignupForm />
        ) : (
          <ServiceProviderSignupForm />
        )}
      </div>
    </div>
  );
};

const CustomerSignupForm = () => {
  return (
    <form className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">Customer Sign Up</h3>
        <p className="mt-1 text-gray-600">Please fill in the details below.</p>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password <span className="text-red-600">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="mobile"
          className="block text-sm font-medium text-gray-700"
        >
          Mobile Number <span className="text-red-600">*</span>
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          pattern="[0-9]{10}"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address <span className="text-red-600">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign Up
      </button>
    </form>
  );
};

const ServiceProviderSignupForm = () => {
  return (
    <form className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">
          Service Provider Sign Up
        </h3>
        <p className="mt-1 text-gray-600">Please fill in the details below.</p>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password <span className="text-red-600">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age <span className="text-red-600">*</span>
        </label>
        <input
          id="age"
          name="age"
          type="number"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address <span className="text-red-600">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="service"
          className="block text-sm font-medium text-gray-700"
        >
          Service <span className="text-red-600">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select a Service</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Painting">Painting</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Appliance Repair">Appliance Repair</option>
          <option value="HVAC Services">HVAC Services</option>
          <option value="Pest Control">Pest Control</option>
          <option value="Gardening & Landscaping">
            Gardening & Landscaping
          </option>
          <option value="Beauty & Wellness">Beauty & Wellness</option>
          <option value="Fitness Training">Fitness Training</option>
          <option value="Tutoring">Tutoring</option>
        </select>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="mobile"
          className="block text-sm font-medium text-gray-700"
        >
          Mobile Number <span className="text-red-600">*</span>
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          pattern="[0-9]{10}"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;