import React, { useState } from "react";
import { FiBell, FiCheck, FiMessageSquare, FiFileText, FiVideo, FiInfo, FiFolder } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetNotificationsQuery, useUpdateNotificationStatusMutation } from "../redux/features/notifications/notificationApi";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data, isLoading } = useGetNotificationsQuery(undefined, { pollingInterval: 2000 });
  const [updateNotification] = useUpdateNotificationStatusMutation();
  const navigate = useNavigate();

  const notifications = data?.notifications || [];
  const unreadNotifications = notifications.filter(n => n.status === "unread");
  const unreadCount = unreadNotifications.length;

  const handleMarkAsRead = async (e, id) => {
    if (e) e.stopPropagation();
    try {
      await updateNotification(id).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (notif.status === "unread") {
      await handleMarkAsRead(null, notif._id);
    }
    if (notif.url) {
      setIsOpen(false);
      navigate(notif.url, { state: { timestamp: Date.now() } });
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case "doubt": return <FiMessageSquare className="text-blue-500" />;
      case "assignment": return <FiFileText className="text-purple-500" />;
      case "project": return <FiFolder className="text-orange-500" />;
      case "meeting": return <FiVideo className="text-green-500" />;
      default: return <FiInfo className="text-indigo-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-600 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] rounded-full focus:outline-none transition-all group"
      >
        <FiBell size={20} className="group-hover:animate-swing" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-slate-900 transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full shadow-[0_0_10px_rgba(0,242,254,0.8)] border-2 border-[#0B0F19]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-[120%] w-80 sm:w-96 bg-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-600 rounded-2xl overflow-hidden z-50 origin-top-right flex flex-col max-h-[500px]"
            >
              <div className="p-4 border-b border-white/5 bg-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white tracking-wide">Notifications</h3>
                <span className="text-[10px] font-extrabold tracking-wider bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(0,242,254,0.3)] text-primary px-3 py-1 rounded-full uppercase">{unreadCount} New</span>
              </div>
              
              <div className="overflow-y-auto flex-1 scrollbar-hide">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500 text-sm font-medium">Loading...</div>
                ) : unreadNotifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {unreadNotifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 flex gap-4 transition-all duration-300 hover:bg-white/5 cursor-pointer ${notif.status === "unread" ? "bg-white/5" : ""}`}
                      >
                        <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${notif.status === "unread" ? "bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]" : "bg-white/5 border border-slate-600"}`}>
                          {getIconForType(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm truncate pr-2 ${notif.status === "unread" ? "font-bold text-white drop-shadow-md" : "font-semibold text-slate-400"}`}>
                              {notif.title}
                            </p>
                            {notif.status === "unread" && (
                              <button 
                                onClick={(e) => handleMarkAsRead(e, notif._id)}
                                className="text-slate-500 hover:text-primary transition-colors flex-shrink-0 hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]"
                                title="Mark as read"
                              >
                                <FiCheck size={18} />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">
                            {timeAgo(notif.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center justify-center text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-slate-600 flex items-center justify-center mb-4">
                      <FiBell size={28} className="text-slate-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
