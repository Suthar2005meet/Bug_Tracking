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

  }, []);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;