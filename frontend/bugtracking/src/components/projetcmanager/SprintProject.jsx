import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, Edit2, Save, X } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";

export const SprintProject = () => {
  const { id } = useParams();
  const toast = useToast();
  const [sprints, setSprints] = useState([]);
  const [sprintTasks, setSprintTasks] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedSprints, setExpandedSprints] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(`/sprint/project/${id}`);
      const sprintData = Array.isArray(res.data.data) ? res.data.data : res.data.data ? [res.data.data] : [];
      setSprints(sprintData);
      sprintData.forEach((sprint, index) => {
        fetchTasks(sprint._id);
        if (index === 0) setExpandedSprints((prev) => ({ ...prev, [sprint._id]: true }));
      });
    } catch (err) { console.error("Error fetching sprints:", err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/user/all");
      setUsers(res.data.data.filter(u => u.role === "Developer" || u.role === "Tester"));
    } catch (err) { console.error("Error fetching users:", err); }
  };

  const fetchTasks = async (sprintId) => {
    try {
      const res = await axios.get(`/issue/sprint/${sprintId}`);
      const issueList = Array.isArray(res.data.data) ? res.data.data : res.data.data ? [res.data.data] : [];
      const populatedTasks = await Promise.all(
        issueList.map(async (issue) => {
          const detailsRes = await axios.get(`/issue/details/${issue._id}`);
          return detailsRes.data.data;
        })
      );
      setSprintTasks((prev) => ({ ...prev, [sprintId]: populatedTasks }));
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setSprintTasks((prev) => ({ ...prev, [sprintId]: [] }));
    }
  };

  const updateTask = async (taskId) => {
    setLoading(true);
    try {
      const res = await axios.put(`/issue/update/${taskId}`, editValues);
      const updatedTask = res.data.data;
      
      const updatedTasks = Object.keys(sprintTasks).reduce((acc, sprintId) => {
        acc[sprintId] = sprintTasks[sprintId].map((task) => 
          task._id === taskId ? updatedTask : task
        );
        return acc;
      }, {});
      
      setSprintTasks(updatedTasks);
      setEditingTask(null);
      setEditValues({});
      toast.success("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task. Please try again.");
    } finally { setLoading(false); }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditValues({
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      assigned: Array.isArray(task.assigned) 
        ? task.assigned.map(u => typeof u === 'object' ? u._id : u)
        : [],
    });
  };

  useEffect(() => { 
    getData(); 
    fetchUsers();
  }, [id]);

  const filteredSprints = sprints.filter((sprint) => sprint.name?.toLowerCase().includes(search.toLowerCase()));
  const toggleSprintExpanded = (sprintId) => { setExpandedSprints((prev) => ({ ...prev, [sprintId]: !prev[sprintId] })); };

  const getStatusColor = (status) => {
    const map = {
      "Open": "bg-amber-500/15 text-amber-400 border-amber-500/20",
      "In Progress": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
      "In Testing": "bg-violet-500/15 text-violet-400 border-violet-500/20",
      "Resolved": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      "Closed": "bg-white/[0.06] text-slate-400 border-white/[0.08]",
      "Re-Open": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    };
    return map[status] || "bg-white/[0.06] text-slate-400 border-white/[0.08]";
  };

  const STATUS_OPTIONS = ["Open", "In-Progress", "In-Testing", "Resolved", "Closed", "Re-Open"];

  const getStatusStats = (tasks) => ({
    "Open": tasks.filter((t) => t.status === "Open").length,
    "In-Progress": tasks.filter((t) => t.status === "In Progress").length,
    "In-Testing": tasks.filter((t) => t.status === "In Testing").length,
    "Resolved": tasks.filter((t) => t.status === "Resolved").length,
    "Closed": tasks.filter((t) => t.status === "Closed").length,
    "Re-Open": tasks.filter((t) => t.status === "Re-Open").length,
  });

  const getPriorityColor = (priority) => {
    const map = { Low: "bg-slate-500/15 text-slate-400", Medium: "bg-blue-500/15 text-blue-400", High: "bg-amber-500/15 text-amber-400", Critical: "bg-red-500/15 text-red-400" };
    return map[priority] || "bg-slate-500/15 text-slate-400";
  };

  const statusStatColors = {
    "Open": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "In-Progress": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    "In-Testing": "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "Resolved": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "Closed": "text-slate-400 bg-white/[0.04] border-white/[0.06]",
    "Re-Open": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-full mx-auto space-y-6 relative z-10 px-4 md:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-2">Sprint Management</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Sprint Board</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track sprint issues</p>
          </div>
          <Link to="addsprint" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 border-0 flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Add Sprint
          </Link>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input type="text" placeholder="Search sprints..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark w-full pl-11" />
        </div>

        {/* Sprints */}
        {filteredSprints.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl"><p className="text-slate-600">No sprints found</p></div>
        ) : (
          <div className="space-y-6">
            {filteredSprints.map((sprint) => {
              const tasks = sprintTasks[sprint._id] || [];
              const isExpanded = expandedSprints[sprint._id];
              return (
                <motion.div key={sprint._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl transition-all border border-white/[0.04] bg-[#0c1020]/40 hover:border-cyan-500/30">
                  {/* Sprint Header */}
                  <div onClick={() => toggleSprintExpanded(sprint._id)} className="p-6 cursor-pointer bg-gradient-to-r hover:from-cyan-500/5 hover:to-transparent transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 pr-4">
                        <div className={`p-2 shrink-0 rounded-xl transition-all ${isExpanded ? "bg-cyan-500/10 text-cyan-400" : "bg-white/[0.04] text-slate-500"}`}>
                          <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl font-extrabold text-white group-hover:text-cyan-400 truncate">{sprint.name}</h2>
                          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                            <span className="text-cyan-400 mr-2">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
                            {sprint.dueDate && (<>• DUE <span className="ml-1 text-white">{new Date(sprint.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></>)}
                          </p>
                        </div>
                      </div>
                      <Link to={`addtask/${sprint._id}`} onClick={(e) => e.stopPropagation()} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 border-0">+ Task</Link>
                    </div>

                    {tasks.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                                style={{ width: `${(tasks.filter((t) => t.status === "Resolved" || t.status === "Closed").length / tasks.length) * 100}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white whitespace-nowrap bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/[0.08]">
                            {tasks.filter((t) => t.status === "Resolved" || t.status === "Closed").length}/{tasks.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
                          {STATUS_OPTIONS.map((status) => {
                            const count = getStatusStats(tasks)[status];
                            return (
                              <div key={status} className={`flex flex-col items-center py-1.5 px-1 rounded-lg border text-xs ${statusStatColors[status]}`}>
                                <span className="font-medium opacity-80">{status.split("-")[0]}</span>
                                <span className="text-sm font-bold">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tasks Table */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="px-6 pb-6 overflow-hidden">
                        {tasks.length === 0 ? (
                          <div className="text-center py-10 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 mt-4"><p className="text-slate-600 font-bold tracking-widest uppercase text-[10px]">No issues logged in this sprint</p></div>
                        ) : (
                          <div className="w-full mt-4 flex flex-col gap-3">
                            {/* Desktop Header */}
                            <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr_0.5fr] gap-4 px-6 pb-2 border-b border-white/[0.04]">
                              {["Task", "Type", "Status", "Priority", "Assigned To", "Due Date", "Actions"].map((h) => (
                                <span key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</span>
                              ))}
                            </div>
                            
                            {/* Mobile/Desktop Cards */}
                            {tasks.map((task, index) => (
                                <div key={task._id} className="relative bg-white/[0.02] hover:bg-cyan-500/5 transition-colors group rounded-2xl border border-white/[0.04] hover:border-cyan-500/20 p-5 lg:p-4 lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr_0.5fr] lg:gap-4 lg:items-center flex flex-col gap-4">
                                  
                                  {/* Task Title */}
                                  <div className="flex items-start lg:items-center gap-3 min-w-0">
                                    <span className="inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-black shadow-inner mt-1 lg:mt-0">{index + 1}</span>
                                    <div className="min-w-0 flex-1">
                                      <span className="font-extrabold text-white text-[14px] tracking-wide block truncate">{task.title}</span>
                                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-wider">#{task._id?.substring(0, 8)}</p>
                                    </div>
                                  </div>

                                  {/* Rest of the data with mobile labels */}
                                  <div className="grid grid-cols-2 gap-4 lg:contents text-sm">
                                    <div className="flex flex-col lg:block gap-1 min-w-0">
                                      <span className="lg:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</span>
                                      <div><span className="badge bg-white/[0.04] border border-white/[0.08] text-slate-300 font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-md">{task.issueType || "—"}</span></div>
                                    </div>

                                    <div className="flex flex-col lg:block gap-1 min-w-0">
                                      <span className="lg:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                      {editingTask === task._id ? (
                                        <select value={editValues.status} onChange={(e) => setEditValues({ ...editValues, status: e.target.value })} className="input-dark text-[10px] py-1.5 px-2 rounded-xl w-full lg:w-32 border-cyan-500/30 ring-1 ring-cyan-500/20 font-bold">
                                          {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                                        </select>
                                      ) : (
                                        <div><span className={`badge border text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm ${getStatusColor(task.status)}`}>{task.status}</span></div>
                                      )}
                                    </div>

                                    <div className="flex flex-col lg:block gap-1 min-w-0">
                                      <span className="lg:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</span>
                                      {editingTask === task._id ? (
                                        <select value={editValues.priority} onChange={(e) => setEditValues({ ...editValues, priority: e.target.value })} className="input-dark text-[10px] py-1.5 px-2 rounded-xl w-full lg:w-28 border-cyan-500/30 ring-1 ring-cyan-500/20 font-bold">
                                          {["Low", "Medium", "High", "Critical"].map((p) => (<option key={p} value={p}>{p}</option>))}
                                        </select>
                                      ) : (
                                        <div><span className={`badge text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${getPriorityColor(task.priority)}`}>{task.priority}</span></div>
                                      )}
                                    </div>

                                    <div className="flex flex-col col-span-2 lg:col-span-1 lg:block gap-1 min-w-0">
                                      <span className="lg:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</span>
                                      {editingTask === task._id ? (
                                        <select value={editValues.assigned?.[0] || ""} onChange={(e) => setEditValues({ ...editValues, assigned: e.target.value ? [e.target.value] : [] })} className="input-dark text-[10px] py-1.5 px-2 rounded-xl w-full lg:w-32 border-cyan-500/30 ring-1 ring-cyan-500/20 font-bold">
                                          <option value="">Unassigned</option>
                                          {users.map(u => (<option key={u._id} value={u._id}>{u.name}</option>))}
                                        </select>
                                      ) : (
                                        <div className="min-w-0">
                                          <p className="font-bold text-white text-[12px] lg:text-[13px] truncate">
                                            {Array.isArray(task.assigned) && task.assigned.length > 0 ? task.assigned.map(u => u.name).join(", ") : "Unassigned"}
                                          </p>
                                          <p className="text-[10px] text-slate-500 font-medium tracking-wide truncate">
                                            {Array.isArray(task.assigned) && task.assigned.length > 0 ? task.assigned.map(u => u.email).join(", ") : "—"}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-col col-span-2 lg:col-span-1 lg:block gap-1 min-w-0">
                                      <span className="lg:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest">Due Date</span>
                                      {editingTask === task._id ? (
                                        <input type="date" value={editValues.dueDate} onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })} className="input-dark text-[10px] py-1.5 px-2 rounded-xl border-cyan-500/30 ring-1 ring-cyan-500/20 font-bold text-white w-full" />
                                      ) : (
                                        <span className="text-[12px] font-bold text-slate-300 tracking-wide block truncate">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Desktop/Mobile Right Actions */}
                                  <div className="mt-2 lg:mt-0 pt-4 border-t border-white/[0.04] lg:pt-0 lg:border-t-0 flex items-center justify-end lg:justify-start gap-2 min-w-0">
                                    {editingTask === task._id ? (
                                        <>
                                          <button onClick={() => updateTask(task._id)} disabled={loading} className="inline-flex hover:scale-105 shrink-0 items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/30 border-0"><Save size={12} /> Save</button>
                                          <button onClick={() => { setEditingTask(null); setEditValues({}); }} className="inline-flex hover:scale-110 shrink-0 items-center justify-center p-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all rounded-full border border-white/[0.06]"><X size={12} /></button>
                                        </>
                                      ) : (
                                        <button onClick={() => startEdit(task)} className="inline-flex hover:-translate-y-0.5 shrink-0 items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/30 opacity-100 lg:opacity-0 group-hover:opacity-100"><Edit2 size={12} /> Edit</button>
                                    )}
                                  </div>

                                </div>
                            ))}
                          </div>
                         )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};