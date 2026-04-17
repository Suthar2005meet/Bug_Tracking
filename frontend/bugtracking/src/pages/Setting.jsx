import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export const Setting = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const defaultImage = "https://via.placeholder.com/128?text=Profile";
    const [preview, setPreview] = useState(defaultImage);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm();

    const imageFile = watch("image");
    const isActiveWatch = watch("isActive");

    // Image Preview
    useEffect(() => {
        if (imageFile && imageFile[0] instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(imageFile[0]);
        }
    }, [imageFile]);

    // Fetch User Data
    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
        try {
            const res = await axios.get(`/user/details/${id}`);
            const data = res.data?.data;

            if (!data) {
            toast.error("User not found");
            return;
            }

            setValue("name", data.name || "");
            setValue("email", data.email || "");
            setValue("mobileno", data.mobileno || "");
            setValue("isActive", data.isActive || false);

            if (data.image) setPreview(data.image);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
        }
        };

        fetchProfile();
    }, [id, setValue]);

    // Submit Handler
    const submitHandler = async (data) => {
        setLoading(true);
        try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("mobileno", data.mobileno);
        formData.append("isActive", data.isActive);

        if (data.image && data.image[0]) {
            formData.append("image", data.image[0]);
        }

        const res = await axios.put(`/user/update/${id}`, formData);

        if (res.status === 200) {
            toast.success("Profile updated successfully");
        }
        } catch (error) {
        console.error(error);
        toast.error(
            error.response?.data?.message || "Update failed"
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-8 px-4 relative">
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full glass overflow-hidden relative z-10"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-b border-white/[0.06] py-6 px-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-1">Account</p>
                    <h2 className="text-xl font-extrabold text-white">Edit Profile</h2>
                </div>

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="p-6 md:p-8 space-y-6"
                >
                    {/* Image Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <img
                                src={preview || defaultImage}
                                alt="Profile"
                                onError={(e) => { e.currentTarget.src = defaultImage; }}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white/[0.08] shadow-xl shadow-black/30 group-hover:border-cyan-500/30 transition-all"
                            />
                            <label className="absolute bottom-1 right-1 bg-gradient-to-r from-cyan-500 to-violet-600 p-2.5 rounded-full cursor-pointer hover:scale-110 transition-transform text-white text-sm shadow-lg">
                                📷
                                <input
                                    type="file"
                                    {...register("image")}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="input-dark"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                            })}
                            className="input-dark"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            {...register("mobileno", {
                                required: "Mobile number required",
                                minLength: { value: 10, message: "Invalid mobile number" },
                            })}
                            className="input-dark"
                        />
                        {errors.mobileno && (
                            <p className="text-red-400 text-xs mt-1">{errors.mobileno.message}</p>
                        )}
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                        <span className="text-sm font-medium text-slate-400">
                            Account Status:{" "}
                            <span className={isActiveWatch ? "text-emerald-400" : "text-red-400"}>
                                {isActiveWatch ? "Active" : "Inactive"}
                            </span>
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : "Update Profile"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};