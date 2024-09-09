import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Bars } from "react-loader-spinner"; // You can choose any other loader component
import Cookies from "js-cookie";

function Location() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const locationState = useLocation().state; // Access the state passed during navigation
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true); // For managing loading state
  const [pollAttempts, setPollAttempts] = useState(0); // Keep track of polling attempts
  const MAX_ATTEMPTS = 5; // Set the maximum polling attempts

  useEffect(() => {
    let interval; // Declare the interval to be cleared later

    const fetchProviderLocation = async () => {
      try {
        if (!locationState || !locationState.bookingId) {
          setError("Booking ID not found.");
          return;
        }

        const bookingId = locationState.bookingId;
        const token = Cookies.get("token");

        const bookingResponse = await axios.get(
          `http://localhost:3300/api/v1/booking/getbooking`,
          {
            params: { bookingId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(bookingResponse);

        const { latitude, longitude } = bookingResponse.data.booking;

        if (latitude && longitude) {
          // Stop polling after getting the location
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setLoading(false);

          // Clear interval to stop further polling
          clearInterval(interval);

          // Check if the address is already fetched to avoid unnecessary API calls
          if (!address) {
            const apiKey = "pk.3687b6d15643499519168bf1c0e1e7df"; // Replace with your API key
            const geocodeUrl = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;
            const locationResponse = await axios.get(geocodeUrl);

            console.log(locationResponse);

            if (locationResponse.data.display_name) {
              setAddress(locationResponse.data.display_name);
            } else {
              setError("Failed to get the address from the coordinates.");
            }
          }
        } else {
          // Poll only if location is not available and attempts are within limit
          if (pollAttempts < MAX_ATTEMPTS) {
            setPollAttempts(pollAttempts + 1);
          } else {
            setError("Location not shared yet.");
            setLoading(false);
            clearInterval(interval); // Stop polling if maximum attempts reached
          }
        }
      } catch (err) {
        setError("Error fetching location data.");
        setLoading(false);
        clearInterval(interval); // Stop polling on error
      }
    };

    // Poll the backend every 5 seconds to check if location is available
    interval = setInterval(() => {
      fetchProviderLocation();
    }, 5000);

    // Clear the interval after the component is unmounted or polling stops
    return () => clearInterval(interval);
  }, [locationState, pollAttempts, address]);

  if (loading && !error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Bars height="80" width="80" color="#5ab9c1" ariaLabel="bars-loading" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Provider Location</h2>
      <p className="text-lg text-center">{location}</p>
      {address && <p className="text-lg text-center">Address: {address}</p>}
    </div>
  );
}

export default Location;
