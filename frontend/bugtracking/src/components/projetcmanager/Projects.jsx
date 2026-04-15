import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'
import { motion } from 'framer-motion'

export const Projects = () => {
  const { userId, role } = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const getProjects = async () => {
    try {
      setLoading(true)
      if (role === "ProjectManager") {
        const res = await axios.get(`/project/user/${userId}`)
        setProjects(res.data.data)
      } else {
        const res = await axios.get('/project/all')
        setProjects(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  const filteredProjects = projects.filter(project => {
    const name = project?.projectName || project?.title || ''
    const description = project?.description || ''
    const search = searchTerm.toLowerCase()
    return (
      name.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    )
  })

  // Gradient palettes for letter avatars
  const avatarGradients = [
    { from: '#f59e0b', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#10b981', to: '#14b8a6' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#8b5cf6', to: '#6366f1' },
    { from: '#f97316', to: '#ef4444' },
  ]

  const getInitial = (title) => {
    return (title || 'P').charAt(0).toUpperCase()
  }



  /* ── Inline Styles ── */
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

  return (
    <div className="relative w-full">
      {/* Decorative mesh */}
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">

        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            My Projects
          </h1>
          <p className="text-slate-500 text-sm">Create, manage and organize your projects</p>
        </motion.div>

        {/* ═══ Search & Add ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center"
          style={{ gap: '12px', marginBottom: '32px' }}
        >
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark w-full"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <Link
            to="createproject"
            className="btn-primary flex items-center justify-center whitespace-nowrap text-sm"
            style={{ gap: '8px', padding: '10px 24px', borderRadius: '12px' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </motion.div>

        {/* ═══ Loading ═══ */}
        {loading && (
          <div className="flex justify-center items-center" style={{ padding: '120px 0' }}>
            <div className="w-12 h-12 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}

        {/* ═══ Empty ═══ */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center glass rounded-2xl text-center"
            style={{ padding: '80px 20px' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📁</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No projects found</h3>
            <p className="text-slate-500 text-sm" style={{ marginBottom: '24px' }}>
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first project'}
            </p>
            {!searchTerm && (
              <Link to="createproject" className="btn-primary text-sm">
                Create Project
              </Link>
            )}
          </motion.div>
        )}

        {/* ═══ Project Cards ═══ */}
        {!loading && filteredProjects.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredProjects.map((project, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = getInitial(project.title)

              const sprintProgress = project.sprintProgress || null

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <div
                    className="group flex flex-col sm:flex-row items-stretch overflow-hidden"
                    style={cardStyle}
                    {...cardHoverHandlers}
                  >

                    {/* ── LEFT: Avatar + Project Info ── */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-start sm:items-center p-6 gap-5">
                      {/* Letter Avatar */}
                      <div
                        style={{
                          flexShrink: 0,
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '24px',
                          fontWeight: 800,
                          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                          boxShadow: `0 8px 24px ${gradient.from}33`,
                          transition: 'transform 0.3s',
                        }}
                        className="group-hover:scale-105"
                      >
                        {initial}
                      </div>

                      {/* Text Content */}
                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>

                        {/* Project Title */}
                        <h2
                          className="group-hover:text-cyan-400 transition-colors"
                          style={{
                            fontSize: '18px',
                            fontWeight: 800,
                            color: '#f1f5f9',
                            margin: 0,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {project.title || 'Untitled Project'}
                        </h2>

                        {/* Status Badge + Description */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '2px 10px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              background: project.status === 'Completed'
                                ? 'rgba(6, 182, 212, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                              color: project.status === 'Completed'
                                ? '#22d3ee' : '#34d399',
                              border: `1px solid ${project.status === 'Completed'
                                ? 'rgba(6, 182, 212, 0.25)' : 'rgba(16, 185, 129, 0.2)'}`,
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: project.status === 'Completed' ? '#06b6d4' : '#10b981',
                                boxShadow: `0 0 8px ${project.status === 'Completed'
                                  ? 'rgba(6,182,212,0.8)' : 'rgba(16,185,129,0.8)'}`,
                              }}
                            />
                            {project.status || 'Active'}
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#94a3b8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '400px',
                            }}
                          >
                            {project.description || 'No description provided'}
                          </span>
                        </div>


                      </div>
                    </div>

                    {/* ── RIGHT: Action Buttons ── */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 flex flex-col justify-center gap-2.5 p-5 border-t sm:border-t-0 sm:border-l border-white/[0.04]">
                      {/* Details + Edit */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`details/${project._id}`}
                          style={{
                            ...btnDetailsStyle,
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
                          }}
                        >
                          Details
                        </Link>
                        <Link
                          to={`edit/${project._id}`}
                          style={{
                            ...btnEditStyle,
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
                          }}
                        >
                          Edit
                        </Link>
                      </div>

                      {/* Sprint */}
                      {sprintProgress ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            background: 'rgba(6, 182, 212, 0.06)',
                            border: '1px solid rgba(6, 182, 212, 0.15)',
                          }}
                        >
                          <div style={{ flex: 1, height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
                            <div
                              style={{
                                width: `${sprintProgress}%`,
                                height: '100%',
                                borderRadius: '99px',
                                background: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
                                boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)',
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#22d3ee', whiteSpace: 'nowrap' }}>
                            {sprintProgress}%
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={`sprint/${project._id}`}
                          style={{
                            ...btnSprintStyle,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 0',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: '12px' }}>⚡</span>
                          Sprint
                        </Link>
                      )}
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* ═══ Counter ═══ */}
        {!loading && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#475569' }}
          >
            Showing <span style={{ fontWeight: 700, color: '#94a3b8' }}>{filteredProjects.length}</span> of <span style={{ fontWeight: 700, color: '#94a3b8' }}>{projects.length}</span> projects
          </motion.div>
        )}
      </div>
    </div>
  )
}