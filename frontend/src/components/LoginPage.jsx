// components/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { authApi } from "../Utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await authApi.login({ email, password });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-lg font-bold">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
          />
        </div>
        {error && (
          <div className="mb-4 text-xs italic text-red-500">{error}</div>
        )}
        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
