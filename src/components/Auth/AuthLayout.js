import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSparkles, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineChevronLeft } from "react-icons/hi";
import logo from "../../carouselimages/Blockchain-Academy-Logo.png";

const rotatingPanels = [
  {
    id: 1,
    title: "Student Success Stories",
    icon: <HiOutlineSparkles className="w-8 h-8 text-primary" />,
    content: '"The internship program landed me my first Web3 developer role in just 3 months. Incredible ecosystem."',
    subtext: "Alex M. - Smart Contract Dev",
    stats: "94% Placement Rate"
  },
  {
    id: 2,
    title: "Recent Placements",
    icon: <HiOutlineBriefcase className="w-8 h-8 text-secondary" />,
    content: "Our alumni are building the future at top Web3 companies like Polygon, Binance, and Ethereum Foundation.",
    subtext: "Join 10k+ Active Learners",
    stats: "$85k Avg Starting Salary"
  },
  {
    id: 3,
    title: "Community Highlights",
    icon: <HiOutlineUserGroup className="w-8 h-8 text-accent" />,
    content: "Connect with industry leaders, participate in global hackathons, and build your portfolio with live projects.",
    subtext: "Live Activity: Priya earned Blockchain Cert.",
    stats: "7000+ Students"
  }
];

const AuthLayout = ({ children, title, subtitle }) => {
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePanel((prev) => (prev + 1) % rotatingPanels.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col md:flex-row font-poppins relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Left Sidebar - Interactive Academy Experience (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-surface/50 border-r border-white/10 p-12 flex-col justify-center relative z-10 backdrop-blur-sm">
        
        {/* Floating Back Navigation Desktop (Left Side) */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back to Academy
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-h-[800px] mx-auto w-full max-w-md mt-10">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="Kairaa Logo" className="w-[160px] xl:w-[200px] object-contain drop-shadow-[0_0_15px_rgba(0,242,254,0.2)]" />
          </Link>
          <div className="text-left">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Web3 Future</span>.
            </h2>
            <p className="text-slate-400 text-lg">
              Join the world's most advanced blockchain learning ecosystem.
            </p>
          </div>

        {/* Rotating Panels */}
        <div className="relative h-64 mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 p-8 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  {rotatingPanels[activePanel].icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{rotatingPanels[activePanel].title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  {rotatingPanels[activePanel].content}
                </p>
              </div>
              <div className="flex items-end justify-between mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Highlight</p>
                  <p className="text-sm font-medium text-white">{rotatingPanels[activePanel].subtext}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Metric</p>
                  <p className="text-sm font-bold text-primary">{rotatingPanels[activePanel].stats}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 text-sm text-slate-500 font-medium bg-white/5 p-4 rounded-xl border border-white/10">
          <p>✨ "Every expert was once a beginner."</p>
        </div>
        </div>
      </div>

      {/* Right Side - Authentication Forms */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative z-10 overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="w-full flex md:hidden items-center justify-between mb-12">
          <Link to="/">
            <img src={logo} alt="Kairaa Logo" className="h-10" />
          </Link>
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-1">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <div className="w-full max-w-md">

          {/* Header Text */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-slate-400">{subtitle}</p>}
          </div>

          {/* Children (The Form) */}
          {children}

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
