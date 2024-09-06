import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Bars } from "react-loader-spinner"; // You can choose any other loader component
import BookingModal from "../Booking/Booking"; // Adjust the path as needed
import Header from "../../components/Header";
import Cookies from "js-cookie";

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { service } = useParams(); // Get the service from URL parameters
  // const [selectedProviderId, setSelectedProviderId] = useState(null);
  // const [bookingDate, setBookingDate] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3300/api/v1/serviceprovider/service/${service}`
        );
        setProviders(data.serviceProviders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProviders();
  }, [service]);

  const handleBooking = async (serviceProviderId) => {
    try {
      const bookingDate = new Date();
      
      const response = await axios.post(
        "http://localhost:3300/api/v1/booking/book",
        {
          serviceProviderId,
          bookingDate,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log(response);
      setMessage(response.data.message);
      navigate(`/location`);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error booking service");
      setMessage("");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Bars
          height="80"
          width="80"
          color="#5ab9c1"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-12"></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <motion.div
              key={provider.id}
              className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-lg ${
                provider.availabilitystatus === "available" ? "" : "opacity-60"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {provider.photo ? (
                    <img
                      src={provider.photo}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-6xl text-gray-400" />
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-3">{provider.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Rating: {provider.avgRating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600 mb-4">{provider.service}</p>
              <p
                className={`text-sm ${
                  provider.availabilitystatus === "available"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {provider.availabilitystatus === "available"
                  ? "Available"
                  : "Not Available"}
              </p>
              <button
                className={`px-6 py-2 text-white rounded-md ${
                  provider.availabilitystatus === "available"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={provider.availabilitystatus !== "available"}
                onClick={() => handleBooking(provider.id)}
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
        {/* {selectedProviderId && (
          <BookingModal
            serviceProviderId={selectedProviderId}
            onClose={closeModal}
          />
        )} */}
      </div>
    </>
  );
}

export default Providers;
