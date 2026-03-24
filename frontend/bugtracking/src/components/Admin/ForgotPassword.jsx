import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const ForgotPassword = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()

    const submitHandle = async (data) => {
        const res = await axios.post('/user/forgotpassword', data)
        if (res.status == 201) {
            navigate('/')
            toast.success('Reset password link sent to your Email')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-200/60 p-8">

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Forgot Password?</h1>
                <p className="text-sm text-slate-500 text-center mb-7">
                    Enter your email and we'll send you a reset link.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(submitHandle)} className="space-y-5">

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register('email', { required: "Email is required" })}
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200
                                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                                ${errors.email
                                    ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400'
                                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email.message}
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
                                Sending...
                            </span>
                        ) : 'Send Reset Link'}
                    </button>

                </form>

                {/* Back to Login */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Remember your password?{' '}
                    <a href="/" className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors">
                        Back to Login
                    </a>
                </p>

            </div>
        </div>
    )
}