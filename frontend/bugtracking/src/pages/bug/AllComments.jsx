import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthProvider'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMessageCircle, FiClock, FiTag, FiBox } from 'react-icons/fi'

export const AllComments = () => {
  const { userId } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  const getComment = async () => {
    try {
      const res = await axios.get(`/comment/bug/${id}`)
      setComments(res.data.data)
    } catch (err) {
      console.error("Error fetching comments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getComment()
  }, [id])

  const metadata = comments.length > 0 ? comments[0].bugId : null

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* ─── HEADER SECTION ─── */}
      {metadata && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c1222] rounded-3xl p-8 mb-10 border border-white/[0.08] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FiMessageCircle size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <FiBox size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Project: {metadata.projectId?.title}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              {metadata.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {metadata.priority} Priority
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Status: {metadata.status}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── DISCUSSION LIST ─── */}
      <div className="relative">
        <div className="flex items-center justify-between mb-8 border-b border-white/[0.05] pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            Discussion 
            <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-slate-400">
              {comments.length}
            </span>
          </h3>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/20 via-white/5 to-transparent hidden md:block" />

            {comments.map((c, index) => (
              <motion.div 
                key={c._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 relative group"
              >
                {/* User Avatar */}
                <div className="relative z-10 shrink-0">
                  <img 
                    src={c.userId?.image || `https://ui-avatars.com/api/?name=${c.userId?.name}&background=random`}
                    alt={c.userId?.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-blue-500/50 transition-all duration-300 shadow-xl"
                  />
                </div>
                
                <div className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-3xl border border-white/[0.06] transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white tracking-wide">{c.userId?.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${
                        c.userId?.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        c.userId?.role === 'developer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {c.userId?.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium">
                      <FiClock />
                      {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {c.comment}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/[0.05]"
          >
            <div className="flex justify-center mb-4 text-slate-700">
               <FiMessageCircle size={48} />
            </div>
            <p className="text-slate-500 font-medium italic">No comments posted yet. Be the first to start the discussion!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}