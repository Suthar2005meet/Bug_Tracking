import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';

export const AddTask = () => {
    const { sprintId, projectId } = useParams();
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    // const [developer, setDeveloper] = useState([]);
    // const [tester, setTester] = useState([]);
    // const [pm, setPm] = useState([]);
    const [user , setuser] = useState([])
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

    // const developerData = async () => {
    //     try {
    //         const res = await axios.get('/user/developer');
    //         setDeveloper(res.data.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // const testerData = async () => {
    //     try {
    //         const res = await axios.get('/user/tester');
    //         setTester(res.data.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // const projectManagerData = async () => {
    //     try {
    //         const res = await axios.get('/user/projectmanager');
    //         setPm(res.data.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    const getUser = async () => {
    try {
        const res = await axios.get("/usermanage/my-team");

        if (res.data.team && res.data.team.users) {
            setuser(res.data.team.users);   // ✅ Correct path
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
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
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
            await axios.post('/issue/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("🚀 Issue created successfully!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert("Failed to create issue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // developerData();
        // testerData();
        // projectManagerData();
        getUser()
    }, []);

    const selectClass =
        "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer hover:border-slate-300";

    const inputClass =
        "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400";

    const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-xl text-lg shadow-lg shadow-blue-900/40">
                            📝
                        </span>
                        <div>
                            <h2 className="text-white text-lg font-bold leading-tight">Create New Issue</h2>
                            <p className="text-slate-400 text-xs mt-0.5">Fill in the details to log a new issue</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">

                    {/* Title */}
                    <div>
                        <label className={labelClass}>Summary / Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className={inputClass}
                            placeholder="e.g., Fix login button alignment"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Issue Type + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Issue Type</label>
                            <select name="issueType" onChange={handleChange} className={selectClass}>
                                <option value="Task">🟢 Task</option>
                                <option value="Bug">🔴 Bug</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className={selectClass}>
                                <option value="Low">🔵 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🟠 High</option>
                                <option value="Critical">🔥 Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee + Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Assignee — grouped by role */}
                        <div>
                            <label className={labelClass}>Assignee</label>
                            <select
                                name="assigned"
                                required
                                onChange={handleChange}
                                defaultValue=""
                                className={selectClass}
                            >
                                <option value="" disabled>Select a user...</option>

                                {user.length > 0 && (
                                    <optgroup label="Users">
                                        {user.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}   ({u.role})</option>
                                        ))}
                                    </optgroup>
                                )}

                                {/* {developer.length > 0 && (
                                    <optgroup label="👨‍💻 Developers">
                                        {developer.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </optgroup>
                                )}

                                {tester.length > 0 && (
                                    <optgroup label="🧪 Testers">
                                        {tester.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </optgroup>
                                )}

                                {pm.length > 0 && (
                                    <optgroup label="📋 Project Managers">
                                        {pm.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </optgroup>
                                )} */}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className={labelClass}>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                className={inputClass}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className={labelClass}>Attachments</label>
                        <div className="relative group">
                            <div className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all duration-200
                                ${file
                                    ? 'border-blue-400 bg-blue-50/60'
                                    : 'border-slate-200 bg-slate-50 group-hover:border-blue-300 group-hover:bg-blue-50/30'
                                }`}
                            >
                                <svg className={`w-7 h-7 mb-2 transition-colors ${file ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm font-semibold text-slate-600">
                                    {file ? (
                                        <span className="text-blue-600">{file.name}</span>
                                    ) : (
                                        <span>Click to upload <span className="font-normal text-slate-400">or drag & drop</span></span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">Images, PDFs or Documents</p>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100" />

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-3 text-white text-sm font-bold rounded-xl shadow-lg transition-all duration-150
                                ${loading
                                    ? 'bg-blue-300 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-95'
                                }`}
                        >
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
            </div>
        </div>
    );
};