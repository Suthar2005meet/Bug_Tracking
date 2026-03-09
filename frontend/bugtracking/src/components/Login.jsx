import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import photo from '../assets/bug.png'

export const Login = () => {

  const navigate = useNavigate();

  // ✅ Manual JSON Users
  const users = [
    { id: 1, name: "Admin User", email: "admin@gmail.com", password: "Admin123", role: "Admin" },
    { id: 2, name: "Developer User", email: "dev@gmail.com", password: "Dev123", role: "Developer" },
    { id: 3, name: "Tester User", email: "tester@gmail.com", password: "Test123", role: "Tester" },
    { id: 4, name: "Project Manager", email: "pm@gmail.com", password: "Pm12345", role: "ProjectManager" }
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(pass);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError("Password must contain uppercase, lowercase, number and 6+ characters");
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {

      // ✅ Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 Role Based Redirect
      if (user.role === "Admin") {
        navigate("/admin");
      } 
      else if (user.role === "Developer") {
        navigate("/developer");
      } 
      else if (user.role === "Tester") {
        navigate("/tester");
      } 
      else if (user.role === "ProjectManager") {
        navigate("/projectmanager");
      }

    } else {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-400 to-puple-400">
      {/* <div className="">
        <img style={{height:200,width:'100%'}} src={photo} alt="" />
      </div> */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2x1 font-bold text-center">BUG TRACKING</h1>
        <img style={{height:150,width:'100%'}} src={photo} alt="" /> <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler}>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label>Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};