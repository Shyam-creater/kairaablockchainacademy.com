import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminProtected from "../../utils/hooks/adminProtected";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ title, subtitle, action, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AdminProtected>
      <div className="flex h-screen bg-[#0B0F19] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0F19] to-black font-sans overflow-hidden text-slate-200">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block relative z-[100]">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl"
              >
                <AdminSidebar forceOpen={true} onMobileClose={() => setMobileMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full lg:w-auto">
          <AdminNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 overflow-auto pt-3 pb-4 px-4 sm:px-6 bg-transparent scrollbar-hide relative z-0">
            {/* Subtle glowing orb backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px] -z-10 pointer-events-none"></div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full"
            >
              {/* Page Header */}
              {(title || action) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    {title && <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>}
                    {subtitle && <p className="mt-1.5 text-[13px] sm:text-sm text-primary font-medium neon-text">{subtitle}</p>}
                  </div>
                  {action && <div>{action}</div>}
                </div>
              )}
              
              {/* Children / Content */}
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AdminProtected>
  );
};

export default AdminLayout;
