import React, { useState } from "react";
import { useForm } from "react-hook-form";

export const SignUp = () => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  // Dynamic Fields
  const fields = [
    {
      label: "Full Name",
      name: "fullname",
      type: "text",
      validation: {
        required: "Full name is required"
      }
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter valid email"
        }
      }
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Minimum 6 characters required"
        }
      }
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      validation: {
        required: "Confirm password is required",
        validate: value =>
          value === password || "Passwords do not match"
      }
    }
  ];

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);

    setTimeout(() => {
      alert("Account Created Successfully 🎉");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create Account
        </h2>

        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-600 mb-1">
              {field.label}
            </label>

            <input
              type={
                field.type === "password"
                  ? showPassword ? "text" : "password"
                  : field.type
              }
              {...register(field.name, field.validation)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {(field.name === "password" || field.name === "confirmPassword") && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-purple-500 mt-1"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

      </form>
    </div>
  );
};