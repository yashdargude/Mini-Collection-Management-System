// frontend/src/utils/api.js
import axios from "axios";

const API_URL = "http://localhost:5001/api"; // update this to your backend API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = {
  signup: async (data) => {
    try {
      const response = await api.post("/auth/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { authApi };
