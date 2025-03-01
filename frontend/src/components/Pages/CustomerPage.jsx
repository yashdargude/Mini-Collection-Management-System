import { useState, useEffect } from "react";
import {
  getCustomers,
  updateCustomer,
  createCustomer,
  deleteCustomer,
  bulkUploadCustomers,
  getUploadTemplate,
} from "../../Utils/api";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await bulkUploadCustomers(formData);
      console.log(response.data);
      setError(null);
      // Optionally, refresh the customer list after upload
      const fetchCustomers = async () => {
        try {
          const response = await getCustomers();
          setCustomers(response.data);
        } catch (err) {
          console.error("Error fetching customers", err);
        }
      };
      fetchCustomers();
    } catch (error) {
      console.error("File upload failed", error);
      setError("File upload failed");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getUploadTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customer_upload_template.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download template", error);
    }
  };

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto mt-4 rounded-lg bg-violet-300 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button className="bg-red-500" variant="danger" onClick={handlelogout}>
          Logout
        </Button>
      </div>

      <Table striped bordered hover className="customer-table">
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
              <td>{formatDate(customer.payment_due_date)}</td>
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
      <div className="mt-4 pt-4">
        <Button
          variant="primary"
          onClick={handleAddCustomer}
          className="mb-4 bg-blue-500"
        >
          Add Customer
        </Button>
      </div>
      <div className="mt-10">
        <h3 className="mb-2 text-xl font-bold">Bulk Upload Customers</h3>
        <Form onSubmit={handleFileUpload}>
          <Form.Group controlId="fileUpload">
            <Form.Label>Upload Excel File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Form>
        {error && <div className="mt-2 text-red-500">{error}</div>}
        <Button variant="link" onClick={handleDownloadTemplate}>
          Download Upload Template
        </Button>
      </div>
      <div className="mt-6 text-center">
        <Link to="/payment">
          <button className="rounded bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-700">
            Go to Payment Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerPage;
