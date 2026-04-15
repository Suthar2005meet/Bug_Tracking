import axios from "axios";
import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
function App() {

  useEffect(() => {

    // ✅ Set Base URL once
    axios.defaults.baseURL = "http://localhost:2500";

    // ✅ Attach token automatically to every request
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Handle token expiration globally
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );

  }, []);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;