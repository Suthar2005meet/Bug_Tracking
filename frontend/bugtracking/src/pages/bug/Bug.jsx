    import axios from 'axios';
    import { useContext, useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { AuthContext } from '../../AuthProvider';

    export const Bug = () => {
    const { userId } = useContext(AuthContext);
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

    useEffect(() => {
        if (userId) getUserByBug();
    }, [userId]);

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 font-mono text-slate-400 animate-pulse">
            Initializing Bug Tracker...
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
        <div className="max-w-5xl mx-auto">
            
            {/* Header Section */}
            <div className="flex justify-between items-end mb-12 border-b-2 border-slate-200 pb-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Bug <span className="text-indigo-600">Console</span>
                </h1>
                <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">
                Security & QA Oversight / {bugs.length} Active Tickets
                </p>
            </div>
            <div className="hidden md:block text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-sm">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Operational
                </div>
            </div>
            </div>

            {/* Bug List */}
            <div className="space-y-6">
            {bugs.map((bug) => (
                <div 
                key={bug._id} 
                className="flex flex-col md:flex-row bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                {/* LEFT SIDE: ALL DETAILS */}
                <div className="flex-1 p-6 relative">
                    {/* Priority Stripe */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bug.priority === 'High' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                    
                    <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                        #{bug._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                        {bug.type || "General"}
                    </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {bug.title}
                    </h2>
                    
                    <p className="text-slate-600 text-sm font-light leading-relaxed mb-4 line-clamp-1">
                    {bug.description}
                    </p>

                    <div className="flex flex-wrap gap-6 mt-auto border-t border-slate-50 pt-4">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Deadline</p>
                        <p className="text-xs font-mono text-slate-700">{bug.dueDate || 'No Date'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Priority</p>
                        <p className={`text-xs font-mono font-bold ${bug.priority === 'High' ? 'text-rose-600' : 'text-indigo-600'}`}>
                        {bug.priority || 'Normal'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Status</p>
                        <p className="text-xs font-mono text-emerald-600 font-bold uppercase">{bug.status || 'Open'}</p>
                    </div>
                    </div>
                </div>

                {/* RIGHT SIDE: LINKS/ACTIONS */}
                <div className="w-full md:w-56 bg-slate-900 p-4 flex flex-col justify-center gap-2 border-l border-slate-800">
                    <Link 
                    to={`details/${bug._id}`}
                    className="w-full py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-500 transition-all rounded-md"
                    >
                    View Details
                    </Link>
                    
                    <div className="grid grid-cols-2 gap-2">
                    <Link 
                        to={`addcomment/${bug._id}`}
                        className="py-2 text-center text-[9px] font-bold text-slate-300 uppercase bg-slate-800 hover:bg-slate-700 hover:text-white transition-all rounded-md"
                    >
                        + Comment
                    </Link>
                    <Link 
                        to={`allcomment/${bug._id}`}
                        className="py-2 text-center text-[9px] font-bold text-slate-300 uppercase bg-slate-800 hover:bg-slate-700 hover:text-white transition-all rounded-md"
                    >
                        History
                    </Link>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {bugs.length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-mono text-sm">ZERO DISCREPANCIES FOUND IN SYSTEM.</p>
            </div>
            )}
        </div>
        </div>
    );
    };