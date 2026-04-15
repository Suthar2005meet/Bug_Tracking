import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const Bugs = () => {
  const [bugs, setbugs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const getBugs = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/bug/all')
      setbugs(res.data.data)
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

  const avatarGradients = [
    { from: '#f59e0b', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#10b981', to: '#14b8a6' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#8b5cf6', to: '#6366f1' },
    { from: '#f97316', to: '#ef4444' },
  ]

  const getInitial = (title) => (title || 'B').charAt(0).toUpperCase()

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 18, 36, 0.92) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  }

  const cardHoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
      e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    },
  }

  const btnDetailsStyle = {
    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  }

  const btnEditStyle = {
    background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
    border: '1px solid rgba(124, 58, 237, 0.3)',
  }

  const btnSprintStyle = {
    background: 'linear-gradient(90deg, rgba(20, 83, 78, 0.8), rgba(20, 184, 166, 0.5))',
    color: '#fff',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    boxShadow: '0 0 20px rgba(20, 184, 166, 0.12)',
  }

  const btnBaseStyle = {
    flex: 1,
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }

  const getStatusStyle = (status) => {
    const key = status?.toLowerCase?.().replace(/\s/g, '') || ''
    const map = {
      'open': { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)', dot: '#f59e0b' },
      'inprogress': { bg: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.2)', dot: '#06b6d4' },
      'resolved': { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)', dot: '#10b981' },
      'closed': { bg: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.08)', dot: '#64748b' },
    }
    return map[key] || map['open']
  }

  const getPriorityColor = (priority) => {
    const map = { High: '#f87171', Medium: '#fbbf24', Low: '#34d399' }
    return map[priority] || '#94a3b8'
  }

  /* ── loading ── */
  if (loading)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-3 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-3 border-transparent border-t-cyan-500" />
        </div>
        <p className="text-xs tracking-[0.2em] text-slate-500 uppercase animate-pulse">
          Loading bugs...
        </p>
      </div>
    )

  const filters = ['all', 'open', 'inprogress', 'resolved', 'closed']

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="relative mx-auto max-w-6xl z-10 px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            All Bugs
          </h1>
          <p className="text-slate-500 text-sm">
            Track and manage all reported bugs · <span style={{ color: '#22d3ee', fontWeight: 700 }}>{filteredBugs.length} found</span>
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center"
          style={{ gap: '12px', marginBottom: '32px' }}
        >
          <div className="relative flex-1 min-w-[200px] group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search bugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark w-full"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  ...(filter === f
                    ? { background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }),
                }}
              >
                {f === 'inprogress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bug List */}
        {filteredBugs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center glass rounded-2xl text-center"
            style={{ padding: '80px 20px' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🐛</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No bugs found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBugs.map((bug, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = getInitial(bug.title)
              const ss = getStatusStyle(bug.status)

              return (
                <motion.div
                  key={bug._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
                >
                  <div
                    className="group flex flex-col sm:flex-row items-stretch overflow-hidden"
                    style={cardStyle}
                    {...cardHoverHandlers}
                  >
                    {/* LEFT: Avatar + Info */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-start sm:items-center p-6 gap-5">
                      <div
                        style={{
                          flexShrink: 0, width: '56px', height: '56px', borderRadius: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '24px', fontWeight: 800,
                          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                          boxShadow: `0 8px 24px ${gradient.from}33`, transition: 'transform 0.3s',
                        }}
                        className="group-hover:scale-105"
                      >
                        {initial}
                      </div>

                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <h2 className="group-hover:text-cyan-400 transition-colors" style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bug.title}
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          {/* Status */}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                            background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ss.dot, boxShadow: `0 0 8px ${ss.dot}cc` }} />
                            {bug.status}
                          </span>
                          {/* Priority */}
                          <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.04)', color: getPriorityColor(bug.priority), border: '1px solid rgba(255,255,255,0.08)' }}>
                            {bug.priority}
                          </span>
                          {/* Description */}
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '350px' }}>
                            {bug.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 flex flex-col justify-center gap-2.5 p-5 border-t sm:border-t-0 sm:border-l border-white/[0.04]">
                      <div className="flex gap-2">
                        <Link to={`bugdetail/${bug._id}`} style={{ ...btnDetailsStyle, ...btnBaseStyle }}>
                          Details
                        </Link>
                        <Link to={`editbug/${bug._id}`} style={{ ...btnEditStyle, ...btnBaseStyle }}>
                          Edit
                        </Link>
                      </div>
                      <Link
                        to={`allcomment/${bug._id}`}
                        style={{
                          ...btnSprintStyle,
                          ...btnBaseStyle,
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        💬 Comment
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}