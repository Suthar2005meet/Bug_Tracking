import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiMail, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

// --- Sub-component: The Profile Card (Database Driven) ---
const UserCard = ({ user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1222] p-6 shadow-xl group transition-all hover:border-cyan-500/40"
    >
      <div className="flex items-center gap-6">
        
        {/* Left Side: Avatar */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-cyan-400 transition-colors duration-500 shadow-2xl">
            <img
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0c1222]"></div>
        </div>

        {/* Right Side: Identity & Details from DB */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white truncate tracking-tight">
              {user.name}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-[9px] font-black uppercase tracking-widest text-cyan-400 border border-cyan-500/20">
              {user.role}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FiMail className="text-cyan-500/60" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                UID: {user._id.slice(-6)}
             </p>
             <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AddUserPm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/usermanage/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users list");
    }
  };

  const fetchMyTeam = async () => {
    try {
      const res = await axios.get("/usermanage/my-team");
      if (res.data.team) {
        setSelectedUsers(res.data.team.users.map((u) => u._id));
        setTeamDetails(res.data.team.users);
      }
    } catch (err) {
      console.error("Team fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMyTeam();
  }, []);

  const handleCheckbox = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    try {
      await axios.post("/usermanage/save-team", { users: selectedUsers });
      const newTeam = users.filter((user) => selectedUsers.includes(user._id));
      setTeamDetails(newTeam);
      setShowModal(false);
      toast.success("Team updated successfully!");
    } catch (err) {
      toast.error("Could not save team changes.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060912] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Simplified Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/[0.05] pb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              Project <span className="text-cyan-400">Team</span>
            </h1>
            <p className="text-slate-600 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Internal Node Management</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#0c1222] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400" />
            </div>
            <button
              className="bg-cyan-500 hover:bg-cyan-400 text-[#060912] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-cyan-500/20"
              onClick={() => setShowModal(true)}
            >
              + Manage
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamDetails.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No personnel assigned.</p>
            </div>
          ) : (
            teamDetails.map((user) => (
              <UserCard key={user._id} user={user} />
            ))
          )}
        </div>
      </div>

      {/* Simplified Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-[#0c1222] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">Assign Members</h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-all text-lg">✕</button>
               </div>
               
               <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {filteredUsers.map((u) => (
                    <div 
                      key={u._id} 
                      onClick={() => handleCheckbox(u._id)} 
                      className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${selectedUsers.includes(u._id) ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                    >
                       <div className={`h-5 w-5 rounded border transition-all flex items-center justify-center ${selectedUsers.includes(u._id) ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/20'}`}>
                          {selectedUsers.includes(u._id) && <span className="text-[#060912] font-bold text-[10px]">✓</span>}
                       </div>
                       <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}`} className="h-10 w-10 rounded-lg object-cover" alt="" />
                       <div className="flex-1">
                          <p className="font-bold text-white text-sm leading-none mb-1">{u.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{u.role}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)} className="text-slate-500 font-bold uppercase text-[10px] px-4">Cancel</button>
                  <button onClick={handleUpdate} className="bg-cyan-500 text-[#060912] px-6 py-2.5 rounded-lg font-black uppercase text-[10px]">Deploy Team</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddUserPm;