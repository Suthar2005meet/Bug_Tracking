import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiEdit2, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { getRoleLabel, normalizeRole } from '../../../utils/roles'

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
      admin:   "bg-violet-50 text-violet-600 border-violet-200",
      projectmanager: "bg-sky-50 text-sky-600 border-sky-200",
      developer: "bg-emerald-50 text-emerald-600 border-emerald-200",
      tester: "bg-amber-50 text-amber-600 border-amber-200",
    }
    return map[normalizeRole(role)] ?? "bg-slate-100 text-slate-600 border-slate-200"
  }

  // ── LOADING ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="h-9 w-9 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading user details...</p>
    </div>
  )

  // ── ERROR ──
  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400 text-xl font-bold">!</div>
      <p className="text-sm font-semibold text-slate-700">{error}</p>
      <button
        onClick={getUser}
        className="text-xs text-sky-500 hover:text-sky-600 font-medium underline underline-offset-2"
      >
        Try again
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── BACK BUTTON + HEADER ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-500 transition-all duration-150 shadow-sm"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">User Details</h1>
          <p className="text-xs text-slate-400 mt-0.5">Full profile information</p>
        </div>
      </div>

      {/* ── PROFILE CARD ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500" />

        {/* Avatar + name row */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 text-white text-2xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>
          </div>

          {/* Name + role */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-slate-800">{user.name ?? "—"}</h2>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleBadge(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{user.email ?? "—"}</p>
        </div>
      </div>

      {/* ── DETAIL GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Email */}
        <DetailCard icon={<FiMail />} label="Email Address" value={user.email} color="text-sky-500" bg="bg-sky-50" />

        {/* Mobile */}
        <DetailCard icon={<FiPhone />} label="Mobile No" value={user.mobileno} color="text-violet-500" bg="bg-violet-50" />

        {/* Role */}
        <DetailCard icon={<FiShield />} label="Role" value={<span>{getRoleLabel(user.role)}</span>} color="text-emerald-500" bg="bg-emerald-50" />

        {/* User ID */}
        <DetailCard icon={<FiUser />} label="User ID" value={user._id ?? user.id} color="text-amber-500" bg="bg-amber-50" mono />

        {/* Created At */}
        <DetailCard icon={<FiCalendar />} label="Created At" value={formatDate(user.createdAt)} color="text-slate-500" bg="bg-slate-100" />

        {/* Updated At */}
        <DetailCard icon={<FiCalendar />} label="Last Updated" value={formatDate(user.updatedAt)} color="text-slate-500" bg="bg-slate-100" />

      </div>

      {/* ── STATUS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* isActive */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${user.isActive ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}>
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Account Status</p>
            <p className={`text-sm font-bold ${user.isActive ? "text-emerald-600" : "text-slate-500"}`}>
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        {/* isDeleted */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${user.isDeleted ? "bg-red-50 text-red-400" : "bg-emerald-50 text-emerald-500"}`}>
            <FiXCircle />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Deleted</p>
            <p className={`text-sm font-bold ${user.isDeleted ? "text-red-500" : "text-emerald-600"}`}>
              {user.isDeleted ? "Deleted" : "Not Deleted"}
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

// ── REUSABLE DETAIL CARD ──
const DetailCard = ({ icon, label, value, color, bg, mono = false }) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color} text-base`}>
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold text-slate-700 truncate ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? "—"}
      </p>
    </div>
  </div>
)
