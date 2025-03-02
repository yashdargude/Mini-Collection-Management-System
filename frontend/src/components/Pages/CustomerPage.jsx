import { useState, useEffect } from "react";
import {
  getCustomers,
  updateCustomer,
  createCustomer,
  getUploadTemplate,
} from "../../Utils/api";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UploadModal from "./UploadModal";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Dialog } from "../ui/dialog";
import Notify from "./Notification";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    outstanding_payment: 0,
    payment_due_date: "",
    payment_status: "pending",
  });
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [username, setusername] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setusername(storedUsername);
    }
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
    setIsDialogOpen(true); // Ensure the dialog opens when clicking "Update"

    setShowModal(true);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer({});
    setShowModal(true);
  };

  const handleSaveCustomer = async () => {
    try {
      if (!newCustomer.name || !newCustomer.contact) {
        setError("Name and Contact are required.");
        return;
      }

      const outstandingPayment = parseFloat(newCustomer.outstanding_payment);
      if (isNaN(outstandingPayment)) {
        setError("Outstanding payment must be a number.");
        return;
      }

      const customerData = {
        ...newCustomer,
        outstanding_payment: outstandingPayment || 0,
      };

      console.log("Sending customer data to backend:", customerData);

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
      console.error("Error creating customer:", error);
      setError("Failed to create customer");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewCustomer(() => {
      const updatedState = { ...newCustomer, [name]: value };
      console.log("Updated newCustomer state:", updatedState);
      return updatedState;
    });
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
      Notify("Customer updated successfully", "success");
      setIsDialogOpen(false); // Close dialog after saving

      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to update customer");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    <div className="container relative mx-auto mt-4 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-blue-800 p-4 text-white shadow-md">
      {" "}
      <h1 className="relative text-center text-4xl font-extrabold text-white">
        <span className="relative z-10">Customers Management Portal</span>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-blue-500 opacity-70 blur-md">
          Customers Management Portal
        </span>
      </h1>
      <div className="space bg- absolute right-4 top-4 float-end mb-4 flex flex-col items-end space-y-2">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
          <p className="whitespace-nowrap">{username}</p>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <Button
          className="rounded-md bg-red-500 px-2 py-0.5 text-xs hover:bg-red-600"
          variant="danger"
          onClick={handlelogout}
        >
          Logout
        </Button>
      </div>
      <div className="align-center m-auto mb-4 mt-12 flex">
        <div className="flex items-center">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={inputRef}
          />
        </div>
      </div>
      <div className="mt-10 rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
          Upload Your Excel Files 📂
        </h3>
        <div className="">
          <UploadModal getCustomers={getCustomers} />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-300">
            Don't have a template? Get started easily!
          </span>
          <button
            className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow transition duration-300 hover:scale-100 hover:from-blue-600 hover:to-indigo-600"
            onClick={handleDownloadTemplate}
          >
            📥 Download Template
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="overflow-x-auto rounded-lg border border-gray-500 shadow-lg">
        <Table>
          <TableCaption>Manage your customers efficiently.</TableCaption>

          {/* Table Header */}
          <TableHeader className="bg-gray-800 text-white">
            <TableRow>
              <TableHead className="p-3 text-center text-lg font-semibold">
                ID
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Name
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Contact
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Outstanding Payment
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Payment Due Date
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Status
              </TableHead>
              <TableHead className="p-3 text-center text-lg font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="bg-gray-700 text-gray-200">
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="items-center justify-center transition hover:bg-gray-600"
              >
                <TableCell className="border border-gray-500 p-3 text-center">
                  {customer.id}
                </TableCell>
                <TableCell className="border border-gray-500 p-3 text-center">
                  {customer.name}
                </TableCell>
                <TableCell className="border border-gray-500 p-3 text-center">
                  {customer.contact}
                </TableCell>
                <TableCell className="border border-gray-500 p-3 text-center">
                  ${customer.outstanding_payment}
                </TableCell>
                <TableCell className="border border-gray-500 p-3 text-center">
                  {formatDate(customer.payment_due_date)}
                </TableCell>
                <TableCell
                  className={`border border-gray-500 p-3 text-center font-bold ${
                    customer.payment_status === "Paid"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {customer.payment_status}
                </TableCell>
                <TableCell className="border border-gray-500 p-3 text-center">
                  <Button
                    variant="primary"
                    className="transform rounded-sm bg-[#000000] px-3 py-1.5 font-light text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#1E40AF] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#93C5FD] active:scale-95"
                    onClick={() => handleUpdateCustomer(customer)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog for Editing Customer */}
        {selectedCustomer && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogDescription>
                  Modify customer details. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={selectedCustomer.name}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    value={selectedCustomer.contact}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        contact: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="outstanding_payment" className="text-right">
                    Outstanding
                  </Label>
                  <Input
                    id="outstanding_payment"
                    type="number"
                    value={selectedCustomer.outstanding_payment}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        outstanding_payment: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment_due_date" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="payment_due_date"
                    type="date"
                    value={selectedCustomer.payment_due_date}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        payment_due_date: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <DialogFooter>
                <Button onClick={handleSaveChanges}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* this section is for the add new customer */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={newCustomer.name || ""}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input
                id="contact"
                name="contact"
                type="email" // Changed from "mail" to "email"
                value={newCustomer.contact || ""}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    contact: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="outstanding_payment" className="text-right">
                Outstanding Payment
              </Label>
              <Input
                id="outstanding_payment"
                name="outstanding_payment"
                type="number"
                value={newCustomer.outstanding_payment || ""}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    outstanding_payment: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment_due_date" className="text-right">
                Due Date
              </Label>
              <Input
                id="payment_due_date"
                name="payment_due_date"
                type="date"
                value={newCustomer.payment_due_date || ""}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    payment_due_date: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button onClick={handleSaveCustomer}>Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCustomer.id ? "Update Customer" : "Add Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
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
