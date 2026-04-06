    import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

    const inputClass =
        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300";

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
                Edit Profile
            </h2>
            </div>

            <form
            onSubmit={handleSubmit(submitHandler)}
            className="p-8 space-y-6"
            >
            {/* Image Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                <img
                    src={preview || defaultImage}
                    alt="Profile"
                    onError={(e) => {
                        e.currentTarget.src = defaultImage;
                    }}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 text-white text-sm">
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
                <label className="block text-sm font-semibold mb-1">
                Full Name
                </label>
                <input
                type="text"
                {...register("name", {
                    required: "Name is required",
                })}
                className={inputClass}
                />
                {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                Email
                </label>
                <input
                type="email"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                    },
                })}
                className={inputClass}
                />
                {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                </p>
                )}
            </div>

            {/* Mobile */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                Mobile Number
                </label>
                <input
                type="text"
                {...register("mobileno", {
                    required: "Mobile number required",
                    minLength: {
                    value: 10,
                    message: "Invalid mobile number",
                    },
                })}
                className={inputClass}
                />
                {errors.mobileno && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.mobileno.message}
                </p>
                )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <span className="font-medium">
                Account Status:{" "}
                <span
                    className={
                    isActiveWatch
                        ? "text-green-600"
                        : "text-red-600"
                    }
                >
                    {isActiveWatch ? "Active" : "Inactive"}
                </span>
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    {...register("isActive")}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
                {loading ? "Updating..." : "Update Profile"}
            </button>
            </form>
        </div>
        </div>
    );
    };