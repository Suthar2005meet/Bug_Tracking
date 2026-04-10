import React, { useRef, useState, useEffect, useContext } from 'react';
import { FiBell, FiInbox } from 'react-icons/fi';
import { FaCheckDouble } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { useToast } from '../../hooks/useToast';
import { AuthContext } from '../../AuthProvider';

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
        className={`relative p-2.5 rounded-full ${open ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-80 md:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[90] overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Notifications</h3>
            </div>
            {notifications.length > 0 && (
              <button onClick={handleMarkAllRead} className="text-[10px] font-extrabold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <FiInbox className="mx-auto mb-3 text-slate-200 opacity-60" size={48} />
                <p className="text-sm font-medium text-slate-400">Your inbox is empty</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 flex gap-3 relative
                    ${!n.isRead ? 'bg-indigo-50/20 border-l-4 border-l-indigo-500' : 'bg-white'}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-sm
                      ${n.type?.includes('BUG') ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {n.sender?.name?.charAt(0) || "U"}
                    </div>
                  </div>

                  <div className="flex-grow pr-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${n.type?.includes('BUG') ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {n.type?.replace('_', ' ') || 'SYSTEM'}
                      </span>
                      <span className="text-[10px] text-slate-400 italic font-medium whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm leading-snug ${!n.isRead ? 'font-bold text-slate-800' : 'font-normal text-slate-600'}`}>
                      {n.sender?.name} <span className="font-normal text-slate-500">{n.message}</span>
                    </p>
                    {n.bug && (
                      <div className="mt-2 text-[10px] bg-slate-100/50 p-2 rounded border border-slate-100 text-slate-500 font-medium">
                        Ticket: {n.bug.title}
                      </div>
                    )}
                  </div>
                  {!n.isRead && <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 bg-indigo-500 rounded-full shadow-sm"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
