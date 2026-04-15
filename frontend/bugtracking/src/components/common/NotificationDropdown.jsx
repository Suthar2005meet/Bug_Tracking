import React, { useRef, useState, useEffect, useContext } from 'react';
import { FiBell, FiInbox } from 'react-icons/fi';
import { FaCheckDouble } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { useToast } from '../../hooks/useToast';
import { AuthContext } from '../../AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationDropdown = ({ role = 'developer' }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotification();
  const toast = useToast();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open) {
      fetchNotifications();
    }
    setOpen(!open);
  };

  const handleNotificationClick = async (n) => {
    if (!n) return;
    
    if (!n.isRead) {
      await markAsRead(n._id);
    }
    setOpen(false);

    const type = n.type || "";
    const title = (n.title || "").toLowerCase();
    const isBug = type.includes("BUG") || title.includes("bug");
    const isTask = type.includes("TASK") || title.includes("task");
    const isProject = type.includes("PROJECT") || title.includes("project") || type.includes("SPRINT");
    const isUser = type.includes("USER");

    // Dynamic routing fallback mapping 
    if (role === 'tester') {
       if (isBug || n.bug) navigate(`bug/${userId}`);
       else if (isTask || n.task) navigate(`task/${userId}`);
       else navigate(`dashboard/${userId}`);
    } else if (role === 'developer') {
       if (isBug || n.bug) navigate(`bugs/${userId}`);
       else if (isTask || n.task) navigate(`task/${userId}`);
       else navigate(`dashboard/${userId}`);
    } else if (role === 'projectmanager') {
       if (isBug || title.includes('bug')) navigate(`bugs`);
       else if (isProject) navigate(`projects`);
       else if (isUser) navigate(`user/${userId}`);
       else navigate(`dashboard/${userId}`);
    } else if (role === 'admin') {
       navigate(`/admin/dashboard/${userId}`);
    } else {
       navigate(`/`); 
    }
  };

  const handleMarkAllRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast.success("All notifications marked as read");
    } else {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <div className="relative z-[90]" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className={`relative p-2.5 rounded-xl transition-all ${open ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-bold rounded-full border-2 border-[#0c1020] flex items-center justify-center shadow-lg shadow-red-500/30">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95  }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-3 w-auto sm:w-[350px] md:w-[400px] bg-[#141a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[150] overflow-hidden"
          >
            <div className="p-4 border-b border-white/[0.06] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                {unreadCount > 0 && <p className="text-[10px] text-slate-500 mt-0.5">{unreadCount} unread</p>}
              </div>
              {notifications.length > 0 && (
                <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/10 px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 transition-colors">
                  <FaCheckDouble size={10} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <FiInbox className="mx-auto mb-3 text-slate-700" size={40} />
                  <p className="text-sm font-medium text-slate-600">Your inbox is empty</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.03] flex gap-3 relative transition-colors
                      ${!n.isRead ? 'bg-cyan-500/[0.04] border-l-2 border-l-cyan-500' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs
                        ${n.type?.includes('BUG') ? 'bg-red-500/15 text-red-400' : 'bg-cyan-500/15 text-cyan-400'}`}>
                        {n.sender?.name?.charAt(0) || "U"}
                      </div>
                    </div>

                    <div className="flex-grow pr-2 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${n.type?.includes('BUG') ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {n.type?.replace('_', ' ') || 'SYSTEM'}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm leading-snug ${!n.isRead ? 'font-bold text-white' : 'font-normal text-slate-400'}`}>
                        {n.sender?.name} <span className="font-normal text-slate-500">{n.message}</span>
                      </p>
                      {n.bug && (
                        <div className="mt-2 text-[10px] bg-white/[0.03] p-2 rounded-lg border border-white/[0.04] text-slate-500 font-medium">
                          Ticket: {n.bug.title}
                        </div>
                      )}
                    </div>
                    {!n.isRead && <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/40"></div>}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
