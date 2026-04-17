import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiClock, FiFileText, FiLink, FiShield, FiUsers } from "react-icons/fi";

export const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/project/details/${id}`);
      setProject(res.data.data);
    } catch (err) {
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const getPriorityStyle = (priority) => {
    const p = priority?.toLowerCase() || 'medium';
    const config = {
      high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: '🔴' },
      medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🟡' },
      low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🟢' }
    };
    return config[p] || config.medium;
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || 'pending';
    const config = {
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
      'in progress': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
      pending: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-white/10' }
    };
    return config[s] || config.pending;
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/5 border-t-cyan-500 rounded-full animate-spin mb-4" />
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Encrypting Project Data...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="glass p-8 border-l-4 border-l-red-500 text-center">
        <h3 className="text-white font-bold mb-2">Access Denied</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-ghost text-xs">Return Safely</button>
      </div>
    </div>
  );

  if (!project) return null;

  const prio = getPriorityStyle(project.priority);
  const stat = getStatusStyle(project.status);

  return (
    <div className="relative w-full pb-12">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-40" />

      {/* Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full transition-all text-slate-400 hover:text-white group border border-transparent hover:border-white/10"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
      </motion.button>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass overflow-hidden mb-6"
      >
        <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/5 to-transparent p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${stat.bg} ${stat.text} ${stat.border}`}>
                  {project.status || 'Pending'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${prio.bg} ${prio.text} ${prio.border}`}>
                  {prio.icon} {project.priority} Priority
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-500 text-xs font-semibold">
                <div className="flex items-center gap-2"><FiClock /> Created {new Date(project.createdAt).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><FiShield /> PM: <span className="text-cyan-400">{project.createdBy?.name}</span></div>
              </div>
            </div>
            
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center justify-center p-4 text-center">
              <span className="text-[10px] text-slate-600 font-bold uppercase mb-1">ID</span>
              <span className="text-xs font-mono text-slate-400">#{id?.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-6">
              <FiFileText className="text-cyan-400" /> Project Brief
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {project.description || "No description provided for this project."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
              <h3 className="flex items-center gap-2 text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
                <FiCalendar className="text-emerald-400" /> Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Launch Date</p>
                  <p className="text-white font-bold">{project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not Scheduled'}</p>
                </div>
                <div className="pt-4 border-t border-white/[0.04]">
                  <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Target Deadline</p>
                  <p className="text-red-400 font-bold">{project.dueDate ? new Date(project.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No Deadline Set'}</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
              <h3 className="flex items-center gap-2 text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
                <FiLink className="text-amber-400" /> Resources
              </h3>
              <div className="mt-4">
                {project.document ? (
                  <a href={project.document} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl transition-all group">
                    <span className="text-xs text-white font-bold uppercase tracking-widest">Internal Documentation</span>
                    <span className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">↗</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 opacity-40">
                    <FiFileText size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Attachments</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Members List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-8 h-fit lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
              <FiUsers className="text-violet-400" /> Crew List
            </h3>
            <span className="bg-violet-500/10 text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-md">
              {project.members?.length || 0} Total
            </span>
          </div>

          {/* <div className="space-y-4">
            {project.members && project.members.length > 0 ? (
              project.members.map((member, i) => (
                <div key={member._id} className="group flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] rounded-2xl transition-all">
                  <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-white/10 group-hover:border-violet-500/40 transition-colors">
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-violet-400 transition-colors">{member.name}</p>
                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-tight">{member.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest">No active members</p>
              </div>
            )}
          </div> */}

          <div className="mt-8 pt-8 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <FiCheckCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Quality Check Passed</span>
            </div>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
              This project record is verified for the BugTrack version control engine.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

