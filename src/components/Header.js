import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { 
  HiOutlineMenuAlt3, 
  HiOutlineUserCircle, 
  HiX, 
  HiOutlineSearch, 
  HiOutlineLogout,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiChevronRight
} from "react-icons/hi";

// Assets
import avatar from "../assets/user.png";
import logo2 from "../carouselimages/Blockchain-Academy-Logo.png";

// Components
import NotificationBell from "./NotificationBell";
import MegaMenu from "./MegaMenu.jsx";
import StreakWidget from "./ui/StreakWidget";
import QuickActions from "./ui/QuickActions";
import StudentStatusCenter from "./ui/StudentStatusCenter";
import { NeonButton } from "./ui/NeonUI";

// API
import { useLogOutQuery } from "../redux/features/auth/authApi.js";
import { useGetStudentDashboardMetricsQuery } from "../redux/features/student/studentApi.js";

const Header = ({
  activeItem,
  setOpen,
  open,
  route,
  setRoute,
  isModalOpen,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showQuickBar, setShowQuickBar] = useState(true);
  const [headerMode, setHeaderMode] = useState("Academy"); // "Academy" or "Learning Hub"
  const [profileDropdown, setProfileDropdown] = useState(false);
  
  const profileRef = useRef(null);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { data: metrics } = useGetStudentDashboardMetricsQuery(undefined, { skip: !user });
  
  const [logOut, setLogOut] = useState(false);
  const { refetch } = useLogOutQuery(undefined, { skip: !logOut });

  const logOutHandler = () => {
    setLogOut(true);
  };

  useEffect(() => {
    if (logOut) {
      refetch().then(() => setProfileDropdown(false)).finally(() => setLogOut(false));
    }
  }, [logOut, refetch]);

  // Handle Scroll Direction for Smart Header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background blur effect
      setIsScrolled(currentScrollY > 20);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close quick action bar on profile pages
  useEffect(() => {
    if (location.pathname.includes("/profile")) {
      setShowQuickBar(false);
    }
  }, [location.pathname]);

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard / Learning Hub";
    if (path.includes("course")) return "Dashboard / My Courses";
    if (path.includes("profile")) return "Dashboard / Settings";
    return "Dashboard / Overview";
  };

  return (
    <div className="w-full relative font-sans">
      {/* Quick Action Bar */}
      <AnimatePresence>
        {showQuickBar && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-[#0B0F19] via-primary/20 to-[#0B0F19] border-b border-primary/20 py-1.5 px-4 flex items-center justify-center transition-transform duration-300 ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs"><HiOutlineSparkles /></span>
              <span className="text-xs font-bold text-slate-200">Unlock your potential with premium learning paths.</span>
              <Link to="/courses" className="text-xs font-bold text-primary hover:text-white underline underline-offset-4 decoration-primary/50 hover:decoration-white transition-all ml-1">
                Enroll in Featured Courses &rarr;
              </Link>
            </div>
            <button 
              onClick={() => setShowQuickBar(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
            >
              <HiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed left-0 w-full z-50 transition-all duration-300 ease-in-out border-b ${
          isScrolled
            ? "top-0 bg-[#0B0F19]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-[70px]"
            : `${showQuickBar ? "top-[33px]" : "top-0"} bg-[#0B0F19] border-white/5 h-[80px]`
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-4">
          
          {/* ================= LEFT SECTION ================= */}
          <div className="flex items-center gap-6 xl:gap-8 flex-shrink-0">
            <Link to={"/"} className="block hover:opacity-80 transition-opacity">
              <img src={logo2} alt="Logo" className="w-[140px] xl:w-[160px] object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]" />
            </Link>
            
            {/* Mode Switcher */}
            <div className="hidden md:flex bg-[#111827] border border-white/10 rounded-full p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
              <button 
                onClick={() => {
                  setHeaderMode("Academy");
                  navigate("/");
                }}
                className={`relative z-10 w-32 flex items-center justify-center py-2 rounded-full text-sm font-bold transition-all duration-300 ${headerMode === "Academy" ? "text-slate-900" : "text-slate-400 hover:text-white"}`}
              >
                Academy
              </button>
              <button 
                onClick={() => setHeaderMode("Learning Hub")}
                className={`relative z-10 w-32 flex items-center justify-center py-2 rounded-full text-sm font-bold transition-all duration-300 ${headerMode === "Learning Hub" ? "text-white" : "text-slate-400 hover:text-white"}`}
              >
                Learning Hub
              </button>
              
              {/* Animated Background Pill */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-300 ease-out ${
                  headerMode === "Academy" 
                    ? "left-1.5 bg-primary shadow-[0_0_20px_rgba(0,242,254,0.4)]" 
                    : "left-[calc(50%+1.5px)] bg-gradient-to-r from-purple-500 to-accent shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                }`}
              />
            </div>
          </div>

          {/* ================= CENTER SECTION ================= */}
          <div className="flex-1 hidden lg:flex justify-center h-full items-center">
            {headerMode === "Academy" ? (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                <MegaMenu isMobile={false} isScrolled={isScrolled} showQuickBar={showQuickBar} />
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-5"
                  >
                    <StreakWidget 
                      currentStreak={metrics?.currentStreak || metrics?.data?.currentStreak || 0} 
                      bestStreak={metrics?.bestStreak || metrics?.data?.bestStreak || 0}
                      weeklyProgress={metrics?.weeklyProgress || metrics?.data?.weeklyProgress || [false, false, false, false, false, false, false]} 
                    />
                    <div className="w-px h-6 bg-white/10 rounded-full"></div>
                    <StudentStatusCenter progress={metrics?.overallProgress || metrics?.data?.overallProgress || 0} streak={metrics?.currentStreak || metrics?.data?.currentStreak || 0} />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative group cursor-pointer hidden md:block"
                    onClick={() => { setRoute("Login"); setOpen(true); }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative flex items-center gap-3 px-6 py-2.5 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/30 text-primary group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineSparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <span className="text-sm font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:text-white transition-colors">
                        Unlock your learning progress
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center gap-3 xl:gap-5 flex-shrink-0">
            
            {user ? (
              <>
                {/* Removed Learning Hub widgets from right side (moved to center) */}

               

                <NotificationBell />
                <QuickActions />

                {/* Profile Dropdown */}
                <div className="relative z-50" ref={profileRef}>
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center p-1 rounded-full border border-transparent hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div className="relative">
                      <img
                        alt="user-avatar"
                        src={user.avatar ? user.avatar.url : avatar}
                        className="h-10 w-10 rounded-full object-cover border-2 border-white/10 hover:border-primary/50 transition-colors shadow-md"
                      />

                    </div>
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 p-2 rounded-2xl bg-[#111827]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] origin-top-right"
                      >
                        {/* Profile Header Card */}
                        <div className="p-4 mb-2 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={user.avatar ? user.avatar.url : avatar} alt="avatar" className="w-12 h-12 rounded-full border border-primary/30" />
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-white truncate">{user.name}</p>
                              <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                              <p className="text-xs text-slate-400">Courses</p>
                              <p className="text-sm font-bold text-white">{metrics?.activeCourses ?? metrics?.data?.activeCourses ?? 0} Active</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                              <p className="text-xs text-slate-400">Lessons</p>
                              <p className="text-sm font-bold text-success">{metrics?.completedLessons ?? metrics?.data?.completedLessons ?? 0} Done</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <Link to="/profile" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <HiOutlineUserCircle className="w-5 h-5 text-slate-400" />
                            My Profile
                          </Link>
                          <div className="h-px bg-white/10 my-1 mx-2" />
                          <button onClick={() => { setProfileDropdown(false); logOutHandler(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                            <HiOutlineLogout className="w-5 h-5" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <button 
                    onClick={() => navigate("/login")}
                    className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-900 hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] whitespace-nowrap"
                  >
                    Get Started Free
                  </button>
                </div>
              </>
            )}

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <HiOutlineMenuAlt3 size={24} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[998] bg-[#0B0F19]/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full z-[999] bg-[#111827] border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:hidden max-h-[85vh] flex flex-col"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-5" />
              
              <div className="overflow-y-auto px-6 pb-8 custom-scrollbar">
                {user && (
                  <div className="mb-6 flex gap-3">
                    <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">🔥</span>
                      <p className="text-white font-bold text-lg">{metrics?.currentStreak ?? metrics?.data?.currentStreak ?? 0}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Day Streak</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Navigation</p>
                  
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                    <div className="p-2 bg-white/5 rounded-lg text-primary"><HiOutlineBookOpen className="w-5 h-5" /></div>
                    <span className="font-medium text-slate-200">Learning Hub</span>
                  </Link>
                  <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                    <div className="p-2 bg-white/5 rounded-lg text-secondary"><HiOutlineDocumentText className="w-5 h-5" /></div>
                    <span className="font-medium text-slate-200">Browse Courses</span>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                    <div className="p-2 bg-white/5 rounded-lg text-orange-400"><HiOutlineAcademicCap className="w-5 h-5" /></div>
                    <span className="font-medium text-slate-200">My Learning</span>
                  </Link>
                </div>

                {!user && (
                  <div className="mt-8 flex flex-col gap-3">
                    <NeonButton variant="ghost" onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }} className="w-full justify-center">
                      Log In
                    </NeonButton>
                    <NeonButton variant="primary" onClick={() => { setIsMobileMenuOpen(false); navigate("/signup"); }} className="w-full justify-center">
                      Get Started Free
                    </NeonButton>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modals removed in favor of full page AuthLayout routing */}
    </div>
  );
};

export default Header;
