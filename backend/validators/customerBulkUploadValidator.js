//// filepath: /Users/yashdargude/Desktop/project/mini_manage/backend/validators/customerBulkUploadValidator.js
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ errors: [{ msg: "No file uploaded" }] });
  }

  const allowedExtensions = [".xlsx", ".xls"];
  const invalidFiles = req.files.filter((file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    return !allowedExtensions.includes(ext);
  });

  if (invalidFiles.length > 0) {
    return res.status(400).json({
      errors: [
        { msg: "Invalid file type uploaded. Only Excel files are allowed." },
      ],
    });
  }

  next();
};

const REQUIRED_FIELDS = [
  "Customer Name",
  "Contact Number",
  "Email",
  "Outstanding Amount",
  "Payment Due Date",
  "Payment Status",
];

const validateExtractedData = (data) => {
  const errors = [];
  data.forEach((row, index) => {
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      return !row[field] || row[field].toString().trim() === "";
    });
    if (missingFields.length > 0) {
      errors.push({
        row: index + 1,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
  });

  return errors;
};

const validateBulkUploadData = (req, res, next) => {
  try {
    let aggregatedData = [];

    req.files.forEach((file) => {
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      aggregatedData = aggregatedData.concat(jsonData);
      // Remove the temporary file immediately
      fs.unlinkSync(file.path);
    });

    const errors = validateExtractedData(aggregatedData);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation errors in the uploaded data",
        errors,
      });
    }

    // Attach the validated data to req for use in the controller
    req.bulkData = aggregatedData;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateFileUpload,
  validateExtractedData,
  validateBulkUploadData,
};
