import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { 
  FiArrowRight, FiPlayCircle, FiCheckCircle, FiXCircle, FiUsers, FiBook, FiAward, 
  FiCode, FiBriefcase, FiMapPin, FiGithub, FiExternalLink, FiVideo, FiMessageSquare, 
  FiChevronDown, FiStar, FiMonitor, FiCpu, FiDatabase
} from "react-icons/fi";
import CustomModel from "../utils/CustomModel.js";
import Header from "../components/Header";
import Footer from "../components/Footer.js";
import Heading from "../components/Heading";
import EnquiryForm from "../utils/EnquiryForm.js";

// Import Local Image for Bento Grid
import courseImg from "../assets/topcourseBlockchain.jpg";

// Utility: Animated Counter
const AnimatedCounter = ({ value, suffix = "+" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      count.set(0);
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasOpenedEnquiryForm = sessionStorage.getItem("hasOpenedEnquiryForm");
    if (!hasOpenedEnquiryForm) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        sessionStorage.setItem("hasOpenedEnquiryForm", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="overflow-x-hidden min-h-screen font-poppins text-slate-300 bg-[#050810] selection:bg-primary/30">
      <Heading title="Kairaa Academy | Learn Today. Build Tomorrow." description="Premium Web3 & Tech Education Platform" />
      <Header isModalOpen={isModalOpen} open={open} setOpen={setOpen} activeItem={0} setRoute={setRoute} route={route} />

      <main className="pt-[80px]">
        
        {/* =========================================
            SECTION 1: HIGHLY INNOVATIVE HERO
        ========================================= */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-30"
            >
              <source src="https://media.istockphoto.com/id/2197107553/video/futuristic-network-workflow-and-data-connection-diagram.mp4?s=mp4-640x640-is&k=20&c=z4xV3yVLPOglXKBsr0-o38_4JUY6lV4fUxsmkTK9VKY=" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/40 via-transparent to-[#050810]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-transparent to-[#050810]" />
          </div>

          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
            
            {/* Animated Rising Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: "100vh", left: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2 }}
                  animate={{ y: "-10vh" }}
                  transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
                  className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,254,1)]"
                />
              ))}
            </div>

            {/* Floating Tech Nodes */}
            <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
              {[
                { icon: <FiCode size={32} />, top: "15%", left: "15%", delay: 0 },
                { icon: <FiDatabase size={32} />, top: "70%", left: "10%", delay: 1 },
                { icon: <FiCpu size={32} />, top: "25%", right: "15%", delay: 2 },
                { icon: <FiMonitor size={32} />, top: "65%", right: "12%", delay: 0.5 },
              ].map((node, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [0, -40, 0], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 6 + idx, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
                  className="absolute text-primary bg-[#050810]/80 p-5 rounded-2xl border border-primary/20 shadow-[0_0_40px_rgba(0,242,254,0.3)] backdrop-blur-md"
                  style={{ top: node.top, left: node.left, right: node.right }}
                >
                  {node.icon}
                </motion.div>
              ))}
            </div>

            {/* The Glass Terminal Centerpiece */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="w-full max-w-4xl relative group z-20"
            >
              {/* Glowing Aura Behind Terminal */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-[#050810]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_100px_rgba(0,242,254,0.1)] overflow-hidden">
                
                {/* Top Window Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 flex items-center px-4 gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-[10px] font-mono text-slate-500">root@kairaa:~# boot_academy.sh</span>
                </div>

                <div className="pt-8">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Protocol Initialized</span>
                  </motion.div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
                    Deploy Your Future To <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white animate-gradient-x">The Mainnet.</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
                    Stop watching tutorials. Start shipping production-grade dApps, AI bots, and Full-Stack systems with Elite Web3 Engineers.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-20">
                    <button onClick={() => navigate('/courses')} className="w-full sm:w-auto px-10 py-5 bg-white text-[#050810] text-lg font-extrabold rounded-2xl hover:bg-primary transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,254,0.4)] hover:scale-105 duration-300">
                      Initialize Learning
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white text-lg font-extrabold rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-3">
                      <FiPlayCircle size={24} className="text-primary" /> Book Live Demo
                    </button>
                  </div>
                </div>

                {/* Floating Decorative Elements inside the glass */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -bottom-20 -right-20 w-64 h-64 border border-white/5 rounded-full border-dashed opacity-50 pointer-events-none" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-20 -left-20 w-48 h-48 border border-white/10 rounded-full border-dashed opacity-50 pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================
            SECTION 2: TRUST BAR
        ========================================= */}
        <section className="border-b border-white/5 bg-[#0B1120]/50 backdrop-blur-md relative z-20 -mt-1">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {[
                { label: "Active Students", val: 1200 },
                { label: "Premium Courses", val: 50 },
                { label: "Expert Mentors", val: 10 },
                { label: "Completion Rate", val: 96, s: "%" },
              ].map((stat, i) => (
                <div key={i} className="py-8 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl md:text-4xl font-extrabold text-white mb-1"><AnimatedCounter value={stat.val} suffix={stat.s || "+"} /></span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 3: LEARNING JOURNEY
        ========================================= */}
        <section className="py-32 border-b border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-extrabold text-white mb-6"
              >
                The Success Roadmap
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-lg"
              >
                A highly optimized pipeline designed for ultimate career acceleration.
              </motion.p>
            </div>

            <div className="flex flex-col md:flex-row justify-between relative max-w-5xl mx-auto">
              {/* Animated Connector Line */}
              <motion.div 
                initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ amount: 0.3 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary via-accent to-purple-500 -translate-y-1/2 z-0 origin-left" 
              />
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-[-1]" />
              
              {[
                { step: "01", title: "Enroll", icon: <FiCheckCircle /> },
                { step: "02", title: "Live Classes", icon: <FiMonitor /> },
                { step: "03", title: "Build Projects", icon: <FiCode /> },
                { step: "04", title: "Get Certified", icon: <FiAward /> },
                { step: "05", title: "Get Hired", icon: <FiBriefcase /> },
              ].map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 30 }} 
                  whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                  viewport={{ amount: 0.3 }} 
                  transition={{ delay: idx * 0.2 + 0.2, type: "spring", stiffness: 100 }}
                  key={idx} className="relative z-10 flex flex-col items-center mb-12 md:mb-0 group cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="w-16 h-16 bg-[#050810] border-2 border-white/20 rounded-2xl flex items-center justify-center text-2xl text-slate-300 mb-4 shadow-xl group-hover:border-primary group-hover:text-primary transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] relative"
                  >
                    {/* Inner glowing pulse on hover */}
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <span className="relative z-10">{item.icon}</span>
                  </motion.div>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-white transition-colors">Step {item.step}</span>
                  <h4 className="text-white font-bold text-center group-hover:text-primary transition-colors">{item.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 4: FEATURED COURSES (BENTO GRID)
        ========================================= */}
        <section className="py-32 border-b border-white/5 bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex justify-between items-end mb-16">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Master Future Skills</h2>
                <p className="text-slate-400 text-lg">Elite programs designed for the modern tech landscape.</p>
              </motion.div>
              <motion.button initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} onClick={() => navigate('/courses')} className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-white transition-colors">
                View All <FiArrowRight />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Feature */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="md:col-span-2 relative group rounded-3xl overflow-hidden cursor-pointer" onClick={() => navigate('/courses')}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/80 to-transparent z-10" />
                <img src={courseImg} alt="Blockchain" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary text-[#050810] text-xs font-bold uppercase px-3 py-1 rounded-full">Flagship</span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">Blockchain</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 group-hover:text-primary transition-colors">Certified Blockchain Architect</h3>
                  <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-300">
                    <span className="flex items-center gap-2"><FiMonitor className="text-slate-500" /> 6 Months</span>
                    <span className="flex items-center gap-2"><FiUsers className="text-slate-500" /> 450+ Enrolled</span>
                    <span className="flex items-center gap-2"><FiStar className="text-accent" /> 4.9 Rating</span>
                  </div>
                </div>
              </motion.div>

              {/* Stacked Features */}
              <div className="flex flex-col gap-6">
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 relative group rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-[#050810]" onClick={() => navigate('/courses')}>
                  <div className="p-8 h-full flex flex-col justify-between z-20 relative hover:bg-white/5 transition-colors">
                    <div>
                      <span className="bg-accent/20 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full mb-6 inline-block">Full Stack</span>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">Web3 Full Stack Dev</h3>
                      <p className="text-slate-400 text-sm">Master React, Node, and Solidity.</p>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover:text-white transition-colors text-2xl self-end" />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex-1 relative group rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-[#050810]" onClick={() => navigate('/courses')}>
                  <div className="p-8 h-full flex flex-col justify-between z-20 relative hover:bg-white/5 transition-colors">
                    <div>
                      <span className="bg-purple-500/20 text-purple-400 text-xs font-bold uppercase px-3 py-1 rounded-full mb-6 inline-block">AI / ML</span>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Applied AI & Agents</h3>
                      <p className="text-slate-400 text-sm">Build intelligent apps with LLMs.</p>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover:text-white transition-colors text-2xl self-end" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 5: WHY KAIRAA (COMPARISON)
        ========================================= */}
        <section className="py-32 border-b border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-extrabold text-white mb-6"
              >
                Why We Win
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-lg"
              >
                The difference between standard learning and premium career acceleration.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.2 }} transition={{ duration: 0.8 }}
              className="bg-[#050810] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-sm">Features</div>
                <div className="text-center text-slate-500 font-bold uppercase tracking-wider text-xs md:text-sm">Other Academies</div>
                <div className="text-center text-primary font-bold uppercase tracking-wider text-xs md:text-sm">Kairaa Academy</div>
              </div>
              
              {[
                { feature: "Live Expert Mentorship", others: false, kairaa: true },
                { feature: "Tamil Language Learning", others: false, kairaa: true },
                { feature: "Production-Ready Projects", others: false, kairaa: true },
                { feature: "Placement Support", others: false, kairaa: true },
                { feature: "Verified On-Chain Certs", others: false, kairaa: true },
              ].map((row, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.5 }} transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={idx} className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <div className="text-white font-medium text-sm md:text-base flex items-center">{row.feature}</div>
                  <div className="flex justify-center items-center">
                    {row.others ? <FiCheckCircle className="text-slate-500" size={24} /> : <FiXCircle className="text-slate-700" size={24} />}
                  </div>
                  <div className="flex justify-center items-center">
                    {row.kairaa ? <FiCheckCircle className="text-primary drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]" size={24} /> : <FiXCircle className="text-slate-700" size={24} />}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 6: LIVE CLASS EXPERIENCE
        ========================================= */}
        <section className="py-32 border-b border-white/5 bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Inside the Classroom</h2>
              <p className="text-slate-400 text-lg">Experience our high-octane live interactive dashboard.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8 }} className="bg-[#050810] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl h-[500px]">
              {/* Video Panel */}
              <div className="w-full md:w-2/3 bg-black relative border-r border-white/10">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60" alt="Screen Share" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/> LIVE</span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">01:24:30</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" className="w-10 h-10 rounded-full border-2 border-primary" alt="Instructor" />
                    <div><h4 className="text-white font-bold text-sm">Dr. Sarah (Instructor)</h4><p className="text-xs text-primary">Explaining Merkle Trees</p></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white"><FiVideo/></div>
                    <div className="w-10 h-10 bg-red-500/80 backdrop-blur rounded-full flex items-center justify-center text-white"><FiXCircle/></div>
                  </div>
                </div>
              </div>
              
              {/* Chat Panel */}
              <div className="w-full md:w-1/3 bg-[#0B1120] flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h4 className="text-white font-bold flex items-center gap-2"><FiMessageSquare/> Class Chat</h4>
                  <span className="text-xs text-slate-500 font-bold">45 Online</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                  {[{n:"Rahul", m:"So the root hash changes entirely?"}, {n:"Priya", m:"Yes, exactly!"}, {n:"Instructor", m:"Correct. Let's look at the code.", p:true}].map((c,i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">{c.n[0]}</div>
                      <div>
                        <span className={`text-xs font-bold ${c.p ? 'text-primary' : 'text-slate-400'}`}>{c.n}</span>
                        <p className="text-sm text-slate-300">{c.m}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="bg-[#050810] border border-white/10 rounded-full px-4 py-2 text-sm text-slate-500">Type a message...</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 8: PROJECT SHOWCASE
        ========================================= */}
        <section className="py-32 border-b border-white/5 bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Built by Students</h2>
              <p className="text-slate-400 text-lg">We don't just write code. We ship production-grade products.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Decentralized Exchange (DEX)", tech: ["React", "Solidity", "Hardhat"], img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" },
                { title: "NFT Marketplace", tech: ["Next.js", "IPFS", "Ethers.js"], img: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800" }
              ].map((proj, i) => (
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.2 }} key={i} className="group relative rounded-3xl overflow-hidden bg-[#050810] border border-white/10">
                  <div className="aspect-video overflow-hidden">
                    <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{proj.title}</h3>
                    <div className="flex gap-2 mb-6">
                      {proj.tech.map((t, x) => <span key={x} className="bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase px-2 py-1 rounded">{t}</span>)}
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"><FiGithub /> Source Code</button>
                      <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"><FiExternalLink /> Live Demo</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 9: MENTOR SPOTLIGHT
        ========================================= */}
        <section className="py-32 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Learn From The Best</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: "Dr. Sarah", role: "Protocol Engineer", exp: "8 Yrs", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
                { name: "David Chen", role: "Smart Contract Auditor", exp: "5 Yrs", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" },
                { name: "Priya Sharma", role: "DeFi Architect", exp: "6 Yrs", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" },
                { name: "Alex K.", role: "AI Specialist", exp: "7 Yrs", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
              ].map((mentor, i) => (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.1 }} key={i} className="group bg-[#0B1120] border border-white/10 rounded-3xl p-4 hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                    <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-1">{mentor.name}</h3>
                  <p className="text-xs text-primary text-center font-bold uppercase tracking-wider mb-2">{mentor.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 11: CERTIFICATIONS
        ========================================= */}
        <section className="py-32 border-b border-white/5">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8 }} className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Verified On-Chain Credentials</h2>
            <p className="text-slate-400 text-lg mb-16">Share your achievements globally with cryptographic proof.</p>
            <div className="relative max-w-2xl mx-auto aspect-[1.4] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center p-8 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
              <div className="border-8 border-double border-primary/30 w-full h-full flex flex-col items-center justify-center p-6 bg-[#050810]/80 backdrop-blur-sm relative z-10">
                <FiAward size={48} className="text-primary mb-4" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Certificate of Excellence</h3>
                <p className="text-slate-400 mb-8">This certifies the successful completion of the Flagship Bootcamp.</p>
                <div className="w-full flex justify-between border-t border-white/10 pt-4 px-8">
                  <div className="text-left"><p className="text-xs text-slate-500 font-bold uppercase">ID Number</p><p className="text-white font-bold">KBA-2026-98X</p></div>
                  <div className="text-right"><p className="text-xs text-slate-500 font-bold uppercase">Date</p><p className="text-white font-bold">Oct 2026</p></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 12: COMMUNITY HUB
        ========================================= */}
        <section className="py-32 border-b border-white/5 bg-[#0B1120]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="container mx-auto px-6 max-w-5xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865F2]/20 text-[#5865F2] mb-6"><FiMessageSquare size={32} /></div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Join the 24/7 Hacker Lounge</h2>
            <p className="text-slate-400 text-lg mb-12">Collaborate, debug, and participate in exclusive hackathons in our private community.</p>
            <button className="px-8 py-4 bg-[#5865F2] text-white font-extrabold rounded-xl hover:bg-[#4752C4] transition-colors shadow-[0_0_30px_rgba(88,101,242,0.4)]">
              Enter Discord Server
            </button>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 13: FAQ ACCORDION
        ========================================= */}
        <section className="py-32 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-3xl font-extrabold text-white mb-12 text-center">Frequently Asked Questions</motion.h2>
            <div className="space-y-4">
              {[
                { q: "Do I need coding experience?", a: "For our introductory courses, no. For advanced tracks, basic JavaScript knowledge is required." },
                { q: "Is there job placement assistance?", a: "Yes, we have 50+ hiring partners and a dedicated placement cell to help you land interviews." },
                { q: "Are the live sessions recorded?", a: "Absolutely. All live classes are recorded and available in your dashboard for lifetime access." }
              ].map((faq, i) => (
                <motion.details initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.4, delay: i * 0.1 }} key={i} className="group bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer">
                  <summary className="font-bold text-white list-none flex justify-between items-center">
                    {faq.q} <FiChevronDown className="text-primary group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-slate-400 mt-4 leading-relaxed border-l-2 border-primary pl-4">{faq.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 14: PREMIUM FINAL CTA
        ========================================= */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-purple-500/20 opacity-30" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Ready To Build Your Tech Career?</h2>
            <p className="text-xl text-slate-300 mb-12">Join thousands of learners mastering future-ready skills today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => navigate('/courses')} className="px-10 py-5 bg-white text-[#050810] text-lg font-extrabold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto">
                Explore Courses
              </button>
              <button onClick={() => setIsModalOpen(true)} className="px-10 py-5 bg-[#050810] border border-white/20 text-white text-lg font-extrabold rounded-2xl hover:bg-white/5 transition-all w-full sm:w-auto">
                Talk To Advisor
              </button>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
      {isModalOpen && <CustomModel open={isModalOpen} setOpen={setIsModalOpen} component={EnquiryForm} />}
    </div>
  );
};

export default HomePage;
