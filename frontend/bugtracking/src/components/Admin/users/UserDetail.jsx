import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { getRoleLabel, normalizeRole } from '../../../utils/roles'
import { motion } from 'framer-motion'

export const UserDetail = () => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const { id }      = useParams()
  const navigate    = useNavigate()

  const getUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`/user/details/${id}`)
      setUser(res.data.data)
    } catch (err) {
      setError("Failed to load user details.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
  }, [id])

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    })
  }

  const roleBadge = (role) => {
    const map = {
      admin: "bg-violet-500/15 text-violet-400 border-violet-500/20",
      projectmanager: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      developer: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      tester: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    }
    return map[normalizeRole(role)] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20"
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="h-9 w-9 rounded-full border-3 border-white/10 border-t-cyan-500 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Loading user details...</p>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-400 text-xl font-bold">!</div>
      <p className="text-sm font-semibold text-white">{error}</p>
      <button onClick={getUser} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2">Try again</button>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-4 relative"
    >
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500 hover:bg-white/[0.08] hover:text-white border border-white/[0.06] transition-all"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-white tracking-tight">User Details</h1>
          <p className="text-xs text-slate-600 mt-0.5">Full profile information</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-violet-500/30" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="h-18 w-18 rounded-2xl border-4 border-[#141a2e] shadow-lg overflow-hidden bg-white/[0.04] shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "" }} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-2xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-white">{user.name ?? "—"}</h2>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${roleBadge(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{user.email ?? "—"}</p>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailCard icon={<FiMail />} label="Email Address" value={user.email} color="text-cyan-400" bg="bg-cyan-500/15" />
        <DetailCard icon={<FiPhone />} label="Mobile No" value={user.mobileno} color="text-violet-400" bg="bg-violet-500/15" />
        <DetailCard icon={<FiShield />} label="Role" value={<span>{getRoleLabel(user.role)}</span>} color="text-emerald-400" bg="bg-emerald-500/15" />
        <DetailCard icon={<FiUser />} label="User ID" value={user._id ?? user.id} color="text-amber-400" bg="bg-amber-500/15" mono />
        <DetailCard icon={<FiCalendar />} label="Created At" value={formatDate(user.createdAt)} color="text-slate-400" bg="bg-white/[0.04]" />
        <DetailCard icon={<FiCalendar />} label="Last Updated" value={formatDate(user.updatedAt)} color="text-slate-400" bg="bg-white/[0.04]" />
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-4 glass px-5 py-4">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${user.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.04] text-slate-500"}`}>
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Account Status</p>
            <p className={`text-sm font-bold ${user.isActive ? "text-emerald-400" : "text-slate-500"}`}>
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 glass px-5 py-4">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${user.isDeleted ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
            <FiXCircle />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Deleted</p>
            <p className={`text-sm font-bold ${user.isDeleted ? "text-red-400" : "text-emerald-400"}`}>
              {user.isDeleted ? "Deleted" : "Not Deleted"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const DetailCard = ({ icon, label, value, color, bg, mono = false }) => (
  <div className="flex items-center gap-4 glass px-5 py-4">
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color} text-base`}>
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-semibold text-slate-300 truncate ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? "—"}
      </p>
    </div>
  </div>
)
