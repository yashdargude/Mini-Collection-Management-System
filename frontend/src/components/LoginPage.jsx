import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../Utils/api";
import Notify from "./Pages/Notification";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log("Login successful:", response.data);
      localStorage.setItem("username", response.data.user);
      Notify("Logged in successfully", "success");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute left-0 top-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/bg4.mp4" type="video/mp4" />
      </video>

      {/* Overlay for Readability */}
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-black bg-opacity-50"></div>

      {/* Login Card */}
      <Card className="relative z-20 w-full max-w-md rounded-2xl border-0 bg-black bg-opacity-90 shadow-lg backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username Input */}
            <div>
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1 w-full border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm font-semibold text-red-500">{error}</div>
            )}

            {/* Login Button */}
            <Button
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              type="submit"
            >
              Login
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-500">
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
