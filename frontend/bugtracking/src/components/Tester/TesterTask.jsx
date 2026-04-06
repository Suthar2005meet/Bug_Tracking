import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const TesterTask = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(`/issue/tester/${userId}`);
      setIssues(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`/issue/update/${issueId}`, {
        status: newStatus,
      });
      getData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Tester Tasks
        </h2>

        <div className="grid gap-6">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-slate-700">
                  {issue.title}
                </h4>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {issue.issueType}
                </span>
              </div>

              <hr className="border-slate-100 mb-4" />

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="text-blue-600">{issue.status}</span>
                </p>
                <p>
                  <span className="font-semibold">Priority:</span>{" "}
                  <span className={issue.priority === 'High' ? 'text-red-500' : 'text-orange-500'}>
                    {issue.priority}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {issue.dueDate}
                </p>
                {issue.document && (
                  <p>
                    <span className="font-semibold">Attachment:</span>{" "}
                    <a
                      href={issue.document}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-500 hover:underline inline-flex items-center"
                    >
                      View File
                    </a>
                  </p>
                )}
              </div>

              <hr className="border-slate-100 mb-6" />

              {/* ACTION DIV */}
              <div className="flex flex-wrap gap-3">
                {/* WHEN IN TESTING */}
                {issue.status === "In Testing" && (
                  <>
                    <button
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      onClick={() => updateStatus(issue._id, "Resolved")}
                      disabled={loading}
                    >
                      Mark Resolved
                    </button>

                    <button
                      className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                      onClick={() => updateStatus(issue._id, "Closed")}
                      disabled={loading}
                    >
                      Close Issue
                    </button>

                    <button
                      className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                      onClick={() => navigate(`createbug/${issue._id}`)}
                    >
                      Report Bug
                    </button>
                  </>
                )}

                {/* WHEN RESOLVED */}
                {issue.status === "Resolved" && (
                  <button
                    className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                    onClick={() => updateStatus(issue._id, "Re-Open")}
                    disabled={loading}
                  >
                    Re-Open
                  </button>
                )}

                {/* WHEN CLOSED */}
                {issue.status === "Closed" && (
                  <div className="flex items-center px-4 py-2 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-sm italic">
                    <span className="mr-2">🔒</span> Issue Closed
                  </div>
                )}

                {/* WHEN RE-OPEN */}
                {issue.status === "Re-Open" && (
                  <div className="flex items-center px-4 py-2 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg text-sm italic">
                    <span className="mr-2">🔄</span> Re-Opened (Waiting for Developer)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};