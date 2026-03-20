import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [developer , setdeveloper] = useState(null);
  const { id } = useParams();

  const getDeveloper = async() => {
    try{
      const res = await axios.get('/user/developer')
      console.log(res.data.data);
      setdeveloper(res.data.data)
    }catch(err){
      console.log(err);
      
    }
  }

  useEffect(()=>{
    getDeveloper();
  },[])

  useEffect(() => {
    const Details = async () => {
      try {
        const res = await axios.get(`/project/details/${id}`);
        setProject(res.data.data);
      } catch (err) {
        setError("Failed to load project.");
      }
    };
    if (id) Details();
  }, [id]);

  const priorityConfig = (priority) => {
    if (!priority)
      return {
        bg: "bg-slate-100",
        text: "text-slate-500",
        dot: "bg-slate-400",
        label: "—",
      };
    const p = priority.toLowerCase();
    if (p === "high")
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        label: priority,
      };
    if (p === "medium")
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: priority,
      };
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: priority,
    };
  };

  const statusConfig = (status) => {
    if (!status)
      return {
        bg: "bg-slate-100",
        text: "text-slate-500",
        bar: "bg-slate-300",
      };
    const s = status.toLowerCase();
    if (s === "completed")
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        bar: "bg-emerald-500",
      };
    if (s === "in progress")
      return { bg: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-500" };
    if (s === "on hold")
      return { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" };
    return { bg: "bg-slate-100", text: "text-slate-600", bar: "bg-slate-400" };
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono">
        <div className="border-l-4 border-red-500 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-red-600 uppercase tracking-widest">
            {error}
          </p>
        </div>
      </div>
    );

  if (!project)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Fetching record...
          </p>
        </div>
      </div>
    );

  const priority = priorityConfig(project.priority);
  const status = statusConfig(project.status);

  return (
    <div className="min-h-screen bg-slate-50 font-mono py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header block */}
        <div className="bg-white border border-slate-200 shadow-sm mb-1">
          <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-slate-300">
              Project Record
            </span>
            <span className="text-xs text-slate-500 tracking-widest">
              #{id}
            </span>
          </div>
          <div className="px-6 py-5 border-t-4 border-amber-400">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
              Project Name
            </p>
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
              {project.projectName}
            </h1>
          </div>
        </div>

        {/* Description block */}
        <div className="bg-white border border-slate-200 border-t-0 shadow-sm mb-1 px-6 py-5 border-l-4 border-l-sky-400">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
            Description
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {project.description || "—"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm px-6 py-5 border-l-4 border-l-indigo-400">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
            Assigned Members
          </p>
          {project.assignedMembers && project.assignedMembers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {developer.map((member) => (
                <span
                  key={member._id}
                  className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200"
                >
                  {member.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-slate-400">No members assigned</span>
          )}
        </div>

        {/* Priority + Status row */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div
            className={`${priority.bg} border border-slate-200 shadow-sm px-5 py-5 border-l-4 border-l-slate-300`}
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              Priority
            </p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
              <span
                className={`text-sm font-bold uppercase tracking-wider ${priority.text}`}
              >
                {priority.label}
              </span>
            </div>
          </div>

          <div
            className={`${status.bg} border border-slate-200 shadow-sm px-5 py-5`}
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              Status
            </p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-5 rounded-sm ${status.bar}`} />
              <span
                className={`text-sm font-bold uppercase tracking-wider ${status.text}`}
              >
                {project.status || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div className="bg-white border border-slate-200 shadow-sm px-5 py-5 border-t-4 border-t-slate-200">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Start Date
            </p>
            <p className="text-base font-semibold text-slate-700 tracking-wide">
              {formatDate(project.startDate)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm px-5 py-5 border-t-4 border-t-red-300">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Due Date
            </p>
            <p className="text-base font-semibold text-slate-700 tracking-wide">
              {formatDate(project.dueDate)}
            </p>
          </div>
        </div>

        {/* Document block */}
        <div className="bg-white border border-slate-200 shadow-sm px-6 py-5 border-l-4 border-l-amber-400">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
            Document
          </p>
          {project.document ? (
            <a
              href={project.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 underline underline-offset-4 decoration-amber-400 transition-colors"
            >
              <span className="text-base leading-none">↗</span>
              Open Document
            </a>
          ) : (
            <span className="text-sm text-slate-400">No document attached</span>
          )}
        </div>

        {/* Footer rule */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-300 uppercase tracking-widest">
            End of Record
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
