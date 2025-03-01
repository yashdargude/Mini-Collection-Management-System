import React, { useState, useEffect } from "react";
import {
  getCustomers,
  processPayment,
  updatePaymentStatus,
} from "../../Utils/api";
import axios from "axios";

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
    <div>
      <h1>Payment Page</h1>
      <form>
        <label>Customer:</label>
        <select
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
        <br />
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <label>Payment Status:</label>
        <input
          type="text"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        />
        <br />
        {error && <div className="error">{error}</div>}
        <button onClick={handlePayment}>Make Payment</button>
        <button onClick={handleUpdatePaymentStatus}>
          Update Payment Status
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
