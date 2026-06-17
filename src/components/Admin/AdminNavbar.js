import React, { useState } from "react";
import { FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { userLoggedOut } from "../../redux/features/auth/authslice";
import { useLazyLogOutQuery } from "../../redux/features/auth/authApi.js";

const AdminNavbar = ({ onToggleMobileMenu }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [triggerLogout] = useLazyLogOutQuery();

  // Create simple breadcrumb from pathname
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumb = pathnames.length > 1 
    ? pathnames[pathnames.length - 1].replace("-", " ") 
    : "Dashboard";

  const handleLogout = async () => {
    await triggerLogout().unwrap(); // Hits backend to clear HttpOnly cookies
    dispatch(userLoggedOut()); // Clears Redux & localStorage
    navigate("/"); 
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 shrink-0"
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Left side: Breadcrumb & Title */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-gray-400 capitalize hidden sm:inline">Admin</span>
          <span className="text-gray-300 hidden sm:inline">/</span>
          <span className="text-gray-800 capitalize truncate max-w-[150px] sm:max-w-none">{breadcrumb}</span>
        </div>
      </div>

      {/* Right side: Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 pl-6 border-l border-gray-200 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-none bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-gray-700 leading-none">
              {user?.name ? user.name.split(" ")[0] : "Admin"}
            </span>
            <span className="text-xs text-gray-500 mt-1 capitalize leading-none">
              {user?.role || "Administrator"}
            </span>
          </div>
          <FiChevronDown className={`text-gray-400 hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 origin-top-right"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FiLogOut size={16} />
                    Sign out
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default AdminNavbar;
