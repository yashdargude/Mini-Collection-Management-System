const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkUploadCustomers,
  getUploadTemplate,
  getCustomerByID,
} = require("../controllers/customerController");

const { authenticateToken } = require("../middleware/authMiddleware");
const { createCustomerValidator } = require("../validators/customerValidators");
const { validate } = require("../middleware/validateMiddleware");
const {
  validateFileUpload,
  validateBulkUploadData,
} = require("../validators/customerBulkUploadValidator");

router.get("/", authenticateToken, getCustomers);
router.get("/${selectedCustomerId}", authenticateToken, getCustomerByID);

router.post(
  "/",
  authenticateToken,
  createCustomerValidator,
  validate,
  createCustomer
);

router.put("/:id", authenticateToken, updateCustomer);
router.delete("/:id", authenticateToken, deleteCustomer);

router.post(
  "/upload",
  authenticateToken,
  upload.array("files"),
  validateFileUpload,
  validateBulkUploadData,
  bulkUploadCustomers
);

router.get("/template", authenticateToken, getUploadTemplate);

module.exports = router;
