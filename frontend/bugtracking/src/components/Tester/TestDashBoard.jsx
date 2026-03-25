import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import BugChart from "../charts/BugChart"

export const TestDashBoard = () => {
  const navigate = useNavigate()

  let decode = null
  const token = localStorage.getItem("token")
  
  if (!token) {
    navigate('/')
    return null
  }
  
  try {
    decode = jwtDecode(token)
    console.log("Decoded token:", decode)
    console.log("User ID:", decode._id)
  } catch (err) {
    console.log("Invalid token:", err)
    navigate('/')
    return null
  }

  return (
    <div>
        <h1>DashBoard</h1>
        <BugChart/>
    </div>
  )
}
