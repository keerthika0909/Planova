import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const response = await axios.get(
  `${API_URL}/api/users`
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;