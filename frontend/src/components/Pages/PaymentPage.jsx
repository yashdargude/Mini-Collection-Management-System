import React, { useState, useEffect } from "react";
import {
  getCustomers,
  processPayment,
  updatePaymentStatus,
} from "../../Utils/api";
import axios from "axios";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`/customers/${selectedCustomerId}`);
        const customer = response.data;
        setAmount(customer.outstanding_payment);
        setPaymentStatus(customer.payment_status);
      } catch (error) {
        console.error("Error fetching customer details", error);
      }
    };

    if (selectedCustomerId) {
      fetchCustomerDetails();
    }
  }, [selectedCustomerId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await processPayment({
        customer_id: selectedCustomerId,
        amount,
      });
      console.log(response.data);
      setPaymentStatus("completed");
    } catch (error) {
      console.error(error);
      setError("Failed to process payment");
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
    <div className="container mx-auto mt-10 rounded-lg bg-indigo-400 p-6 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Payment Page</h1>
      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-lg font-medium">Customer:</label>
          <select
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium">Amount:</label>
          <input
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={amount}
            placeholder="add amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium">
            Payment Status:
          </label>
          <input
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={paymentStatus}
            placeholder="status"
            onChange={(e) => setPaymentStatus(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex space-x-4">
          <button
            className="w-full rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
            onClick={handlePayment}
          >
            Make Payment
          </button>
          <button
            className="w-full rounded bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-700"
            onClick={handleUpdatePaymentStatus}
          >
            Update Payment Status
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link to="/customers">
          <button className="rounded bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-700">
            Go to Customer Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
