import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export const AddUser = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    // Watch password to compare with confirm password
    const password = watch("password");

    const submitHandle = async (data) => {
        // DELETE confirmpassword so it is NOT sent to the backend
        const { confirmpassword, ...backendData } = data;

        try {
            console.log(backendData)
            const res = await axios.post("/user/create", backendData)
            console.log(res.data)
            console.log(res.data.data)
            if (res.status == 201) {
                toast.success("User Created Successfully!");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    // Password Regex: 1-Special, 1-Capital, 1-Number, 1-Alphabet, Min 8 chars
    const passwordValidation = {
        required: "Password is required",
        pattern: {
            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
            message: "Must include: 8+ chars, 1 Capital, 1 Number, 1 Special Char"
        }
    };

    return (
        <div className="flex items-center justify-center py-8 px-4 relative">
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-10 w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">New User Account</h1>
                    <p className="text-slate-500 mt-2 text-sm">Set up credentials and assign a role.</p>
                </div>
                
                <form onSubmit={handleSubmit(submitHandle)} className="space-y-5">
                    
                    <div className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-3 top-9 text-slate-600" size={18} />
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Full Name</label>
                            <input type="text" className="input-dark pl-10" placeholder="Jane Doe" {...register('name', { required: "Name is required" })} />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-9 text-slate-600" size={18} />
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Email</label>
                            <input type="email" className="input-dark pl-10" placeholder="jane@company.com" {...register('email', { required: "Email is required" })} />
                        </div>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-9 text-slate-600" size={18} />
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className={`input-dark pl-10 pr-12 ${errors.password ? 'border-red-500/40' : ''}`}
                            placeholder="••••••••" 
                            {...register('password', passwordValidation)} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-600 hover:text-cyan-400 transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.password.message}</p>}
                    </div>

                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-9 text-slate-600" size={18} />
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Confirm Password</label>
                        <input 
                            type="password" 
                            className={`input-dark pl-10 ${errors.confirmpassword ? 'border-red-500/40' : ''}`}
                            placeholder="Repeat password" 
                            {...register('confirmpassword', { 
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            })} 
                        />
                        {errors.confirmpassword && <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.confirmpassword.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Mobile</label>
                            <input type="text" className="input-dark" {...register('mobileno')} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 ml-1 tracking-widest">Role</label>
                            <select className="input-dark" {...register('role', { required: "Select a role" })}>
                                <option value="">Select...</option>
                                <option value="ProjectManager">PM</option>
                                <option value="Developer">Developer</option>
                                <option value="Tester">Tester</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3.5 text-sm font-bold mt-4">
                        Create Account
                    </button>
                </form>
            </motion.div>
        </div>
    );
};