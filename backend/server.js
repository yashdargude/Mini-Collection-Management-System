require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { Server } = require("socket.io");
const logger = require("logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);

// Root endpoint
app.get("/", (req, res) =>
  res.send("Mini Collection Management System Backend")
);

// Socket.io for real-time notifications
io.on("connection", (socket) => {
  console.log("a user connected");
  logger.info("a user connected");
  // Example event: emit a notification to connected client(s)
  socket.on("disconnect", () => {
    console.log("user disconnected");
    logger.info("user disconnected");
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
