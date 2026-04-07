import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        <div className='min-h-screen flex items-center justify-center bg-slate-50 p-6'>
            <div className='bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100'>
                <div className="text-center mb-8">
                    <h1 className='text-3xl font-black text-gray-800 tracking-tight'>New User Account</h1>
                    <p className='text-gray-400 mt-2'>Set up credentials and assign a role.</p>
                </div>
                
                <form onSubmit={handleSubmit(submitHandle)} className="space-y-5">
                    
                    {/* Name & Email Group */}
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-9 text-gray-400" size={18} />
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Full Name</label>
                            <input type="text" className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all' placeholder='Jane Doe' {...register('name', { required: "Name is required" })} />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-9 text-gray-400" size={18} />
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Email</label>
                            <input type="email" className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none' placeholder='jane@company.com' {...register('email', { required: "Email is required" })} />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-9 text-gray-400" size={18} />
                        <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder='••••••••' 
                            {...register('password', passwordValidation)} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-blue-600">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-9 text-gray-400" size={18} />
                        <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Confirm Password</label>
                        <input 
                            type="password" 
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.confirmpassword ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder='Repeat password' 
                            {...register('confirmpassword', { 
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            })} 
                        />
                        {errors.confirmpassword && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmpassword.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Mobile</label>
                            <input type="text" className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500' {...register('mobileno')} />
                        </div>
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1 ml-1'>Role</label>
                            <select className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500' {...register('role', { required: "Select a role" })}>
                                <option value="">Select...</option>
                                <option value="ProjectManager">PM</option>
                                <option value="Developer">Developer</option>
                                <option value="Tester">Tester</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className='w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] mt-4'>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};