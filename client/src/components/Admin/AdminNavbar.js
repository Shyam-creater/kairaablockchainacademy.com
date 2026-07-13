import React, { useState, useEffect } from "react";
import { 
  FiUser, FiChevronDown, FiLogOut, FiSearch, FiMaximize, FiSettings, 
  FiBell, FiActivity, FiPlus, FiServer, FiDatabase, FiHardDrive, 
  FiShield, FiClock, FiX, FiCheck, FiVideo, FiFileText, FiMessageSquare, FiAward
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { userLoggedOut } from "../../redux/features/auth/authslice";
import { useLazyLogOutQuery } from "../../redux/features/auth/authApi.js";
import NotificationBell from "../NotificationBell"; // Reusing but wrapped

// ── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_ACTIVITY_FEED = [
  { id: 1, text: "Sarah enrolled in Advanced Web3", time: "2 mins ago", type: "student", icon: <FiUser /> },
  { id: 2, text: "Certificate approved for Michael", time: "15 mins ago", type: "cert", icon: <FiAward /> },
  { id: 3, text: "New quiz published: React Basics", time: "1 hour ago", type: "quiz", icon: <FiFileText /> },
];

const SEARCH_INDEX = [
  { title: "Manage Students", category: "Users", path: "/admin/users" },
  { title: "Manage Staff", category: "Users", path: "/admin/staff" },
  { title: "All Courses", category: "Courses", path: "/admin/courses" },
  { title: "Create Course", category: "Courses", path: "/admin/create-course" },
  { title: "Invoices & Orders", category: "Finance", path: "/admin/invoices" },
  { title: "Certificate Settings", category: "System", path: "/admin/certificates" },
  { title: "Hero Layout", category: "System", path: "/admin/hero" },
  { title: "Audit Logs", category: "Security", path: "/admin/audit-logs" },
];

// ── Components ────────────────────────────────────────────────────────────

// 1. Announcement Banner
const AnnouncementBanner = ({ onClose }) => (
  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-primary/20 border-b border-primary/30 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[11px] font-bold text-primary tracking-widest uppercase">
      <span className="flex items-center gap-2"><FiActivity /> System Update: LMS Version 2.0 Deployed Successfully.</span>
      <button onClick={onClose} className="hover:text-white transition-colors p-1"><FiX size={14}/></button>
    </div>
  </motion.div>
);

// 2. Command Palette Modal
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); onClose(!isOpen); }
      if (e.key === 'Escape' && isOpen) onClose(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = SEARCH_INDEX.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose(false)} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} className="relative w-full max-w-xl bg-[#0B0F19] border border-primary/30 shadow-[0_0_50px_rgba(0,242,254,0.15)] rounded-2xl overflow-hidden">
          <div className="flex items-center px-4 border-b border-white/10 bg-white/5">
            <FiSearch className="text-primary" size={20} />
            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pages, users, courses..." className="w-full bg-transparent border-none text-white px-4 py-4 outline-none placeholder-slate-500 font-medium" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 bg-white/5 rounded">ESC</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length > 0 ? results.map((r, i) => (
              <button key={i} onClick={() => { navigate(r.path); onClose(false); }} className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-primary/10 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-primary transition-colors"><FiFileText size={16}/></div>
                  <div><p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{r.title}</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">{r.category}</p></div>
                </div>
                <FiCheck className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )) : <div className="p-8 text-center text-sm text-slate-500 font-medium">No results found for "{query}"</div>}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Main Navbar Component
