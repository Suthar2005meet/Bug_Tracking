import { useState } from 'react'
import AppRouter from './router/AppRouter'
import axios from 'axios'
import { ToastContainer, Zoom } from 'react-toastify'
//import './App.css'

function App() {

  axios.defaults.baseURL = "http://localhost:2500"

  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter/>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Zoom}
      />
      
    </>
  )
}

export default App
