import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BugDetails = () => {
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [developer, setdeveloper] = useState([]);
  const [project, setproject] = useState([]);
  const [tester, settester] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchAllDeveloper = async () => {
    try {
      const res = await axios.get("/user/developer");
      console.log(res.data.data);
      setdeveloper(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllProject = async () => {
    try {
      const res = await axios.get("/project/all");
      console.log(res.data.data);
      setproject(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllTester = async () => {
    try {
      const res = await axios.get("/user/tester");
      console.log(res.data.data);
      settester(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBug = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/bug/bug/${id}`);
      setBug(res.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch bug details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBug();
      fetchAllDeveloper();
      fetchAllProject();
      fetchAllTester();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <h2 className="text-lg font-mono font-bold tracking-widest text-slate-600 uppercase">
          Loading...
        </h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 gap-4">
        <p className="text-red-600 font-mono text-sm">{error}</p>
        <button
          onClick={getBug}
          className="px-5 py-2 bg-red-100 text-red-700 font-mono text-xs uppercase tracking-widest border border-red-400 hover:bg-red-200 hover:border-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data
  if (!bug) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">No Bug Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-4 py-2 bg-white text-slate-600 font-mono text-xs uppercase tracking-widest border-l-4 border-amber-400 shadow-sm hover:bg-amber-50 hover:text-amber-700"
        >
          ← Back
        </button>

        {/* Title Block */}
        <div className="mb-8 bg-white border-l-4 border-amber-400 pl-5 pr-4 py-4 shadow-sm">
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">Bug Report</p>
          <h1 className="text-2xl font-mono font-bold text-slate-800">
            {bug.title}
          </h1>
        </div>

        {/* Description Block */}
        <div className="bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 p-5 mb-4 hover:bg-sky-100 hover:border-l-sky-600">
          <p className="text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">Description</p>
          <p className="text-slate-700 font-mono text-sm leading-relaxed">{bug.description}</p>
        </div>

        {/* Reproduce Block */}
        <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 mb-4 hover:bg-orange-100 hover:border-l-orange-600">
          <p className="text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">Steps to Reproduce</p>
          <p className="text-slate-700 font-mono text-sm leading-relaxed">{bug.reproduce}</p>
        </div>

        {/* Expected Result Block */}
        <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 p-5 mb-6 hover:bg-emerald-100 hover:border-l-emerald-600">
          <p className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">Expected Result</p>
          <p className="text-slate-700 font-mono text-sm leading-relaxed">{bug.expectedResult}</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-300" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Meta</span>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

          <div className="bg-amber-50 border border-amber-200 p-4 hover:bg-amber-100 hover:border-amber-400">
            <p className="text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">Priority</p>
            <p className="text-slate-800 font-mono font-bold text-sm">{bug.priority}</p>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-4 hover:bg-sky-100 hover:border-sky-400">
            <p className="text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">Status</p>
            <p className="text-slate-800 font-mono font-bold text-sm">{bug.status}</p>
          </div>

          <div className="bg-violet-50 border border-violet-200 p-4 hover:bg-violet-100 hover:border-violet-400">
            <p className="text-xs font-mono text-violet-600 uppercase tracking-widest mb-2">Type</p>
            <p className="text-slate-800 font-mono font-bold text-sm">{bug.type}</p>
          </div>

        </div>

        {/* People & Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

          <div className="bg-emerald-50 border border-emerald-200 p-4 hover:bg-emerald-100 hover:border-emerald-400">
            <p className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">Assigned To</p>
            <p className="text-slate-700 font-mono text-sm">
              {Array.isArray(bug.assigned)
                ? bug.assigned.map((dev) => dev.name).join(", ")
                : bug.assigned?.name}
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 hover:bg-rose-100 hover:border-rose-400">
            <p className="text-xs font-mono text-rose-600 uppercase tracking-widest mb-2">Reported By</p>
            <p className="text-slate-700 font-mono text-sm">{bug.reportedBy?.name}</p>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 hover:bg-cyan-100 hover:border-cyan-400">
            <p className="text-xs font-mono text-cyan-600 uppercase tracking-widest mb-2">Project</p>
            <p className="text-slate-700 font-mono text-sm">{bug.projectName?.projectName}</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 hover:bg-orange-100 hover:border-orange-400">
            <p className="text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">Due Date</p>
            <p className="text-slate-700 font-mono text-sm">{bug.dueDate}</p>
          </div>

        </div>

        {/* Bug Screenshot */}
        {bug.image && (
          <div className="bg-violet-50 border border-violet-200 border-l-4 border-l-violet-500 p-5 hover:bg-violet-100 hover:border-l-violet-600">
            <p className="text-xs font-mono text-violet-600 uppercase tracking-widest mb-4">Bug Screenshot</p>
            <img
              src={bug.image}
              alt="Bug Screenshot"
              className="w-72 border border-violet-200 shadow-sm"
            />
          </div>
        )}

      </div>
    </div>
  );
};