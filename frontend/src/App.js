import Login from "./pages/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import CustomerSignup from "./pages/Signup/CustomerSignup";
import ServiceProviderSignup from "./pages/Signup/ServiceProviderSignup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signup-cust" element={<CustomerSignup />}></Route>
          <Route
            path="/signup-service"
            element={<ServiceProviderSignup />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
