const express = require("express");
const router = express.Router();
const { updatePaymentStatus } = require("../controllers/paymentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.put("/:id/status", authenticateToken, updatePaymentStatus);

// Additional mock payment endpoint to simulate processing
router.post("/", authenticateToken, (req, res) => {
  // Simulate payment processing logic here
  res.status(200).json({ message: "Payment processed" });
});

module.exports = router;
