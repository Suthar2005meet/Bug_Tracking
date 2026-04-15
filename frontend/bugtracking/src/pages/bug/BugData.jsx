import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export const BugData = () => {
    const { id } = useParams();
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBugDetails = async () => {
        try {
            const res = await axios.get(`/bug/bug/${id}`);
            setBug(res.data.data);
        } catch (err) {
            console.error("Error fetching bug details:", err);
            setError("Could not load bug details.");
        } finally {
            setLoading(false);
        }
        };
        if (id) fetchBugDetails();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin" /></div>;
    if (error) return <div className="text-center py-20 text-red-400 font-bold">{error}</div>;
    if (!bug) return <div className="text-center py-20 text-slate-600">No bug found.</div>;

    return (
        <div className="relative w-full">
            <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto relative z-10">
                <h1 className="text-2xl font-extrabold text-white mb-6">Bug Detail View</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    {bug.image && (
                        <div className="glass p-3 flex-shrink-0 md:w-80">
                            <img src={bug.image} alt={bug.title} className="w-full rounded-lg" />
                        </div>
                    )}
                    <div className="flex-1 space-y-4">
                        <div className="glass p-5 border-l-[3px] border-l-cyan-500">
                            <h2 className="text-lg font-bold text-white mb-2">{bug.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className={`badge ${bug.status === "Open" ? "badge-open" : "badge-resolved"}`}>{bug.status}</span>
                                <span className={`badge ${bug.priority === "High" ? "badge-high" : "badge-medium"}`}>{bug.priority}</span>
                                <span className="badge bg-violet-500/12 text-violet-400 border border-violet-500/20">{bug.type}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Due: {new Date(bug.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="glass p-5">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{bug.description}</p>
                        </div>
                        <div className="glass p-5">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Expected Result</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{bug.expectedResult}</p>
                        </div>
                    </div>
                </div>

                {bug.projectId && (
                    <div className="glass p-5 mt-4">
                        <h3 className="text-sm font-bold text-white mb-3">Project Information</h3>
                        <p className="text-sm text-slate-400"><span className="text-slate-300 font-semibold">Name:</span> {bug.projectId.title}</p>
                        <p className="text-sm text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Description:</span> {bug.projectId.description}</p>
                        <p className="text-sm text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Timeline:</span> {new Date(bug.projectId.startDate).toLocaleDateString()} to {new Date(bug.projectId.dueDate).toLocaleDateString()}</p>
                        {bug.projectId.assignedDevelopers?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Assigned Developers</p>
                                <div className="space-y-1">
                                    {bug.projectId.assignedDevelopers.map((dev) => (
                                        <p key={dev._id} className="text-sm text-slate-400">{dev.name} <span className="text-slate-600">({dev.email})</span></p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};