    import axios from "axios";
    import React, { useContext, useEffect, useState } from "react";
    import { useForm } from "react-hook-form";
    import { useNavigate, useParams } from "react-router-dom";
    import { AuthContext } from "../../AuthProvider";

    export const AddComment = () => {
    const { userId } = useContext(AuthContext);
    const [bug, setBug] = useState();
    const { id } = useParams();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const getData = async () => {
        try {
        const res = await axios.get(`/bug/bug/${id}`);
        setBug(res.data.data);
        } catch (err) {
        console.log(err);
        }
    };

    const submitHandle = async (data) => {
        try {
        // Ensuring the hidden fields are included in the submission
        const payload = {
            ...data,
            bugId: id,
            userId: userId
        };
        await axios.post(`/comment/create`, payload);
        navigate(-1);
        } catch (err) {
        console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-indigo-600 p-6">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383L12 21.75l-3.676-4.635a49.04 49.04 0 01-3.476-.383C2.87 16.448 1.5 14.716 1.5 12.77V6.74c0-1.946 1.37-3.678 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                </svg>
                Add New Comment
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
                Posting to Bug: <span className="font-semibold text-white">{bug?.title || "Loading..."}</span>
            </p>
            </div>

            <form onSubmit={handleSubmit(submitHandle)} className="p-6 space-y-6">
            {/* Hidden Fields */}
            <input type="hidden" {...register("bugId")} value={id} />
            <input type="hidden" {...register("userId")} value={userId} />

            {/* Comment Textarea */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                Your Message
                </label>
                <textarea
                {...register('comment', { required: true })}
                rows="4"
                placeholder="Describe your update or ask a question..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-600 bg-slate-50 focus:bg-white"
                ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                Cancel
                </button>
                <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                Post Comment
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };