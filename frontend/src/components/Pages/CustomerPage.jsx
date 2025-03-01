import React, { useState, useEffect } from "react";
import {
  getCustomers,
  updateCustomer,
  createCustomer,
  deleteCustomer,
} from "../../Utils/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    outstanding_payment: 0,
    payment_due_date: "",
    payment_status: "pending",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    };
    fetchCustomers();
  }, []);

  const handleUpdateCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer({});
    setShowModal(true);
  };

  const handleSaveCustomer = async () => {
    try {
      const outstandingPayment = parseFloat(newCustomer.outstanding_payment);
      if (isNaN(outstandingPayment)) {
        setError("Outstanding payment must be a number");
        return;
      }
      const customerData = {
        ...newCustomer,
        outstanding_payment: outstandingPayment,
      };
      const response = await createCustomer(customerData);
      setCustomers([...customers, response.data]);
      setShowModal(false);
      setNewCustomer({
        name: "",
        contact: "",
        outstanding_payment: 0,
        payment_due_date: "",
        payment_status: "pending",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to create customer");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const outstandingPayment = parseFloat(
        selectedCustomer.outstanding_payment,
      );
      if (isNaN(outstandingPayment)) {
        setError("Outstanding payment must be a number");
        return;
      }
      const customerData = {
        ...selectedCustomer,
        outstanding_payment: outstandingPayment,
      };
      const response = await updateCustomer(selectedCustomer.id, customerData);
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id ? response.data : customer,
        ),
      );
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to update customer");
    }
  };

  return (
    <div>
      <h2>Customers</h2>
      <Button variant="primary" onClick={handleAddCustomer}>
        Add Customer
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact Information</th>
            <th>Outstanding Payment Amount</th>
            <th>Payment Due Date</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.contact}</td>
              <td>{customer.outstanding_payment}</td>
              <td>{customer.payment_due_date}</td>
              <td>{customer.payment_status}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateCustomer(customer)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCustomer.id ? "Update Customer" : "Add Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedCustomer.name || newCustomer.name}
                onChange={(e) =>
                  selectedCustomer.id
                    ? setSelectedCustomer({
                        ...selectedCustomer,
                        name: e.target.value,
                      })
                    : setNewCustomer({
                        ...newCustomer,
                        name: e.target.value,
                      })
                }
              />
            </Form.Group>
            <Form.Group controlId="contact">
              <Form.Label>Contact Information</Form.Label>
              <Form.Control
                type="email"
                value={selectedCustomer.contact || newCustomer.contact}
                onChange={(e) =>
                  selectedCustomer.id
                    ? setSelectedCustomer({
                        ...selectedCustomer,
                        contact: e.target.value,
                      })
                    : setNewCustomer({
                        ...newCustomer,
                        contact: e.target.value,
                      })
                }
              />
            </Form.Group>
            <Form.Group controlId="outstanding_payment">
              <Form.Label>Outstanding Payment Amount</Form.Label>
              <Form.Control
                type="number"
                value={
                  selectedCustomer.outstanding_payment ||
                  newCustomer.outstanding_payment
                }
                onChange={(e) =>
                  selectedCustomer.id
                    ? setSelectedCustomer({
                        ...selectedCustomer,
                        outstanding_payment: e.target.value,
                      })
                    : setNewCustomer({
                        ...newCustomer,
                        outstanding_payment: e.target.value,
                      })
                }
              />
            </Form.Group>
            <Form.Group controlId="payment_due_date">
              <Form.Label>Payment Due Date</Form.Label>
              <Form.Control
                type="date"
                value={
                  selectedCustomer.payment_due_date ||
                  newCustomer.payment_due_date
                }
                onChange={(e) =>
                  selectedCustomer.id
                    ? setSelectedCustomer({
                        ...selectedCustomer,
                        payment_due_date: e.target.value,
                      })
                    : setNewCustomer({
                        ...newCustomer,
                        payment_due_date: e.target.value,
                      })
                }
              />
            </Form.Group>
            <Form.Group controlId="payment_status">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={
                  selectedCustomer.payment_status || newCustomer.payment_status
                }
                onChange={(e) =>
                  selectedCustomer.id
                    ? setSelectedCustomer({
                        ...selectedCustomer,
                        payment_status: e.target.value,
                      })
                    : setNewCustomer({
                        ...newCustomer,
                        payment_status: e.target.value,
                      })
                }
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              selectedCustomer.id ? handleSaveChanges : handleSaveCustomer
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerPage;
