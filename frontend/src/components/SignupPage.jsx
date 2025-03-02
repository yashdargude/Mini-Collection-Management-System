import React, { useState } from "react";
import { register } from "../Utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await register({
        username,
        password,
        email,
        confirmPassword,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 h-full w-full object-cover opacity-30"
        src="/bg4.mp4"
      ></video>

      <Card className="relative z-10 w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 text-white shadow-2xl">
        <h2 className="mb-4 text-center text-3xl font-extrabold italic tracking-wider text-white">
          Join Us Now
        </h2>
        <p className="mb-6 text-center text-sm italic text-gray-300">
          Create an account and unlock exclusive features!
        </p>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300" htmlFor="username">
                Username
              </Label>
              <Input
                className="rounded-lg bg-gray-800 text-white placeholder-gray-400"
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="John Doe"
                autoComplete="username"
              />
            </div>
            <div>
              <Label className="text-gray-300" htmlFor="email">
                Email
              </Label>
              <Input
                className="rounded-lg bg-gray-800 text-white placeholder-gray-400"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-gray-300" htmlFor="password">
                Password
              </Label>
              <Input
                className="rounded-lg bg-gray-800 text-white placeholder-gray-400"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label className="text-gray-300" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                className="rounded-lg bg-gray-800 text-white placeholder-gray-400"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="********"
                autoComplete="new-password"
              />
            </div>
            {error && (
              <div className="text-xs italic text-red-500">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 py-2 font-bold text-white shadow-md hover:opacity-90"
            >
              Sign Up
            </Button>
            <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
