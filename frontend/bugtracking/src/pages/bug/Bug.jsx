    import axios from "axios";
    import { useContext, useEffect, useState } from "react";
    import { Link } from "react-router-dom";
    import { AuthContext } from "../../AuthProvider";

    export const Bug = () => {
    // 1. Get the user role from AuthContext
    const { userId, role } = useContext(AuthContext); 
    const [loading, setloading] = useState(true);
    const [bugs, setbugs] = useState([]);

    const getUserByBug = async () => {
        try {
        const res = await axios.get(`/bug/user/${userId}`);
        setbugs(res.data.data || []);
        } catch (err) {
        console.log(err);
        setbugs([]);
        } finally {
        setloading(false);
        }
    };

    const changeStatus = async (bugId, newStatus) => {
        try {
        await axios.put(`/bug/status/${bugId}`, { status: newStatus });
        getUserByBug(); // Refresh the list
        } catch (error) {
        console.log("Status update failed", error);
        }
    };

    useEffect(() => {
        if (userId) getUserByBug();
    }, [userId]);

    if (loading) return <div className="p-10 text-center font-mono animate-pulse">Synchronizing...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
            {bugs.map((bug) => (
            <div key={bug._id} className="flex flex-col md:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group">
                
                {/* LEFT SIDE: BUG INFO */}
                <div className="flex-1 p-6 border-l-4 border-indigo-500">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{bug.status}</span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{bug.title}</h2>
                <p className="text-slate-500 text-sm mt-2 line-clamp-1">{bug.description}</p>
                </div>

                {/* RIGHT SIDE: ACTIONS */}
                <div className="w-full md:w-64 bg-slate-900 p-4 flex flex-col gap-2">
                <Link to={`details/${bug._id}`} className="py-2 text-center text-[10px] font-bold text-white uppercase bg-slate-800 hover:bg-slate-700 rounded-md">
                    View Details
                </Link>

                {/* ROLE BASED BUTTONS */}
                
                {/* --- DEVELOPER ACTIONS --- */}
                {role === "Developer" && bug.status === "Open" && (
                    <button
                    onClick={() => changeStatus(bug._id, "In Progress")}
                    className="w-full py-2.5 text-[10px] font-bold text-white uppercase bg-blue-600 hover:bg-blue-500 rounded-md transition-all"
                    >
                    Start Working
                    </button>
                )}

                {role === "Developer" && bug.status === "In Progress" && (
                    <button
                    onClick={() => changeStatus(bug._id, "Resolved")}
                    className="w-full py-2.5 text-[10px] font-bold text-white uppercase bg-emerald-600 hover:bg-emerald-500 rounded-md transition-all shadow-lg shadow-emerald-900/20"
                    >
                    Mark Resolved
                    </button>
                )}

                {/* --- TESTER ACTIONS --- */}
                {role === "Tester" && bug.status === "In Progress" && (
                    <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => changeStatus(bug._id, "Closed")}
                        className="w-full py-2.5 text-[10px] font-bold text-white uppercase bg-rose-600 hover:bg-rose-500 rounded-md transition-all shadow-lg shadow-rose-900/20"
                    >
                        Verify & Close
                    </button>
                    <button
                        onClick={() => changeStatus(bug._id, "Open")}
                        className="w-full py-2 text-[10px] font-bold text-slate-300 uppercase bg-slate-800 hover:bg-slate-700 rounded-md"
                    >
                        Re-Open Bug
                    </button>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link to={`addcomment/${bug._id}`} className="py-2 text-center text-[9px] font-bold text-slate-400 uppercase bg-slate-800/50 hover:text-white rounded-md">
                    + Comment
                    </Link>
                    <Link to={`allcomment/${bug._id}`} className="py-2 text-center text-[9px] font-bold text-slate-400 uppercase bg-slate-800/50 hover:text-white rounded-md">
                    History
                    </Link>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    };