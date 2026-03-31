import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthProvider'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export const AllComments = () => {
  const { userId } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const { id } = useParams()

  const getComment = async () => {
    try {
      const res = await axios.get(`/comment/bug/${id}`)
      setComments(res.data.data)
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  useEffect(() => {
    getComment()
  }, [id])

  // Use the first comment to extract metadata (Project & Bug names)
  const metadata = comments.length > 0 ? comments[0].bugId : null

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      {metadata && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-blue-600">
          <nav className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Project: {metadata.projectId?.title}
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">
            {metadata.title}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {metadata.priority} Priority
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Status: {metadata.status}
            </span>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Discussion ({comments.length})
        </h3>
        
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c._id} className="flex gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              {/* User Avatar */}
              <img 
                src={c.userId?.image} 
                alt={c.userId?.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900">{c.userId?.name}</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {c.comment}
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  {c.userId?.role}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 italic">No comments posted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}