import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="absolute right-4 top-4 flex space-x-4">
        <Link to="/login">
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
            Sign In
          </button>
        </Link>
        <Link to="/signup">
          <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
            Sign Up
          </button>
        </Link>
      </div>
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-4xl font-bold">
          Mini Collection Management System
        </h1>
        <p className="mb-8 text-gray-700">
          Manage customer payments and notifications with ease. Real-time
          updates and basic AI integration.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/customers">
            <button className="w-full rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-700">
              Customer Management
            </button>
          </Link>
          <Link to="/payment">
            <button className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
              Payment Management
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-10 text-center">
        <img
          src="https://via.placeholder.com/600x300.png?text=Mini+Collection+Management+System"
          alt="Mini Collection Management System"
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Home;
