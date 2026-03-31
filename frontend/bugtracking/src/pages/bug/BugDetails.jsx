import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BugDetails = () => {
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchBugData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the specific bug by ID
      const res = await axios.get(`/bug/bug/${id}`);
      setBug(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch bug details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBugData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-mono font-bold tracking-widest text-slate-600 uppercase">Loading Bug Data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <p className="text-red-600 font-mono font-bold">{error}</p>
        <button onClick={fetchBugData} className="px-6 py-2 bg-white border border-red-400 text-red-600 font-mono text-xs uppercase hover:bg-red-50">
          Retry Fetch
        </button>
      </div>
    );
  }

  if (!bug) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 px-4 py-10 font-mono">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white border-l-4 border-amber-400 shadow-sm text-xs uppercase tracking-widest hover:bg-amber-50 transition-colors"
        >
          ← Return to List
        </button>

        {/* HEADER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white p-6 border-l-4 border-amber-400 shadow-sm">
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.2em]">Bug Entry #{bug._id.slice(-6)}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 uppercase">{bug.title}</h1>
            <div className="flex gap-2 mt-4">
              <span className={`px-3 py-1 text-[10px] font-bold text-white uppercase ${bug.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}>
                {bug.priority} Priority
              </span>
              <span className="px-3 py-1 text-[10px] font-bold bg-slate-800 text-white uppercase">
                {bug.status}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold bg-sky-500 text-white uppercase">
                {bug.type}
              </span>
            </div>
          </div>
          
          {/* IMAGE PREVIEW */}
          <div className="bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center">
            {bug.image ? (
              <a href={bug.image} target="_blank" rel="noreferrer">
                <img src={bug.image} alt="Bug" className="max-h-32 w-full object-cover grayscale hover:grayscale-0 transition-all cursor-zoom-in" />
              </a>
            ) : (
              <span className="text-slate-300 text-[10px] uppercase">No Image Attached</span>
            )}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: BUG SPECIFICS */}
          <div className="space-y-6">
            <div className="bg-sky-50 border-l-4 border-sky-500 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-sky-700 uppercase mb-3 tracking-widest">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{bug.description}</p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-emerald-700 uppercase mb-3 tracking-widest">Expected Result</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{bug.expectedResult}</p>
            </div>
            
            <div className="bg-white border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Timestamps</h3>
              <div className="text-[11px] space-y-2">
                <div className="flex justify-between"><span>REPORTED:</span> <span>{new Date(bug.createdAt).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-orange-600"><span>DUE DATE:</span> <span>{bug.dueDate}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROJECT & TEAM */}
          <div className="space-y-6">
            <div className="bg-slate-800 text-slate-100 p-5 shadow-lg border-t-4 border-amber-400">
              <h3 className="text-xs font-bold text-amber-400 uppercase mb-3 tracking-widest">Linked Project</h3>
              <p className="text-lg font-bold mb-1">{bug.projectId?.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-3 mb-4">{bug.projectId?.description}</p>
              
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-[10px] text-slate-500 uppercase mb-2">Assigned Developers</h4>
                <div className="space-y-2">
                  {bug.projectId?.assignedDevelopers?.map((dev) => (
                    <div key={dev._id} className="flex items-center gap-3 bg-slate-700/50 p-2 rounded">
                      <img src={dev.image} alt={dev.name} className="w-6 h-6 rounded-full border border-amber-400" />
                      <div>
                        <p className="text-[11px] font-bold">{dev.name}</p>
                        <p className="text-[9px] text-slate-400">{dev.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Assigned Tester</h3>
              {bug.projectId?.assignedTester?.map((tester) => (
                <div key={tester._id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">{tester.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FULL SCREENSHOT SECTION */}
        {bug.image && (
          <div className="mt-8 bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest text-center">Visual Evidence</h3>
            <img src={bug.image} alt="Full evidence" className="w-full border border-slate-100" />
          </div>
        )}
      </div>
    </div>
  );
};