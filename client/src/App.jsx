import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import LandingPage from "./pages/LandingPage";

function App() {
  const token = localStorage.getItem("token");

  return (

     
      <Routes>
          <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
      
  );
}

export default App;
