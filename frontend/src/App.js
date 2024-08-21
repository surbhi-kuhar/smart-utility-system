import Login from "./pages/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Providers from "./pages/Providers/Providers";
import UserProfile from "./pages/Profile/UserProfile";
import ServiceProviderProfile from "./pages/Profile/ServiceProviderProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/providers/:service" element={<Providers />} />
          <Route path="/profile/user" element={<UserProfile />} />
          <Route path="/profile/provider" element={<ServiceProviderProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
