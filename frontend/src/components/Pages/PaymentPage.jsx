import React, { useState, useEffect } from "react";
import {
  getCustomers,
  processPayment,
  updatePaymentStatus,
} from "../../Utils/api";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const PaymentPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Fetch Username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching customers", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        if (!selectedCustomerId) return;
        const response = await axios.get(`/customers/${selectedCustomerId}`);
        const customer = response.data;
        setAmount(customer.outstanding_payment);
        setPaymentStatus(customer.payment_status);
      } catch (error) {
        console.error("Error fetching customer details", error);
      }
    };

    fetchCustomerDetails();
  }, [selectedCustomerId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await processPayment({
        customer_id: selectedCustomerId,
        amount,
      });
      console.log(response.data);
      setPaymentStatus("Completed");
    } catch (error) {
      console.error(error);
      setError("Failed to process payment");
    }
  };

  const handleCustomerSelect = async (value) => {
    setSelectedCustomerId(value); // Update ID first

    try {
      const response = await axios.get(`/customers/${value}`);
      const customer = response.data;

      // Ensure these values are set
      setAmount(customer.outstanding_payment || "");
      setPaymentStatus(customer.payment_status || "");
    } catch (error) {
      console.error("Error fetching customer details", error);
    }
  };

  const handleUpdatePaymentStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePaymentStatus(
        selectedCustomerId,
        paymentStatus,
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to update payment status");
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
        <source src="/bg3.mp4" type="video/mp4" />
      </video>

      {/* Overlay for Readability */}
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-black bg-opacity-50"></div>

      {/* Header with Username & Logout */}
      <div className="absolute right-4 top-4 z-20 flex flex-col items-end space-y-2">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
          <p className="whitespace-nowrap">{username}</p>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <Button
          className="rounded-md bg-red-500 px-2 py-0.5 text-xs hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Card className="relative z-20 w-full max-w-md rounded-2xl border-0 bg-black bg-opacity-90 shadow-lg backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            {/* Customer Selection */}
            <div>
              <Label htmlFor="customer">Customer:</Label>
              <Select
                // onValueChange={(value) => setSelectedCustomerId(value)}
                onValueChange={handleCustomerSelect}
                value={selectedCustomerId || ""}
              >
                <SelectTrigger className="mt-1 w-11/12 items-center">
                  <SelectValue placeholder=" Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount:</Label>
              <Input
                id="amount"
                type="number"
                value={amount || ""}
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-11/12"
              />
            </div>

            {/* Payment Status Input */}
            <div>
              <Label htmlFor="paymentStatus">Payment Status:</Label>
              <Input
                id="paymentStatus"
                type="text"
                value={paymentStatus || ""}
                placeholder="Status"
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mt-1 w-11/12"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm font-semibold text-red-500">{error}</div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handlePayment}
                className="w-full bg-green-500 font-semibold text-white hover:bg-green-600"
              >
                Make Payment
              </Button>
              <Button
                onClick={handleUpdatePaymentStatus}
                className="w-full bg-yellow-500 font-semibold text-white hover:bg-yellow-600"
              >
                Update Payment Status
              </Button>
            </div>
          </form>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <Link to="/customers">
              <Button className="bg-gray-600 font-semibold text-white hover:bg-gray-700">
                Go to Customer Page
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
