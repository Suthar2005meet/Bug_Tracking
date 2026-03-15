import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ── Add to tailwind.config.js → theme.extend ──────────────────
   animation: {
     'fade-up':    'fadeUp 0.6s ease forwards',
     'slide-in':   'slideIn 0.5s ease forwards',
     'pop-in':     'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
     'pulse-dot':  'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
   },
   keyframes: {
     fadeUp:  { '0%': { opacity:'0', transform:'translateY(24px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
     slideIn: { '0%': { opacity:'0', transform:'translateX(-20px)' }, '100%': { opacity:'1', transform:'translateX(0)' } },
     popIn:   { '0%': { opacity:'0', transform:'scale(0.85)' }, '100%': { opacity:'1', transform:'scale(1)' } },
   },
──────────────────────────────────────────────────────────────── */

export const BugDetails = () => {
  const [bug, setBug]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [visible, setVisible] = useState(false);
  const { id }   = useParams();
  const navigate = useNavigate();

  const getBug = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/bug/bug/${id}`);
      setBug(res.data.data);
      setTimeout(() => setVisible(true), 60);
    } catch (err) {
      setError(err.message || "Failed to fetch bug details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) getBug(); }, [id]);

  /* ── LOADING ── */
  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
        </div>
        <p className="font-mono text-xs tracking-[0.2em] text-blue-400 uppercase">Fetching bug data...</p>
      </div>
    );

  /* ── ERROR ── */
  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl shadow-red-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500">✕</div>
          <p className="font-mono text-sm text-red-500">{error}</p>
          <button onClick={getBug} className="mt-5 rounded-xl bg-red-500 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-red-600 hover:scale-105 active:scale-95 shadow-lg shadow-red-200">
            Retry
          </button>
        </div>
      </div>
    );

  if (!bug) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/60 px-4 py-8 sm:px-6 lg:px-8">

      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-slate-500 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to List
        </button>

        {/* ── MAIN CARD ── */}
        <div
          className={`overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-blue-100/60 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >

          {/* ── HEADER ── */}
          <div className="relative overflow-hidden border-b border-slate-100 px-6 py-6 sm:px-8">
            {/* Colorful gradient header bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 opacity-100" />
            {/* Grid texture overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-200">
                  Bug · #{bug._id?.slice(-6)?.toUpperCase() || "000000"}
                </p>
                <h1 className="text-xl font-bold leading-tight text-white drop-shadow-sm sm:text-2xl lg:text-3xl">
                  {bug.title}
                </h1>
              </div>
              <PriorityPill value={bug.priority} />
            </div>

            <div className="relative mt-4 flex flex-wrap gap-2">
              <StatusBadge value={bug.status} />
              <TypeBadge   value={bug.type} />
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* ── MAIN CONTENT ── */}
            <div className="space-y-8 border-b border-slate-100 p-6 sm:p-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:border-slate-100">

              {/* Description */}
              <Section label="Description" icon="📋" delay="delay-100">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
                  {bug.description}
                </p>
              </Section>

              {/* Steps to Reproduce */}
              <Section label="Steps to Reproduce" icon="🔁" delay="delay-200">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
                  <p className="break-words font-mono text-xs leading-relaxed text-orange-700">
                    {bug.reproduce}
                  </p>
                </div>
              </Section>

              {/* Expected Result */}
              {bug.expectedResult && (
                <Section label="Expected Result" icon="✅" delay="delay-300">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <p className="break-words text-sm leading-relaxed text-emerald-700">
                      {bug.expectedResult}
                    </p>
                  </div>
                </Section>
              )}

              {/* Attachment */}
              {bug.image && (
                <Section label="Attachment" icon="🖼️" delay="delay-300">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    <img
                      src={bug.image}
                      alt="Bug Screenshot"
                      className="max-h-[480px] w-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </Section>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div className="bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 sm:p-8">
              <p className="mb-6 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                ◈ Details
              </p>

              <div className="space-y-1">
                <DetailBox label="Priority"    value={bug.priority}    isPriority delay="delay-100" />
                <DetailBox label="Assigned To" value={bug.assignedTo}             delay="delay-150" />
                <DetailBox label="Reported By" value={bug.reportedBy}             delay="delay-200" />
                <DetailBox label="Project"     value={bug.project}                delay="delay-250" />
                <DetailBox label="Due Date"    value={bug.duedate}                delay="delay-300" />
              </div>

              {/* Stats strip */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <StatCard label="Reopens"  value={bug.reopens  ?? "—"} bg="bg-orange-50"  border="border-orange-200" color="text-orange-600" />
                <StatCard label="Severity" value={bug.severity ?? "—"} bg="bg-violet-50"  border="border-violet-200" color="text-violet-600" />
              </div>

              {/* Timeline hint */}
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-widest text-blue-400">Reported</p>
                <p className="text-sm font-semibold text-blue-700">{bug.createdAt ? new Date(bug.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ══════════════════════════════════════════════════════════════ */

const Section = ({ label, icon, children, delay = "" }) => (
  <div className={`animate-fade-up ${delay}`}>
    <h3 className="mb-3 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      <span className="text-sm">{icon}</span>
      {label}
    </h3>
    {children}
  </div>
);

const DetailBox = ({ label, value, isPriority, delay = "" }) => {
  const priorityColor =
    value === "High"   ? "text-red-600 bg-red-50 border-red-200"      :
    value === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
    value === "Low"    ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
    "";

  return (
    <div className={`rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white hover:shadow-sm animate-slide-in ${delay} ${isPriority && priorityColor ? `border ${priorityColor}` : "border border-transparent"}`}>
      <h4 className="mb-1 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </h4>
      <p className={`break-words text-sm font-semibold ${isPriority && priorityColor ? priorityColor.split(" ")[0] : "text-slate-700"}`}>
        {value || <span className="font-normal italic text-slate-400">Not specified</span>}
      </p>
    </div>
  );
};

const StatCard = ({ label, value, bg, border, color }) => (
  <div className={`rounded-2xl border ${border} ${bg} px-3 py-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105`}>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-500">{label}</p>
  </div>
);

const PriorityPill = ({ value }) => {
  const map = {
    High:   "bg-red-500    text-white  shadow-red-200",
    Medium: "bg-amber-400  text-white  shadow-amber-200",
    Low:    "bg-emerald-500 text-white shadow-emerald-200",
  };
  const cls = map[value] || "bg-slate-400 text-white shadow-slate-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest shadow-lg ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse-dot" />
      {value || "Unknown"}
    </span>
  );
};

const StatusBadge = ({ value }) => {
  const map = {
    open:       "bg-yellow-400/20 text-yellow-100 border border-yellow-300/40",
    inprogress: "bg-blue-400/20   text-blue-100   border border-blue-300/40",
    resolved:   "bg-emerald-400/20 text-emerald-100 border border-emerald-300/40",
    closed:     "bg-white/10      text-white/60   border border-white/20",
  };
  const key = value?.toLowerCase?.().replace(/\s/g, "") || "";
  const cls = map[key] || "bg-white/10 text-white/70 border border-white/20";
  return (
    <span className={`rounded-lg px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest ${cls}`}>
      {value}
    </span>
  );
};

const TypeBadge = ({ value }) => (
  <span className="rounded-lg border border-violet-300/40 bg-violet-400/20 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-violet-100">
    {value}
  </span>
);