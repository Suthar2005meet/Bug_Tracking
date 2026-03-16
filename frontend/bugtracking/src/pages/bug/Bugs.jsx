import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Bugs = () => {
  const [bugs, setbugs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [visible, setVisible] = useState(false)

  const getBugs = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/bug/all')
      setbugs(res.data.data)
      setTimeout(() => setVisible(true), 60)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getBugs() }, [])

  /* ── filter + search ── */
  const filteredBugs = bugs.filter((bug) => {
    const matchSearch =
      bug.title?.toLowerCase().includes(search.toLowerCase()) ||
      bug.description?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || bug.status?.toLowerCase().replace(/\s/g, '') === filter
    return matchSearch && matchFilter
  })

  /* ── loading ── */
  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
        </div>
        <p className="font-mono text-xs tracking-[0.2em] text-blue-400 uppercase animate-pulse">
          Loading bugs...
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/60 px-4 py-8 sm:px-6 lg:px-8">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* ── PAGE HEADER ── */}
        <div className={`mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400 mb-1">
            Bug Tracker
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">All Bugs</h1>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 font-mono text-xs font-bold text-blue-600">
                {filteredBugs.length} found
              </span>
              <Link
                to="createbug"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-300 active:scale-95"
              >
                + Report Bug
              </Link>
            </div>
          </div>
        </div>

        {/* ── SEARCH + FILTER BAR ── */}
        <div className={`mb-6 flex flex-wrap gap-3 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Search bugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {['all', 'open', 'inprogress', 'resolved', 'closed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 scale-105'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f === 'inprogress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── BUG LIST ── */}
        {filteredBugs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-20 text-center">
            <p className="text-4xl mb-3">🐛</p>
            <p className="font-mono text-sm font-semibold text-slate-400">No bugs found</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBugs.map((bug, index) => (
              <BugCard key={bug._id} bug={bug} index={index} visible={visible} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

/* ── BUG CARD ──────────────────────────────────────────────────── */
const BugCard = ({ bug, index, visible }) => {
  const delay = Math.min(index * 80, 600)

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-white bg-white shadow-sm shadow-slate-200/80 transition-all duration-500 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.2s ease, translate 0.2s ease`,
      }}
    >
      {/* Colored left accent bar by priority */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${priorityAccent(bug.priority)}`} />

      <div className="flex flex-col gap-4 p-5 pl-6 sm:flex-row sm:items-start sm:justify-between">

        {/* Left — content */}
        <div className="flex-1 min-w-0">
          {/* ID + badges row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              #{bug._id?.slice(-6)?.toUpperCase()}
            </span>
            <StatusBadge value={bug.status} />
            <PriorityBadge value={bug.priority} />
            {bug.type && <TypeBadge value={bug.type} />}
          </div>

          {/* Title */}
          <h2 className="mb-1.5 text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200 leading-snug">
            {bug.title}
          </h2>

          {/* Description — truncated */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {bug.description}
          </p>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {bug.assignedTo && (
              <span className="flex items-center gap-1">
                <span>👤</span>
                <span className="font-medium text-slate-600">{bug.assignedTo}</span>
              </span>
            )}
            {bug.project && (
              <span className="flex items-center gap-1">
                <span>📁</span>
                <span className="font-medium text-slate-600">{bug.project}</span>
              </span>
            )}
            {bug.duedate && (
              <span className="flex items-center gap-1">
                <span>📅</span>
                <span className="font-medium text-slate-600">{bug.duedate}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:items-end">
          <Link
            to={`bugdetail/${bug._id}`}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-md shadow-blue-200 transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Details
          </Link>
          <Link
            to={`editbug/${bug._id}`}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            Edit
          </Link>
        </div>

      </div>
    </div>
  )
}

/* ── HELPERS ───────────────────────────────────────────────────── */
const priorityAccent = (value) => {
  if (!value) return 'bg-slate-200'
  const map = { High: 'bg-red-500', Medium: 'bg-amber-400', Low: 'bg-emerald-500' }
  return map[value] || 'bg-slate-300'
}

const StatusBadge = ({ value }) => {
  const map = {
    open:       'bg-yellow-100 text-yellow-700 border border-yellow-200',
    inprogress: 'bg-blue-100   text-blue-700   border border-blue-200',
    resolved:   'bg-emerald-100 text-emerald-700 border border-emerald-200',
    closed:     'bg-slate-100  text-slate-500  border border-slate-200',
  }
  const key = value?.toLowerCase?.().replace(/\s/g, '') || ''
  const cls = map[key] || 'bg-slate-100 text-slate-500 border border-slate-200'
  return (
    <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {value}
    </span>
  )
}

const PriorityBadge = ({ value }) => {
  const map = {
    High:   'bg-red-100    text-red-600    border border-red-200',
    Medium: 'bg-amber-100  text-amber-600  border border-amber-200',
    Low:    'bg-emerald-100 text-emerald-600 border border-emerald-200',
  }
  const cls = map[value] || 'bg-slate-100 text-slate-500 border border-slate-200'
  return (
    <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {value}
    </span>
  )
}

const TypeBadge = ({ value }) => (
  <span className="rounded-lg border border-violet-200 bg-violet-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-violet-600">
    {value}
  </span>
)