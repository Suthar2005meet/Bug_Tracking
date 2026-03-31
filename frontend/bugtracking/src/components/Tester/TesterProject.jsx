import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthProvider'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const TesterProject = () => {
    const { userId } = useContext(AuthContext)
    const [projects, setprojects] = useState([])
    const [loading, setloading] = useState(true)

    const getProject = async () => {
        try {
            const res = await axios.get(`project/tester/${userId}`)
            setprojects(res.data.data || [])
        } catch (err) {
            console.log(err)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getProject()
        }
    }, [userId])

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Tester Projects
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Monitor assigned projects and manage quality assurance.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            {projects.length === 0 ? (
                <div className="text-center bg-white rounded-2xl p-16 shadow-sm border border-slate-200">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">No Assigned Projects found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                        QA Mode
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">
                                        ID: {project._id.slice(-6)}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                    {project.title}
                                </h3>
                                
                                <p className="text-sm text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="mt-6 pt-4 border-t border-slate-50 space-y-2">
                                    <div className="flex items-center text-xs text-slate-500 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        Start: <span className="text-slate-700 ml-1">{project.startDate}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-red-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Deadline: <span className="text-slate-700 ml-1">{project.dueDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="bg-slate-50 p-4 flex gap-3 border-t border-slate-100">
                                <Link 
                                    to={`/project/details/${project._id}`} 
                                    className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm"
                                >
                                    View Details
                                </Link>
                                <Link 
                                    to="createbug" 
                                    className="flex-1 bg-rose-600 text-white text-center py-2.5 rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Report Bug
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}