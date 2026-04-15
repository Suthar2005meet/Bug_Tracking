import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export const ResetPassword = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { token } = useParams();
    const navigate = useNavigate();
    const newPassword = watch("newPassword");

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submitHandle = async (data) => {
        data.token = token;
        delete data.confirmPassword;
        try {
            await axios.put("/user/resetpassword", data);
            toast.success("Password reset successful!");
            navigate("/login");
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const EyeIcon = ({ show }) => show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#050810]">
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-70" />
            <motion.div 
                animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" 
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md glass border border-white/[0.08] rounded-3xl shadow-2xl p-8 relative z-10"
            >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-white text-center mb-2">Set New Password</h1>
                <p className="text-sm text-slate-400 text-center mb-8">
                    Your new password must be at least 6 characters.
                </p>

                <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
                    {/* New Password */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">
                            New Password
                        </label>
                        <div className="relative flex items-center group">
                            <span className="absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">🔒</span>
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" },
                                })}
                                className={`input-dark w-full pl-11 pr-12 py-3.5 text-sm group-focus-within:border-indigo-500/50 group-focus-within:bg-white/[0.04]
                                    ${errors.newPassword ? "border-red-500/50 bg-red-500/5" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-400 transition-colors"
                            >
                                <EyeIcon show={showNew} />
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1.5 text-[11px] font-bold text-red-400 flex items-center gap-1 pl-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">
                            Confirm Password
                        </label>
                        <div className="relative flex items-center group">
                            <span className="absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">✓</span>
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) => value === newPassword || "Passwords do not match",
                                })}
                                className={`input-dark w-full pl-11 pr-12 py-3.5 text-sm group-focus-within:border-indigo-500/50 group-focus-within:bg-white/[0.04]
                                    ${errors.confirmPassword ? "border-red-500/50 bg-red-500/5" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-400 transition-colors"
                            >
                                <EyeIcon show={showConfirm} />
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-[11px] font-bold text-red-400 flex items-center gap-1 pl-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 text-[12px] font-bold tracking-widest uppercase text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Resetting...
                            </span>
                        ) : "Reset Password"}
                    </button>
                </form>

                <p className="text-center text-xs font-medium text-slate-500 mt-8">
                    Remembered your password?{" "}
                    <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold tracking-wide">
                        Back to Login
                    </a>
                </p>
            </motion.div>
        </div>
    );
};