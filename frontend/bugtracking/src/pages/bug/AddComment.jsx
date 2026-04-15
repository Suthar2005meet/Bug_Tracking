import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSend, FiX, FiInfo } from "react-icons/fi";

export const AddComment = () => {
  const { userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const getData = async () => {
    try {
      const res = await axios.get(`/bug/${id}`);
      setBug(res.data.data);
    } catch (err) {
      console.log("Bug Fetch Error:", err);
      toast.error("Could not load bug details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getData();
  }, [id]);

  const submitHandle = async (data) => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    try {
      const payload = {
        comment: data.comment,
        bugId: id,
        userId: userId,
      };

      await axios.post(`/comment/create`, payload);
      toast.success("Comment added successfully");
      reset();
      navigate(-1);
    } catch (err) {
      console.log("Comment Submit Error:", err);
      toast.error("Failed to post comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-white/5 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] w-full flex items-center justify-center p-6 lg:p-10 relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[140px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-[#0c1222] border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Header Section */}
          <div className="px-10 py-8 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-14 w-14 bg-blue-500/15 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
                <FiMessageSquare size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Post Technical Update</h2>
                <p className="text-slate-500 mt-1">Communicate findings or progress on this bug.</p>
              </div>
            </div>

            {/* Context Card */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-lg">
                  <FiInfo className="text-blue-400" size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Referring Bug</span>
                  <span className="text-sm font-semibold text-white truncate max-w-[280px]">
                    {bug?.title || "Untitled Bug"}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                {bug?.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(submitHandle)} className="p-10">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3 px-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                    Detailed Message
                  </label>
                </div>
                
                <textarea
                  {...register("comment", { 
                    required: "Message content is required",
                    minLength: { value: 5, message: "Please provide a more detailed comment" }
                  })}
                  rows="8"
                  className={`w-full bg-white/[0.02] border rounded-2xl p-5 text-white leading-relaxed placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none
                    ${errors.comment ? 'border-red-500/40 focus:border-red-500' : 'border-white/[0.1] focus:border-blue-500/40'}`}
                  placeholder="Paste terminal logs, describe your resolution steps, or ask for clarification..."
                ></textarea>
                
                {errors.comment && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 mt-3 flex items-center gap-2 font-medium px-1"
                  >
                    <FiX size={14} /> {errors.comment.message}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-5 pt-6 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-white transition-all"
                >
                  Discard
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className={`flex items-center gap-3 px-10 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl transition-all
                    ${isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'}`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSend size={18} />
                  )}
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};