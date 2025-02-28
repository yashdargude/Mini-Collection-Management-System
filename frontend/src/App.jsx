// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Pages/Home";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
