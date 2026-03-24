import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const { token } = useParams();
    const navigate = useNavigate();
    const newPassword = watch("newPassword");

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submitHandle = async (data) => {
        data.token = token;
        delete data.confirmPassword;
        try {
            const res = await axios.put("/user/resetpassword", data);
            toast.success("Password reset successful!");
            navigate("/login");
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const EyeIcon = ({ show }) => show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-200/60 p-8">

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Set New Password</h1>
                <p className="text-sm text-slate-500 text-center mb-7">
                    Your new password must be at least 6 characters.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(submitHandle)} className="space-y-5">

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" },
                                })}
                                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200
                                    focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                                    ${errors.newPassword
                                        ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <EyeIcon show={showNew} />
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === newPassword || "Passwords do not match",
                                })}
                                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200
                                    focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                                    ${errors.confirmPassword
                                        ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <EyeIcon show={showConfirm} />
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Resetting...
                            </span>
                        ) : "Reset Password"}
                    </button>

                </form>

                {/* Back to Login */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Remembered your password?{" "}
                    <a href="/login" className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors">
                        Back to Login
                    </a>
                </p>

            </div>
        </div>
    );
};