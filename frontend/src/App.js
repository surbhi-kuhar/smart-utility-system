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
          <Route path="/profile/user" element={<UserProfile />} />
          <Route
            path="/profile/provider"
            element={<ServiceProviderProfile />}
          />
          <Route path="/booking" element={<BookingPage />}></Route>
          <Route path="/bookings" element={<FetchBookings />}></Route>
          <Route path="/provider-bookings" element={<ProviderBookings />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
