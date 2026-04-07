    import axios from "axios";
    import React, { useContext, useEffect, useState } from "react";
    import { useForm } from "react-hook-form";
    import { useNavigate, useParams } from "react-router-dom";
    import { AuthContext } from "../../AuthProvider";

    export const AddComment = () => {
    const { userId } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // 🔹 Fetch Bug Details
    const getData = async () => {
        try {
        const res = await axios.get(`/bug/${id}`);
        setBug(res.data.data);
        } catch (err) {
        console.log("Bug Fetch Error:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (id) getData();
    }, [id]);

    // 🔹 Submit Comment
    const submitHandle = async (data) => {
        if (!userId) {
        alert("User not logged in");
        return;
        }

        try {
        const payload = {
            comment: data.comment,
            bugId: id,
            userId: userId,
        };

        await axios.post(`/comment/create`, payload);

        reset(); 
        navigate(-1); 
        } catch (err) {
        console.log("Comment Submit Error:", err);
        }
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Add Comment</h2>
            <p className="text-sm text-slate-500 mt-1">
                Posting to Bug: <span className="font-semibold text-indigo-600">{bug?.title}</span>
            </p>
            </div>

            {/* Form Body */}
            <div className="p-6">
            <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Message
                </label>
                <textarea
                    {...register("comment", { required: "Message is required" })}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white focus:ring-4 transition-all duration-200 outline-none ${
                    errors.comment 
                        ? "border-rose-400 focus:ring-rose-100" 
                        : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
                    }`}
                    placeholder="Write your technical notes or updates here..."
                ></textarea>
                {errors.comment && (
                    <span className="text-xs text-rose-500 mt-1 block">
                    {errors.comment.message}
                    </span>
                )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                
                <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-100 transition-all active:scale-95"
                >
                    Post Comment
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
    };