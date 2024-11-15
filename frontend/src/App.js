import Login from "./pages/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Providers from "./pages/Providers/Providers";
import UserProfile from "./pages/Profile/UserProfile";
import ServiceProviderProfile from "./pages/Profile/ServiceProviderProfile";
import BookingPage from "./pages/Booking/Booking";
import FetchBookings from "./pages/Booking/FetchBookings";
import LoginProvider from "./pages/Login/LoginProvider";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import ProviderBookings from "./pages/ProviderBookings.js/ProviderBookings";
import Location from "./pages/Location/Location";
import Chat from "./components/Chat";
import ErrorPage from "./components/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    // Check if service workers are supported in the browser
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/provider-login" element={<LoginProvider />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/error" element={<ErrorPage />} />

          <Route
            path="/profile/user"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/providers/:service"
            element={
              <ProtectedRoute>
                <Providers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/provider"
            element={
              <ProtectedRoute>
                <ServiceProviderProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <FetchBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider-bookings"
            element={
              <ProtectedRoute>
                <ProviderBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location"
            element={
              <ProtectedRoute>
                <Location />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
