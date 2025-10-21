import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 gap-8">
      <h1 className="text-4xl font-bold text-indigo-700">Welcome to Talkify</h1>
      <p className="text-gray-700 text-center max-w-md">
        Connect with your friends instantly! One-on-one private chat at your fingertips.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
