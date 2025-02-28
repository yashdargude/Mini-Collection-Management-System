const db = require("../config/db");

// Update payment status for a customer
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    const result = await db.query(
      "UPDATE customers SET payment_status = $1 WHERE id = $2 RETURNING *",
      [payment_status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { updatePaymentStatus };
