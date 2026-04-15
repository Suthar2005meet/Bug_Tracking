import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BugDetails = () => {
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bugid, id } = useParams();
  const effectiveBugId = bugid || id;
  const navigate = useNavigate();

  const fetchBugData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/bug/bug/${effectiveBugId}`);
      setBug(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch bug details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveBugId) fetchBugData();
  }, [effectiveBugId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase">Loading Bug Data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-400 font-bold text-sm">{error}</p>
        <button onClick={fetchBugData} className="btn-ghost text-sm">Retry Fetch</button>
      </div>
    );
  }

  if (!bug) return null;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
        >
          ← Return to List
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="md:col-span-2 glass p-6 border-l-[3px] border-l-cyan-500">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Bug Entry #{bug._id.slice(-6)}</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1">{bug.title}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`badge ${bug.priority === 'High' ? 'badge-high' : 'badge-medium'}`}>{bug.priority} Priority</span>
              <span className="badge bg-white/[0.06] text-slate-300 border border-white/[0.08]">{bug.status}</span>
              <span className="badge bg-cyan-500/12 text-cyan-400 border border-cyan-500/20">{bug.type}</span>
            </div>
          </div>
          
          <div className="glass p-3 flex items-center justify-center">
            {bug.image ? (
              <a href={bug.image} target="_blank" rel="noreferrer">
                <img src={bug.image} alt="Bug" className="max-h-32 w-full object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-zoom-in" />
              </a>
            ) : (
              <span className="text-slate-600 text-[10px] uppercase">No Image Attached</span>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Left */}
          <div className="space-y-6">
            <div className="glass p-5 border-l-[3px] border-l-cyan-500/50">
              <h3 className="text-[10px] font-bold text-cyan-400 uppercase mb-3 tracking-widest">Description</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{bug.description}</p>
            </div>

            <div className="glass p-5 border-l-[3px] border-l-emerald-500/50">
              <h3 className="text-[10px] font-bold text-emerald-400 uppercase mb-3 tracking-widest">Expected Result</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{bug.expectedResult}</p>
            </div>
            
            <div className="glass p-5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Timestamps</h3>
              <div className="text-[11px] space-y-2 text-slate-500">
                <div className="flex justify-between"><span>REPORTED:</span> <span className="text-slate-400">{new Date(bug.createdAt).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-amber-400"><span>DUE DATE:</span> <span>{bug.dueDate}</span></div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="glass p-5 bg-gradient-to-br from-[#141a2e] to-[#0c1020] border-t-[3px] border-t-cyan-500/50">
              <h3 className="text-[10px] font-bold text-cyan-400 uppercase mb-3 tracking-widest">Linked Project</h3>
              <p className="text-lg font-bold text-white mb-1">{bug.projectId?.title}</p>
              <p className="text-[11px] text-slate-500 line-clamp-3 mb-4">{bug.projectId?.description}</p>
              
              <div className="border-t border-white/[0.04] pt-4">
                <h4 className="text-[10px] text-slate-600 uppercase mb-2 font-bold tracking-widest">Assigned Developers</h4>
                <div className="space-y-2">
                  {bug.projectId?.assignedDevelopers?.map((dev) => (
                    <div key={dev._id} className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-lg border border-white/[0.04]">
                      <img src={dev.image} alt={dev.name} className="w-6 h-6 rounded-full border border-cyan-500/30" />
                      <div>
                        <p className="text-[11px] font-bold text-white">{dev.name}</p>
                        <p className="text-[9px] text-slate-500">{dev.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass p-5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Assigned Tester</h3>
              {bug.projectId?.assignedTester?.map((tester) => (
                <div key={tester._id} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-sm text-slate-400">{tester.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Full Screenshot */}
        {bug.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 glass p-6"
          >
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest text-center">Visual Evidence</h3>
            <img src={bug.image} alt="Full evidence" className="w-full rounded-lg border border-white/[0.06]" />
          </motion.div>
        )}
      </div>
    </div>
  );
};