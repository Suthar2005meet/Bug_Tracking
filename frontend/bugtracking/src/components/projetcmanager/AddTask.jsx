import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { useToast } from '../../hooks/useToast';
import { motion } from 'framer-motion';

export const AddTask = () => {
    const { sprintId, projectId } = useParams();
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setuser] = useState([])
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        issueType: 'Task',
        priority: 'Medium',
        status: 'Open',
        assigned: '',
        dueDate: '',
    });

    const getUser = async () => {
        try {
            const res = await axios.get("/usermanage/my-team");
            if (res.data.team && res.data.team.users) {
                setuser(res.data.team.users);
                console.log(res.data.team.users)
            } else {
                setuser([]);
            }
        } catch (err) {
            console.log(err);
            setuser([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('projectId', projectId);
        data.append('sprintId', sprintId);
        data.append('reporterId', userId);
        if (file) data.append('document', file);

        try {
            await axios.post('/issue/add', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success("🚀 Issue created successfully!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create issue.");
        } finally { setLoading(false); }
    };

    useEffect(() => { getUser() }, []);

    return (
        <div className="flex items-center justify-center py-8 px-4 relative">
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl glass overflow-hidden relative z-10"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-b border-white/[0.06] px-8 py-6">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-lg text-white shadow-lg shadow-cyan-500/20">📝</span>
                        <div>
                            <h2 className="text-lg font-extrabold text-white">Create New Issue</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Fill in the details to log a new issue</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Summary / Title</label>
                        <input type="text" name="title" required className="input-dark" placeholder="e.g., Fix login button alignment" onChange={handleChange} />
                    </div>

                    {/* Type + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Issue Type</label>
                            <select name="issueType" onChange={handleChange} className="input-dark">
                                <option value="Task">🟢 Task</option>
                                <option value="Bug">🔴 Bug</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="input-dark">
                                <option value="Low">🔵 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🟠 High</option>
                                <option value="Critical">🔥 Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee + Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Assignee</label>
                            <select name="assigned" required onChange={handleChange} defaultValue="" className="input-dark">
                                <option value="" disabled>Select a user...</option>
                                {user.length > 0 && (
                                    <optgroup label="Users">
                                        {user.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}   ({u.role})</option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Due Date</label>
                            <input type="date" name="dueDate" required className="input-dark" onChange={handleChange} />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Attachments</label>
                        <div className="relative group">
                            <div className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all duration-200
                                ${file ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/[0.08] bg-white/[0.02] group-hover:border-cyan-500/20 group-hover:bg-white/[0.04]'}`}>
                                <svg className={`w-7 h-7 mb-2 transition-colors ${file ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-slate-500">
                                    {file ? (<span className="text-cyan-400 font-semibold">{file.name}</span>) : (<span>Click to upload <span className="text-slate-600">or drag & drop</span></span>)}
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5">Images, PDFs or Documents</p>
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.04]" />

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/[0.06]">Cancel</button>
                        <button type="submit" disabled={loading} className={`flex-[2] py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 border-0 ${loading ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''}`}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};