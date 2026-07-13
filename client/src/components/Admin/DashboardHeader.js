import React, { useState, useEffect } from "react";
import ThemeSwitcher from "../../utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiWifi } from "react-icons/fi";
import { useGetNotificationsQuery, useUpdateNotificationMutation } from "../../redux/features/admin/adminApi.js";
import { format } from "timeago.js";
import { io } from "socket.io-client";

const socket = io("https://back.kairaablockchainacademy.com", {
  transports: ["websocket"],
});

const DashboardHeader = () => {
  const [open, setOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  const { data, refetch } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateNotification] = useUpdateNotificationMutation();

  useEffect(() => {
    socket.on("updateOnlineUsers", (count) => {
      setOnlineUsers(count);
    });
    return () => {
      socket.off("updateOnlineUsers");
    };
  }, []);

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleMarkAsRead = async (id) => {
    try {
      await updateNotification(id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 gap-4">
      {/* Online Users Indicator */}
      <div className="flex items-center gap-2 bg-success/10 border border-success/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,230,118,0.2)]">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
        </div>
        <span className="text-xs font-bold text-success uppercase tracking-wider">
          {onlineUsers} Online
        </span>
      </div>

      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer  text-black" />
        <span className="absolute -top-2 -right-2 bg-[#0976DB] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {unreadCount}
        </span>
      </div>
      {open && (
        <div className="w-[350px] max-h-[50vh] overflow-y-auto bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[18px] font-bold text-gray-800 p-3 sticky top-0 bg-white border-b border-gray-100 z-20">
            Notifications
          </h5>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((item) => (
              <div key={item._id} className={`font-poppins border-b border-gray-100 ${item.status === "unread" ? "bg-blue-50/50" : "bg-white"}`}>
                <div className="w-full flex items-center justify-between p-3 pb-1">
                  <p className={`text-sm ${item.status === "unread" ? "font-bold text-gray-800" : "font-semibold text-gray-600"}`}>
                    {item.title}
                  </p>
                  {item.status === "unread" && (
                    <button onClick={() => handleMarkAsRead(item._id)} className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">
                      Mark as read
                    </button>
                  )}
                </div>
                <p className="px-3 text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.message}
                </p>
                <p className="px-3 pb-3 pt-2 text-[11px] text-gray-400">
                  {format(item.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
