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
import ProviderBookings from "./pages/ProviderBookings.js/ProviderBookings";
import Location from "./pages/Location/Location";
import Chat from "./components/Chat";
import ErrorPage from "./components/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/provider-login" element={<LoginProvider />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/providers/:service" element={<Providers />} />
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
