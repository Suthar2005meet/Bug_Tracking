import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import bugimg from '../assets/bug.png'

export const Login = () => {

  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [showPassword, setShowPassword] = useState(false)

  const submitHandle = async (data) => {
    try {
      const res = await axios.post("/user/login", data)

      if (res.status === 201) {
        toast.success("Login Successfully 🎉")

        switch (res.data.role) {
          case "admin": navigate("/admin"); break;
          case "ProjectManager": navigate("/projectmanager"); break;
          case "Developer": navigate("/developer"); break;
          case "Tester": navigate("/tester"); break;
          default:
            toast.error("Invalid Role")
            navigate("/")
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">

      <div className="flex w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white/10 p-10">
          <img
            src={bugimg}
            alt="Bug Tracking"
            className="w-80 animate-pulse"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                {...register('email', { required: true })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-white mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register('password', { required: true })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
              />
              <span
                className="absolute right-4 top-11 text-white cursor-pointer text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-purple-100 transition duration-300 shadow-lg"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}