import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../AuthProvider'

export const Projects = () => {
  const {userId, role} = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const getProjects = async () => {
    try {
      setLoading(true)
      // const res = await axios.get(`/project/user/${userId}`)
      if(role === "ProjectManager"){
        const res = await axios.get(`/project/user/${userId}`)
        setProjects(res.data.data)
      }else{
        const res = await axios.get('/project/all')
        setProjects(res.data.data)
      }
      // setProjects(res.data.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  // Fixed filter with null checks
  const filteredProjects = projects.filter(project => {
    const name = project?.projectName || ''
    const description = project?.description || ''
    const search = searchTerm.toLowerCase()
    
    return (
      name.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    )
  })

  const getGradientColor = (index) => {
    const colors = [
      'from-blue-400 to-blue-500',
      'from-purple-400 to-purple-500',
      'from-pink-400 to-pink-500',
      'from-green-400 to-green-500',
      'from-indigo-400 to-indigo-500',
      'from-cyan-400 to-cyan-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-12 animate-fadeIn'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            My Projects
          </h1>
          <p className='text-gray-600 text-lg'>Create, manage and organize your projects</p>
        </div>

        {/* Search & Add */}
        <div className='flex flex-col sm:flex-row gap-4 mb-12 animate-slideUp'>
          <div className='flex-1 relative group'>
            <input
              type='search'
              placeholder='Search projects by name or description...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-3 pl-11 bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm group-hover:border-gray-400 group-hover:shadow-md'
            />
            <svg className='absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>

          <Link
            to='createproject'
            className='px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2 whitespace-nowrap'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            New Project
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex justify-center items-center py-32'>
            <div className='animate-spin'>
              <div className='w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full'></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className='text-center py-32 animate-fadeIn'>
            <div className='bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl p-12 border border-gray-200'>
              <svg className='w-20 h-20 text-gray-400 mx-auto mb-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <h3 className='text-2xl font-semibold text-gray-900 mb-2'>No projects found</h3>
              <p className='text-gray-600 mb-8'>
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
              </p>
              {!searchTerm && (
                <Link
                  to='createproject'
                  className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
                >
                  Create Project
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Horizontal Cards */}
        {!loading && filteredProjects.length > 0 && (
          <div className='space-y-4'>
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className='animate-scaleIn'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className='group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:-translate-y-1 flex flex-col md:flex-row items-stretch relative'>
                  
                  {/* Left Icon Section */}
                  <div className={`bg-gradient-to-br ${getGradientColor(index)} p-6 md:p-8 flex items-center justify-center min-w-fit md:min-w-[180px] group-hover:scale-105 transition-transform`}>
                    <div className='text-center'>
                      <div className='w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/40 transition-all'>
                        <svg className='w-8 h-8 md:w-10 md:h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                      </div>
                      <p className='text-white text-xs font-semibold opacity-95'>Project</p>
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div className='flex-grow p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50'>
                    <div>
                      <h2 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-600 group-hover:to-purple-600 transition-all truncate'>
                        {project.title || 'Untitled Project'}
                      </h2>
                      <p className='text-gray-600 text-sm md:text-base line-clamp-2 group-hover:text-gray-700 transition-colors'>
                        {project.description || 'No description provided'}
                      </p>
                    </div>
                    <div className='flex gap-4 mt-4 text-xs md:text-sm text-gray-500'>
                      <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>Active</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                        </svg>
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className='px-6 md:px-8 py-4 md:py-8 flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-200 group-hover:border-blue-200 bg-gradient-to-b md:bg-gradient-to-l from-gray-50 to-white transition-all'>
                    <Link
                      to={`details/${project._id}`}
                      className='px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-center text-sm transition-all active:scale-95 shadow-sm hover:shadow-md'
                    >
                      Details
                    </Link>
                    <Link
                      to={`edit/${project._id}`}
                      className='px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold text-center text-sm transition-all active:scale-95 shadow-sm hover:shadow-md'
                    >
                      Edit
                    </Link>
                    <Link
                      to={`sprint/${project._id}`}
                      className='px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold text-center text-sm transition-all active:scale-95 shadow-sm hover:shadow-md'
                    >
                      Sprint
                    </Link>
                  </div>

                  {/* Top Border Animation */}
                  <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Counter */}
        {!loading && filteredProjects.length > 0 && (
          <div className='mt-8 text-center text-gray-600 text-sm animate-fadeIn'>
            Showing <span className='font-semibold text-gray-900'>{filteredProjects.length}</span> of <span className='font-semibold text-gray-900'>{projects.length}</span> projects
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; opacity: 0; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}