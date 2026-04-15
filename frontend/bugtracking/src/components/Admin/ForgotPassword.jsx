import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()

    const submitHandle = async (data) => {
        try {
            const res = await axios.post('/user/forgotpassword', data)
            if (res.status == 201) {
                navigate('/')
                toast.success('Reset password link sent to your Email')
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || 'Failed to send reset link')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#050810]">
            {/* Background elements */}
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-70" />
            <motion.div 
                animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" 
            />
            <motion.div 
                animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/20 blur-[100px] pointer-events-none" 
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-extrabold text-white text-center mb-2">Forgot Password?</h1>
                <p className="text-sm text-slate-400 text-center mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">
                            Email Address
                        </label>
                        <div className="relative flex items-center group">
                            <span className="absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">✉</span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email', { required: "Email is required" })}
                                className={`input-dark w-full pl-11 py-3.5 text-sm group-focus-within:border-indigo-500/50 group-focus-within:bg-white/[0.04]
                                    ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-[11px] font-bold text-red-400 flex items-center gap-1 pl-1">
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
                        className="w-full py-4 text-[12px] font-bold tracking-widest uppercase text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Sending...
                            </span>
                        ) : 'Send Reset Link'}
                    </button>
                </form>

                {/* Back to Login */}
                <p className="text-center text-xs font-medium text-slate-500 mt-8">
                    Remember your password?{' '}
                    <a href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold tracking-wide">
                        Back to Login
                    </a>
                </p>
            </motion.div>
        </div>
    )
}