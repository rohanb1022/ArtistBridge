import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:3000/api", // optional: use if calling an external API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies
});

export default api;
