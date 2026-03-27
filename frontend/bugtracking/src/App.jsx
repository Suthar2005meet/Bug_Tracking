// import axios from 'axios'
// import { useState } from 'react'
// import { ToastContainer, Zoom } from 'react-toastify'
// import AppRouter from './router/AppRouter'
// //import './App.css'

// function App() {

//   axios.defaults.baseURL = "http://localhost:2500"

//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <AppRouter/>
//       <ToastContainer
//         position="top-center"
//         autoClose={500}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//         transition={Zoom}
//       />
      
//     </>
//   )
// }

// export default App


import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, Zoom } from "react-toastify";
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

      <ToastContainer
        position="top-center"
        autoClose={500}
        theme="dark"
        transition={Zoom}
      />
    </>
  );
}

export default App;