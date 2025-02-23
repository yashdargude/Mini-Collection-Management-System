//// filepath: /Users/yashdargude/Desktop/project/mini_manage/backend/validators/customerValidators.js
const { body } = require("express-validator");

const createCustomerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("contact").isEmail().withMessage("Contact must be a valid email"),
  body("outstandingPayment")
    .isNumeric()
    .withMessage("Outstanding payment must be numeric"),
  body("paymentDueDate")
    .isDate()
    .withMessage("Payment due date must be a valid date"),
  body("paymentStatus")
    .isIn(["completed", "pending"])
    .withMessage("Payment status must be either 'completed' or 'pending'"),
];

module.exports = {
  createCustomerValidator,
};
