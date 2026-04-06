import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const Task = () => {
  const { userId } = useContext(AuthContext);

  const [issues, setIssues] = useState([]);
  const [testers, setTesters] = useState([]);
  const [selectedTester, setSelectedTester] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= GET USER ISSUES =================
  const getIssues = async () => {
    try {
      const res = await axios.get(`/issue/user/${userId}`);
      setIssues(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= GET TESTERS =================
  const getTesters = async () => {
    try {
      const res = await axios.get("/user/tester");
      setTesters(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= START / RESTART PROGRESS =================
  const startProgress = async (issueId) => {
    try {
      setLoading(true);
      await axios.put(`/issue/update/${issueId}`, {
        status: "In Progress",
      });
      getIssues();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD TESTER + MOVE TO TESTING =================
  const addTester = async (issueId) => {
    try {
      if (!selectedTester[issueId]) {
        alert("Please select tester");
        return;
      }
      setLoading(true);
      await axios.put(`/issue/adduser/${issueId}`, {
        userId: selectedTester[issueId],
      });
      await axios.put(`/issue/update/${issueId}`, {
        status: "In Testing",
      });
      getIssues();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
    getTesters();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
          My Tasks
        </h2>

        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h4 className="text-xl font-bold text-slate-700">
                    {issue.title}
                  </h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-white uppercase tracking-wider">
                    {issue.issueType}
                  </span>
                </div>

                <hr className="border-slate-100 mb-6" />

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Status:</strong>{" "}
                      <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                        {issue.status}
                      </span>
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Priority:</strong>{" "}
                      <span className={`ml-2 ${issue.priority === 'High' ? 'text-rose-500' : 'text-amber-500'} font-medium`}>
                        {issue.priority}
                      </span>
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Due Date:</strong>{" "}
                      <span className="ml-2">{issue.dueDate}</span>
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Sprint:</strong>{" "}
                      <span className="ml-2">{issue.sprintId?.name || "N/A"}</span>
                    </p>
                  </div>

                  <div className="space-y-2 text-sm border-l border-slate-100 md:pl-8">
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Project:</strong>{" "}
                      <span className="ml-2">{issue.projectId?.title}</span>
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Reporter:</strong>{" "}
                      <span className="ml-2 text-indigo-600 italic">
                        {issue.reporterId?.name}
                      </span>
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-700">Project Status:</strong>{" "}
                      <span className="ml-2">{issue.projectId?.status}</span>
                    </p>
                  </div>
                </div>

                {/* ASSIGNED USERS & ATTACHMENT */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <strong className="text-xs uppercase text-slate-400 block mb-2 tracking-widest">
                      Assigned Team
                    </strong>
                    <ul className="flex flex-wrap gap-2">
                      {issue.assigend?.map((user) => (
                        <li
                          key={user._id}
                          className="text-xs bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-slate-600"
                        >
                          {user.name} <span className="text-slate-400">({user.role})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {issue.document && (
                    <div className="md:border-l md:pl-6 border-slate-200">
                      <strong className="text-xs uppercase text-slate-400 block mb-2 tracking-widest">
                        Documentation
                      </strong>
                      <a
                        href={issue.document}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-4"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100 mb-6" />

                {/* ================= ACTION SECTION ================= */}
                <div className="flex items-center gap-3">
                  {/* OPEN / RE-OPEN → IN PROGRESS */}
                  {(issue.status === "Open" || issue.status === "Re-Open") && (
                    <button
                      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
                      onClick={() => startProgress(issue._id)}
                      disabled={loading}
                    >
                      {issue.status === "Open" ? "Start Progress" : "Start Progress Again"}
                    </button>
                  )}

                  {/* IN PROGRESS → SELECT TESTER */}
                  {issue.status === "In Progress" && (
                    <div className="flex flex-col md:flex-row items-end gap-3 w-full">
                      <div className="w-full md:w-64">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Select Tester</label>
                        <select
                          className="w-full rounded-lg border-slate-200 text-sm focus:ring-amber-500 focus:border-amber-500"
                          value={selectedTester[issue._id] || ""}
                          onChange={(e) =>
                            setSelectedTester({
                              ...selectedTester,
                              [issue._id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose a member...</option>
                          {testers.map((tester) => (
                            <option key={tester._id} value={tester._id}>
                              {tester.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-all disabled:opacity-50"
                        onClick={() => addTester(issue._id)}
                        disabled={!selectedTester[issue._id] || loading}
                      >
                        Move To Testing
                      </button>
                    </div>
                  )}

                  {/* STATUS ALERTS */}
                  {issue.status === "In Testing" && (
                    <div className="w-full p-3 bg-sky-50 border border-sky-100 text-sky-700 rounded-lg text-sm flex items-center">
                      <span className="mr-2">🔒</span> In Testing - Waiting for Tester Feedback
                    </div>
                  )}

                  {issue.status === "Resolved" && (
                    <div className="w-full p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm flex items-center">
                      <span className="mr-2">✅</span> This issue has been successfully resolved
                    </div>
                  )}

                  {issue.status === "Closed" && (
                    <div className="w-full p-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg text-sm flex items-center">
                      <span className="mr-2">🔒</span> This task is closed and archived
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};