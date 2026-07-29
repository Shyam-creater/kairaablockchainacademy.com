import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiGrid, 
  FiUsers, 
  FiShoppingCart, 
  FiFileText, 
  FiImage, 
  FiShield, 
  FiSettings, 
  FiLogOut, 
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiClipboard,
  FiX,
  FiCheckSquare,
  FiFolder,
  FiMessageSquare,
  FiCalendar,
  FiAward,
  FiVideo,
  FiEdit3
} from "react-icons/fi";
import { userLoggedOut } from "../../redux/features/auth/authslice";
import { useLazyLogOutQuery } from "../../redux/features/auth/authApi.js";
import logoImg from "../../carouselimages/footerLogo2.png";

const NavItem = ({ title, to, icon: Icon, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(`${to}/`));

  return (
    <Link to={to} className="block w-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center px-4 py-3 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
          isActive 
            ? "bg-primary text-white font-semibold shadow-md" 
            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        }`}
      >
        <div className={`flex items-center justify-center ${isActive ? "text-white" : ""}`}>
          <Icon size={20} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-4 text-[14px] whitespace-nowrap"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

const AdminSidebar = ({ forceOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerLogout] = useLazyLogOutQuery();

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("adminSidebarCollapsed", newState.toString());
  };

  const handleLogout = async () => {
    await triggerLogout().unwrap(); // Hits backend to clear HttpOnly cookies
    dispatch(userLoggedOut());
    navigate("/"); 
  };

  const activeCollapsed = forceOpen ? false : isCollapsed;

  return (
    <motion.aside
      initial={false}
      animate={{ width: activeCollapsed ? "80px" : "280px" }}
      className="h-full bg-sidebar flex flex-col shadow-2xl relative z-50 border-r border-gray-800"
    >
      {/* Mobile Close Button */}
      {forceOpen && (
        <button
          onClick={onMobileClose}
          className="absolute right-4 top-6 text-gray-400 hover:text-white lg:hidden z-50 p-2"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Collapse Toggle (Desktop only) */}
      {!forceOpen && (
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-8 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-600 transition-colors z-50 hidden lg:block"
        >
          {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      )}

      {/* Header / Logo */}
      <div className="flex items-center justify-center h-24 border-b border-gray-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src={logoImg} alt="Kairaa Logo" className="w-full h-full object-contain" />
          </div>
          {!activeCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-white font-bold text-sm leading-none tracking-wider font-poppins">
                KAIRAA
              </span>
              <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-widest mt-1">
                Blockchain Academy
              </span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 scrollbar-hide">
        
        {/* Main Section */}
        <div className="mb-6">
          {!activeCollapsed && (
            <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Overview
            </p>
          )}
          <NavItem title="Dashboard" to="/admin/dashboard" icon={FiGrid} isCollapsed={activeCollapsed} />
          {user?.role === "staff" && (
            <>
              <NavItem title="My Students" to="/staff/dashboard" icon={FiUsers} isCollapsed={activeCollapsed} />
              <NavItem title="Assignments" to="/staff/assignments" icon={FiCheckSquare} isCollapsed={activeCollapsed} />
              <NavItem title="Projects" to="/staff/projects" icon={FiFolder} isCollapsed={activeCollapsed} />
              <NavItem title="Doubt Center" to="/staff/doubts" icon={FiMessageSquare} isCollapsed={activeCollapsed} />
              <NavItem title="Attendance" to="/staff/attendance" icon={FiCalendar} isCollapsed={activeCollapsed} />
              <NavItem title="Certificates" to="/staff/certificates" icon={FiAward} isCollapsed={activeCollapsed} />
              <NavItem title="Zoom Meetings" to="/staff/meetings" icon={FiVideo} isCollapsed={activeCollapsed} />
              <NavItem title="Quiz Management" to="/staff/quizzes" icon={FiEdit3} isCollapsed={activeCollapsed} />
            </>
          )}
        </div>

        {/* Admin Only Sections */}
        {user?.role === "admin" && (
          <>
            {/* Data Management Section */}
            <div className="mb-6">
              {!activeCollapsed && (
                <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Management
                </p>
              )}
              <NavItem title="Users" to="/admin/users" icon={FiUsers} isCollapsed={activeCollapsed} />
              <NavItem title="Courses" to="/admin/courses" icon={FiBookOpen} isCollapsed={activeCollapsed} />
              <NavItem title="NEET Management" to="/admin/neet" icon={FiFolder} isCollapsed={activeCollapsed} />
              <NavItem title="Enquiries" to="/admin/registrations" icon={FiClipboard} isCollapsed={activeCollapsed} />
              <NavItem title="Course Purchases" to="/admin/orders" icon={FiShoppingCart} isCollapsed={activeCollapsed} />
              <NavItem title="NEET Purchases" to="/admin/neet-purchases" icon={FiShoppingCart} isCollapsed={activeCollapsed} />
              <NavItem title="Certificates" to="/admin/certificates" icon={FiAward} isCollapsed={activeCollapsed} />
            </div>

            {/* Content Section */}
            <div className="mb-6">
              {!activeCollapsed && (
                <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Content
                </p>
              )}
              <NavItem title="Blogs" to="/admin/manage-blogs" icon={FiFileText} isCollapsed={activeCollapsed} />
              <NavItem title="Gallery" to="/admin/edit-gallery-image" icon={FiImage} isCollapsed={activeCollapsed} />
            </div>

            {/* System Section */}
            <div className="mb-6">
              {!activeCollapsed && (
                <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  System
                </p>
              )}
              <NavItem title="Audit Logs" to="/admin/audit-logs" icon={FiShield} isCollapsed={activeCollapsed} />
              {/* <NavItem title="Settings" to="/admin/settings" icon={FiSettings} isCollapsed={activeCollapsed} /> */}
            </div>
          </>
        )}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors group"
        >
          <FiLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!activeCollapsed && <span className="ml-4 text-sm font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
