const db = require("../config/db");
const xlsx = require("xlsx");
const fs = require("fs");

// Get all customers

// Helper to validate email format

const getCustomers = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const bulkUploadCustomers = async (req, res, next) => {
  try {
    const allData = req.bulkData;
    const totalRecords = allData.length;

    // Iterate over each record and insert into the customers table
    for (const record of allData) {
      const {
        "Customer Name": name,
        "Contact Number": contact,
        Email: email,
        "Outstanding Amount": outstanding_payment,
        "Payment Due Date": payment_due_date,
        "Payment Status": payment_status,
      } = record;

      await db.query(
        "INSERT INTO customers (name, contact, outstanding_payment, payment_due_date, payment_status) VALUES ($1, $2, $3, $4, $5)",
        [name, email, outstanding_payment, payment_due_date, payment_status]
      );
    }

    res.json({
      message: `Processed ${totalRecords} records from ${req.files.length} file(s).`,
      data: allData,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new customer
const createCustomer = async (req, res, next) => {
  try {
    const {
      name,
      contact,
      outstanding_payment,
      payment_due_date,
      payment_status,
    } = req.body;
    const customerResult = await db.query(
      "INSERT INTO customers (name, contact, outstanding_payment, payment_due_date, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, contact, outstanding_payment, payment_due_date, payment_status]
    );

    const customerId = customerResult.rows[0].id;

    // Create payment record
    const paymentResult = await db.query(
      "INSERT INTO payments (customer_id, payment_date, payment_amount, payment_method, payment_status, transaction_id, payment_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        customerId,
        payment_due_date, // payment_date
        outstanding_payment, // payment_amount
        "Online Payment Services", // payment_method
        payment_status, // payment_status
        "INITIAL_PAYMENT_" + customerId, // transaction_id
        "one-time", // payment_type
      ]
    );
    res.status(201).json(customerResult.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update an existing customer
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact,
      outstanding_payment,
      payment_due_date,
      payment_status,
    } = req.body;
    const result = await db.query(
      "UPDATE customers SET name = $1, contact = $2, outstanding_payment = $3, payment_due_date = $4, payment_status = $5 WHERE id = $6 RETURNING *",
      [name, contact, outstanding_payment, payment_due_date, payment_status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update payment record
    const paymentResult = await db.query(
      "UPDATE payments SET payment_date = $1, payment_amount = $2, payment_status = $3 WHERE customer_id = $4 RETURNING *",
      [payment_due_date, outstanding_payment, payment_status, id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: "payment record  not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete a customer
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM customers WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getUploadTemplate = async (req, res, next) => {
  try {
    const headers = [
      "Customer Name",
      "Contact Number",
      "Email",
      "Outstanding Amount",
      "Payment Due Date",
      "Payment Status",
    ];
    const data = [headers];
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "content-Disposition",
      "attachment; filename=customer_upload_template.xlsx"
    );
    res.setHeader(
      "content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkUploadCustomers,
  getUploadTemplate,
};
