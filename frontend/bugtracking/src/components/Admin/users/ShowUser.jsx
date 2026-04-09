import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { getRoleLabel, hasRole, normalizeRole } from '../../../utils/roles';

export const ShowUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('All');

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

  const roleStyles = {
    All: {
      active: 'bg-slate-800 text-white border-slate-800',
      inactive: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100',
    },
    Developer: {
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-white text-blue-600 border-blue-400 hover:bg-blue-50',
    },
    Tester: {
      active: 'bg-amber-500 text-white border-amber-500',
      inactive: 'bg-white text-amber-600 border-amber-400 hover:bg-amber-50',
    },
    ProjectManager: {
      active: 'bg-purple-600 text-white border-purple-600',
      inactive: 'bg-white text-purple-600 border-purple-400 hover:bg-purple-50',
    },
    Admin: {
      active: 'bg-violet-600 text-white border-violet-600',
      inactive: 'bg-white text-violet-600 border-violet-400 hover:bg-violet-50',
    },
  };

  const roleBadgeStyles = {
    admin: 'bg-violet-100 text-violet-700',
    developer: 'bg-blue-100 text-blue-700',
    tester: 'bg-amber-100 text-amber-700',
    projectmanager: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-gray-50"
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Add Button */}
            <Link
              className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors duration-200 shadow-sm"
              to="adduser"
            >
              + Add User
            </Link>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {roles.map((role) => {
              const style = roleStyles[role.value];
              const isActive = activeRole === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => setActiveRole(role.value)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                    isActive ? style.active : style.inactive
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((user) => {
              const roleLower = normalizeRole(user.role);
              const badgeClass =
                roleBadgeStyles[roleLower] || 'bg-gray-100 text-gray-600';

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-3"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div >
                      <img src={user.image} className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span
                    className={`self-start text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <Link
                      to={`edituser/${user._id}`}
                      className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`userdetail/${user._id}`}
                      className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
