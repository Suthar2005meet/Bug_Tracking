import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../AuthProvider';
import { getRoleLabel, hasRole, normalizeRole } from '../../../utils/roles';

export const ShowUser = () => {
  const { role, userId} = useContext(AuthContext)
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('All');

  const normalizedRole = normalizeRole(role);

const addUserPath =
  normalizedRole === "projectmanager"
    ? `/projectmanager/user/adduserpm/${userId}`
    : normalizedRole === "admin"
    ? `adduser`
    : null;

  const roles = [
    { label: 'All', value: 'All' },
    { label: 'Developer', value: 'Developer' },
    { label: 'Tester', value: 'Tester' },
    { label: 'Project Manager', value: 'ProjectManager' },
    { label: 'Admin', value: 'Admin' },
  ];

  const getData = async () => {
    try {
      const res = await axios.get('/user/all');
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      activeRole === 'All' ||
      hasRole(user.role, activeRole);

    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const roleAccents = {
    admin: { bg: 'bg-violet-500/12', text: 'text-violet-400', border: 'border-violet-500/20', dot: 'bg-violet-500' },
    developer: { bg: 'bg-blue-500/12', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
    tester: { bg: 'bg-amber-500/12', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
    projectmanager: { bg: 'bg-emerald-500/12', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  };

  const roleFilterStyles = {
    All: { active: 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20', inactive: 'bg-white/[0.04] text-slate-500 border border-white/[0.06]' },
    Developer: { active: 'bg-blue-500 text-white shadow-lg shadow-blue-500/20', inactive: 'bg-white/[0.04] text-blue-400 border border-blue-500/20' },
    Tester: { active: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20', inactive: 'bg-white/[0.04] text-amber-400 border border-amber-500/20' },
    ProjectManager: { active: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20', inactive: 'bg-white/[0.04] text-emerald-400 border border-emerald-500/20' },
    Admin: { active: 'bg-violet-500 text-white shadow-lg shadow-violet-500/20', inactive: 'bg-white/[0.04] text-violet-400 border border-violet-500/20' },
  };

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      {/* Header */}
      <div className="glass rounded-none md:rounded-2xl border-x-0 md:border-x mb-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                className="input-dark w-full pl-11 pr-4"
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {addUserPath && (
              <Link
                className="btn-primary text-sm flex items-center gap-2"
                to={addUserPath}
              >
                <span>+</span> Add User
              </Link>
            )}
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {roles.map((r) => {
              const style = roleFilterStyles[r.value];
              const isActive = activeRole === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setActiveRole(r.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive ? style.active : style.inactive + ' hover:bg-white/[0.06]'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 relative z-10">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-slate-600 mt-20 text-sm">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => {
              const roleLower = normalizeRole(user.role);
              const accent = roleAccents[roleLower] || { bg: 'bg-slate-500/12', text: 'text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-500' };

              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  className="glass glass-hover p-5 flex flex-col gap-3"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/[0.08] flex-shrink-0">
                      {user.image ? (
                        <img src={user.image} className="h-full w-full object-cover" alt={user.name} />
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center ${accent.bg} ${accent.text} font-bold text-sm`}>
                          {user.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-white text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className={`self-start text-[10px] font-bold px-3 py-1 rounded-full ${accent.bg} ${accent.text} border ${accent.border} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`}></span>
                    {getRoleLabel(user.role)}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-white/[0.04]">
                    <Link
                      to={`edituser/${user._id}`}
                      className="flex-1 text-center text-[10px] font-bold py-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/20 transition-all uppercase tracking-wider"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`userdetail/${user._id}`}
                      className="flex-1 text-center text-[10px] font-bold py-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all uppercase tracking-wider"
                    >
                      Details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