const AdminNavbar = ({ onToggleMobileMenu }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerLogout] = useLazyLogOutQuery();

  const [showBanner, setShowBanner] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'profile', 'quick', 'status', 'theme', 'activity'

  const handleLogout = async () => {
    await triggerLogout().unwrap();
    dispatch(userLoggedOut());
    navigate("/"); 
  };

  const toggleDropdown = (name) => setActiveDropdown(prev => prev === name ? null : name);

  // Clickable Breadcrumbs
  const pathnames = location.pathname.split("/").filter(x => x);
  const breadcrumbs = pathnames.map((path, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    const name = path.replace("-", " ");
    return { name, path: routeTo };
  });

  return (
    <>
      <AnimatePresence>{showBanner && <AnnouncementBanner onClose={() => setShowBanner(false)} />}</AnimatePresence>
      <CommandPalette isOpen={showPalette} onClose={setShowPalette} />

      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/5 h-16 flex flex-col justify-center shrink-0">
        
        {/* Main Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-full">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button onClick={onToggleMobileMenu} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <nav className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide text-slate-400 capitalize">
              <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <span className="text-slate-600">/</span>
                  <Link to={crumb.path} className={`transition-colors ${i === breadcrumbs.length - 1 ? "text-white truncate max-w-[150px]" : "hover:text-primary"}`}>{crumb.name}</Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Center: Global Search Trigger */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-md px-8">
            <button onClick={() => setShowPalette(true)} className="flex items-center justify-between w-full bg-white/5 border border-slate-600 rounded-xl px-4 py-2 hover:bg-white/10 hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-white transition-colors">
                <FiSearch className="text-primary" size={16} /> <span className="text-sm font-medium">Search anything...</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-[#0B0F19] px-2 py-1 rounded">
                <span>Ctrl</span><span>K</span>
              </div>
            </button>
          </div>

          {/* Right: Actions, Status, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Quick Actions Dropdown */}
            <div className="relative hidden sm:block">
              <button onClick={() => toggleDropdown('quick')} className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.15)]"><FiPlus size={18} /></button>
              <AnimatePresence>
                {activeDropdown === 'quick' && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-[120%] w-48 bg-[#0B0F19] border border-white/10 shadow-2xl rounded-xl overflow-hidden z-50">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 bg-white/5">Quick Actions</div>
                    <div className="p-1">
                      {[
                        { label: "Create Course", icon: <FiFileText />, path: "/admin/create-course" },
                        { label: "Add Staff", icon: <FiUser />, path: "/admin/staff" },
                        { label: "Schedule Class", icon: <FiVideo />, path: "/admin/meetings" },
                        { label: "Generate Cert", icon: <FiAward />, path: "/admin/certificates" }
                      ].map((item, i) => (
                        <button key={i} onClick={() => { navigate(item.path); setActiveDropdown(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <span className="text-slate-500">{item.icon}</span> {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

           

            {/* Fullscreen & Notifications */}
            <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }} className="hidden sm:block p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-slate-600">
              <FiMaximize size={16} />
            </button>

            <NotificationBell />

            {/* Activity Feed Trigger */}
            <button onClick={() => toggleDropdown('activity')} className="relative p-2 text-slate-400 hover:text-accent bg-white/5 hover:bg-accent/10 rounded-full transition-colors border border-transparent hover:border-accent/30">
              <FiActivity size={16} />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#8b5cf6]" />
            </button>

            {/* Profile Menu */}
            <div className="relative ml-2">
              <button onClick={() => toggleDropdown('profile')} className="flex items-center gap-3 focus:outline-none group">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/50 shadow-[0_0_10px_rgba(0,242,254,0.3)] flex items-center justify-center text-primary font-bold transition-all group-hover:shadow-[0_0_20px_rgba(0,242,254,0.5)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white tracking-wide">{user?.name?.split(" ")[0] || "Admin"}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || "Administrator"}</span>
                </div>
                <FiChevronDown className={`text-slate-500 hidden lg:block transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-[120%] w-72 bg-[#0B0F19] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xl font-bold">{user?.name ? user.name.charAt(0) : "A"}</div>
                        <div>
                          <p className="text-sm font-bold text-white">{user?.name || "Admin User"}</p>
                          <p className="text-xs text-slate-400">{user?.email || "admin@lms.com"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security Info */}
                    <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FiShield /> Active Session Security</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Last Login:</span><span className="text-white font-mono">Today, 10:45 AM</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-slate-400">Device/IP:</span><span className="text-white font-mono">Windows • 192.168.1.1</span></div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><FiUser /> Edit Profile</button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><FiSettings /> Account Settings</button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><FiShield /> Privacy & Security</button>
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors border border-danger/30 hover:shadow-[0_0_15px_rgba(255,23,68,0.2)]">
                        <FiLogOut size={14} /> Sign out of Academy
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Activity Drawer (Slide from Right) */}
      <AnimatePresence>
        {activeDropdown === 'activity' && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveDropdown(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-sm bg-[#0B0F19] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col z-10">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><FiActivity className="text-accent" /> Live Activity Feed</h3>
                <button onClick={() => setActiveDropdown(null)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5"><FiX size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="relative pl-5 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-white/10 space-y-6">
                  {MOCK_ACTIVITY_FEED.map(act => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[27px] top-1 bg-[#0B0F19] rounded-full p-1 text-slate-400 border border-white/10 bg-white/5">{act.icon}</div>
                      <p className="text-sm font-bold text-white">{act.text}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1"><FiClock className="inline mr-1"/>{act.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <button className="w-full py-2.5 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 rounded-xl transition-colors border border-accent/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">View Full Audit Log</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;
