import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, Edit2, Save, X } from "lucide-react";

export const SprintProject = () => {
  const { id } = useParams();
  const [sprints, setSprints] = useState([]);
  const [sprintTasks, setSprintTasks] = useState({});
  const [search, setSearch] = useState("");
  const [expandedSprints, setExpandedSprints] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch all sprints of project
  const getData = async () => {
    try {
      const res = await axios.get(`/sprint/project/${id}`);
      const sprintData = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data
        ? [res.data.data]
        : [];

      setSprints(sprintData);

      // Fetch tasks for each sprint and expand first sprint by default
      sprintData.forEach((sprint, index) => {
        fetchTasks(sprint._id);
        if (index === 0) {
          setExpandedSprints((prev) => ({ ...prev, [sprint._id]: true }));
        }
      });
    } catch (err) {
      console.error("Error fetching sprints:", err);
    }
  };

  // Fetch issue IDs → then fetch full details
  const fetchTasks = async (sprintId) => {
    try {
      const res = await axios.get(`/issue/sprint/${sprintId}`);
      const issueList = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data
        ? [res.data.data]
        : [];

      const populatedTasks = await Promise.all(
        issueList.map(async (issue) => {
          const detailsRes = await axios.get(`/issue/details/${issue._id}`);
          return detailsRes.data.data;
        })
      );

      setSprintTasks((prev) => ({
        ...prev,
        [sprintId]: populatedTasks,
      }));
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setSprintTasks((prev) => ({
        ...prev,
        [sprintId]: [],
      }));
    }
  };

  // Update task inline
  const updateTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.put(`/issue/update/${taskId}`, editValues);
      
      // Update local state
      const updatedTasks = Object.keys(sprintTasks).reduce((acc, sprintId) => {
        acc[sprintId] = sprintTasks[sprintId].map((task) =>
          task._id === taskId ? { ...task, ...editValues } : task
        );
        return acc;
      }, {});
      
      setSprintTasks(updatedTasks);
      setEditingTask(null);
      setEditValues({});
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditValues({
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      assigend: task.assigend?._id || "",
    });
  };

  useEffect(() => {
    getData();
  }, [id]);

  const filteredSprints = sprints.filter((sprint) =>
    sprint.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSprintExpanded = (sprintId) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  const getStatusColor = (status) => {
    const statusMap = {
      "Open": "bg-red-50 text-red-700 border-red-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      "In Testing": "bg-amber-50 text-amber-700 border-amber-200",
      "Resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Closed": "bg-slate-50 text-slate-700 border-slate-200",
      "Re-Open": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return statusMap[status] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const STATUS_OPTIONS = ["Open", "In-Progress", "In-Testing", "Resolved", "Closed", "Re-Open"];
  
  const getStatusStats = (tasks) => {
    return {
      "Open": tasks.filter((t) => t.status === "Open").length,
      "In-Progress": tasks.filter((t) => t.status === "In-Progress").length,
      "In-Testing": tasks.filter((t) => t.status === "In-Testing").length,
      "Resolved": tasks.filter((t) => t.status === "Resolved").length,
      "Closed": tasks.filter((t) => t.status === "Closed").length,
      "Re-Open": tasks.filter((t) => t.status === "Re-Open").length,
    };
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      Low: "bg-slate-100 text-slate-700",
      Medium: "bg-blue-100 text-blue-700",
      High: "bg-orange-100 text-orange-700",
      Critical: "bg-red-100 text-red-700",
    };
    return priorityMap[priority] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Sprint Board
            </h1>
            <p className="text-slate-500 text-lg">
              Manage and track sprint issues with inline editing
            </p>
          </div>

          <Link
            to="addsprint"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>+ Add Sprint</span>
          </Link>
        </div>

        {/* Search Section */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search sprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Sprints Container */}
        {filteredSprints.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg font-medium">
              No sprints found
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSprints.map((sprint) => {
              const tasks = sprintTasks[sprint._id] || [];
              const isExpanded = expandedSprints[sprint._id];

              return (
                <div
                  key={sprint._id}
                  className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Sprint Header */}
                  <div
                    onClick={() => toggleSprintExpanded(sprint._id)}
                    className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 cursor-pointer hover:from-slate-100 hover:to-blue-100 transition-colors duration-300 border-b border-slate-100"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <ChevronDown
                          size={20}
                          className={`text-slate-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            {sprint.name}
                          </h2>
                          <p className="text-sm text-slate-500 mt-1">
                            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                            {sprint.dueDate && (
                              <>
                                {" "}
                                • Due{" "}
                                {new Date(sprint.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`addtask/${sprint._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        + Task
                      </Link>
                    </div>

                    {/* Progress Section */}
                    {tasks.length > 0 && (
                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-sm">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full"
                                style={{
                                  width: `${
                                    (tasks.filter(
                                      (t) => t.status === "Resolved" || t.status === "Closed"
                                    ).length /
                                      tasks.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            {tasks.filter((t) => t.status === "Resolved" || t.status === "Closed").length}/
                            {tasks.length}
                          </span>
                        </div>

                        {/* Status Breakdown - Compressed */}
                        <div className="grid grid-cols-6 gap-1.5">
                          {STATUS_OPTIONS.map((status) => {
                            const count = getStatusStats(tasks)[status];
                            const colors = {
                              "Open": "text-red-600 bg-red-50",
                              "In-Progress": "text-blue-600 bg-blue-50",
                              "In-Testing": "text-amber-600 bg-amber-50",
                              "Resolved": "text-emerald-600 bg-emerald-50",
                              "Closed": "text-slate-600 bg-slate-50",
                              "Re-Open": "text-orange-600 bg-orange-50",
                            };
                            return (
                              <div
                                key={status}
                                className={`flex flex-col items-center py-1.5 px-1 rounded-md border border-slate-200 ${colors[status]}`}
                              >
                                <span className="text-xs font-medium">{status.split(" ")[0]}</span>
                                <span className="text-sm font-bold">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tasks Table */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      {tasks.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                          No tasks in this sprint
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Task
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Priority
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Assigned To
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Due Date
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks.map((task, index) => (
                              <tr
                                key={task._id}
                                className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200 group"
                              >
                                {/* Task Title */}
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold group-hover:bg-blue-200 transition-colors duration-200">
                                        {index + 1}
                                      </span>
                                      <span className="font-semibold text-slate-900">
                                        {task.title}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                      ID: {task._id?.substring(0, 8)}...
                                    </p>
                                  </div>
                                </td>

                                {/* Issue Type */}
                                <td className="px-6 py-4">
                                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                                    {task.issueType || "—"}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                  {editingTask === task._id ? (
                                    <select
                                      value={editValues.status}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          status: e.target.value,
                                        })
                                      }
                                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                          {status}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span
                                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                                        task.status
                                      )}`}
                                    >
                                      {task.status}
                                    </span>
                                  )}
                                </td>

                                {/* Priority */}
                                <td className="px-6 py-4">
                                  {editingTask === task._id ? (
                                    <select
                                      value={editValues.priority}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          priority: e.target.value,
                                        })
                                      }
                                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="Low">Low</option>
                                      <option value="Medium">Medium</option>
                                      <option value="High">High</option>
                                      <option value="Critical">Critical</option>
                                    </select>
                                  ) : (
                                    <span
                                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${getPriorityColor(
                                        task.priority
                                      )}`}
                                    >
                                      {task.priority}
                                    </span>
                                  )}
                                </td>

                                {/* Assigned To */}
                                <td className="px-6 py-4">
                                  <div className="text-sm">
                                    <p className="font-medium text-slate-900">
                                      {task.assigend?.name || "Unassigned"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {task.assigend?.email}
                                    </p>
                                  </div>
                                </td>

                                {/* Due Date */}
                                <td className="px-6 py-4">
                                  {editingTask === task._id ? (
                                    <input
                                      type="date"
                                      value={editValues.dueDate}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          dueDate: e.target.value,
                                        })
                                      }
                                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-700">
                                      {task.dueDate
                                        ? new Date(
                                            task.dueDate
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                          })
                                        : "—"}
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {editingTask === task._id ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            updateTask(task._id)
                                          }
                                          disabled={loading}
                                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                                        >
                                          <Save size={14} />
                                          Save
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingTask(null);
                                            setEditValues({});
                                          }}
                                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-semibold rounded-lg transition-colors duration-200"
                                        >
                                          <X size={14} />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => startEdit(task)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                      >
                                        <Edit2 size={14} />
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};