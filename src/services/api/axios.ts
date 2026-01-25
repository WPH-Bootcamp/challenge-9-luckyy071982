import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://restaurant-be-400174736012.asia-southeast2.run.app/api",
});

axiosInstance.interceptors.request.use((config) => {
  // Cek apakah Anda menyimpan token secara manual atau lewat Redux Persist
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
