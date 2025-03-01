import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Set up Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Authentication APIs
export const register = (userData) => {
  return api.post("/auth/register", userData);
};

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  const { token } = response.data;
  localStorage.setItem("token", token);
  return response;
};

// Customer Management APIs
export const getCustomers = () => {
  const token = localStorage.getItem("token");
  const authorization = token || "";
  return api.get("/customers", { authorization });
};

export const createCustomer = (customerData) => {
  return api.post("/customers", customerData);
};

export const updateCustomer = (id, customerData) => {
  return api.put(`/customers/${id}`, customerData);
};

export const deleteCustomer = (id) => {
  return api.delete(`/customers/${id}`);
};

export const bulkUploadCustomers = (formData) => {
  return api.post("/customers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUploadTemplate = () => {
  return api.get("/customers/template", { responseType: "blob" });
};

// Payment Management APIs
export const updatePaymentStatus = (id, status) => {
  return api.put(`/payments/${id}/status`, { status });
};

export const processPayment = () => {
  return api.post("/payments");
};
