// App.jsx

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Pages/Home";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage";
import CustomerPage from "./components/Pages/CustomerPage";
import PaymentPage from "./components/Pages/PaymentPage";

import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/customers"
          element={<PrivateRoute element={CustomerPage} />}
        />
        <Route
          path="/payment"
          element={<PrivateRoute element={PaymentPage} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
