import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useInView, animate } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiPlay, FiBook, FiCode, FiAward, FiBriefcase, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiStar } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

// Reusable animated counter
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

const AboutPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const navigate = useNavigate();

  // Data for Marquee
  const testimonials = [
    { name: "Rahul S.", role: "Smart Contract Auditor", pkg: "24 LPA", review: "Kairaa transformed my career. The live mentorship is unparalleled.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    { name: "Priya M.", role: "DeFi Architect", pkg: "32 LPA", review: "Built 5 production-ready dApps before I even graduated.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    { name: "Arjun K.", role: "Blockchain Dev", pkg: "18 LPA", review: "The placement cell was incredibly supportive throughout.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    { name: "Sneha R.", role: "Protocol Engineer", pkg: "40 LPA", review: "World-class curriculum. Worth every single penny.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-poppins text-slate-300 bg-[#050810] selection:bg-primary/30">
      <Heading title="About Us | Kairaa Academy" description="The Global Leader in Web3 Education" />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main>
        {/* =========================================
            SECTION 1: IMMERSIVE HERO
        ========================================= */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/5 pt-24 pb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none" />
          
          {/* Animated Background Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,254,0.8)]"
              animate={{
                y: ["0vh", "100vh"],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{ left: `${Math.random() * 100}%`, top: '-10%' }}
            />
          ))}

          <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Pioneering Web3 Education</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.1] mb-8"
            >
              Building The Next <br className="hidden md:block"/> Generation Of <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-purple-500">Blockchain Innovators</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              From ambitious students to elite professionals, we empower learners globally with industry-ready skills, real-world DApp projects, and 1-on-1 expert mentorship.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-white text-[#050810] font-extrabold rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto"
              >
                Explore the Academy
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-extrabold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md w-full sm:w-auto"
              >
                Join the Network
              </button>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: ONE DAY AT KAIRAA
        ========================================= */}
        <section className="py-32 border-b border-white/5 relative bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">The Kairaa Journey</h2>
              <p className="text-slate-400 text-lg">A highly optimized pipeline designed for ultimate career acceleration.</p>
            </div>

            <div className="relative">
              <div className="absolute left-[28px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-purple-500 opacity-20" />
              
              {[
                { title: "Immersive Learning", icon: <FiBook />, desc: "Attend highly interactive live sessions with leading industry experts. No boring pre-recorded lectures." },
                { title: "Build Real Projects", icon: <FiCode />, desc: "Develop and deploy your own smart contracts and full-stack dApps to the testnet." },
                { title: "Earn Certification", icon: <FiAward />, desc: "Pass rigorous security audits to earn a globally recognized blockchain credential." },
                { title: "Career Placement", icon: <FiBriefcase />, desc: "Get direct referrals to our 50+ hiring partners and launch your Web3 career." }
              ].map((step, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  key={idx} 
                  className={`relative flex flex-col md:flex-row items-center gap-8 mb-20 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="w-full md:w-1/2 flex justify-start md:justify-end">
                    <div className={`w-full md:w-[85%] bg-[#050810] border border-white/10 p-10 rounded-3xl relative shadow-2xl hover:border-primary/50 transition-colors ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-24 md:pl-10`}>
                      <span className="text-primary text-sm font-bold mb-3 block">Step 0{idx + 1}</span>
                      <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 bg-[#0B1120] border-4 border-primary rounded-full flex items-center justify-center text-white z-10 shadow-[0_0_30px_rgba(0,242,254,0.3)]">
                    {step.icon}
                  </div>
                  <div className="w-full md:w-1/2 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 4: LEARNING ECOSYSTEM (ORBIT)
        ========================================= */}
        <section className="py-32 border-b border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">A Complete Ecosystem</h2>
              <p className="text-slate-400 text-lg mb-20">Everything you need to succeed, centralized in one powerful platform.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8 }} className="relative w-[360px] h-[360px] md:w-[500px] md:h-[500px] mx-auto flex items-center justify-center">
              {/* Center Node */}
              <div className="absolute z-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#050810] border border-primary/50 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,242,254,0.2)] backdrop-blur-xl">
                <span className="text-2xl font-extrabold text-white">Kairaa</span>
                <span className="text-xs text-primary font-bold uppercase tracking-wider">Ecosystem</span>
              </div>

              {/* Orbiting Rings */}
              <div className="absolute inset-0 border border-white/5 rounded-full" />
              <div className="absolute inset-10 border border-white/5 rounded-full" />
              <div className="absolute inset-20 border border-white/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />

              {/* Orbiting Items */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-10"
              >
                {["Courses", "Projects", "Mentorship", "Community", "Careers", "Events"].map((item, i) => (
                  <div 
                    key={i}
                    className="absolute w-20 h-20 md:w-24 md:h-24 -ml-10 -mt-10 md:-ml-12 md:-mt-12 left-1/2 top-1/2"
                    style={{ transform: `rotate(${i * 60}deg) translateY(-160px)` }}
                  >
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-[#0B1120] border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
                    >
                      <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{item}</span>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 5: WHY CHOOSE KAIRAA (COMPARISON)
        ========================================= */}
        <section className="py-32 border-b border-white/5 bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Why Students Choose Us</h2>
              <p className="text-slate-400 text-lg">The difference between standard learning and premium acceleration.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="bg-[#050810] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-sm">Features</div>
                <div className="text-center text-slate-500 font-bold uppercase tracking-wider text-xs md:text-sm">Traditional Academies</div>
                <div className="text-center text-primary font-bold uppercase tracking-wider text-xs md:text-sm">Kairaa Academy</div>
              </div>
              
              {[
                { feature: "Live Expert Mentorship", others: false, kairaa: true },
                { feature: "Production-Ready Projects", others: false, kairaa: true },
                { feature: "Tamil Language Support", others: false, kairaa: true },
                { feature: "Verified On-Chain Certs", others: false, kairaa: true },
                { feature: "Guaranteed Placement Support", others: false, kairaa: true },
              ].map((row, idx) => (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.4, delay: idx * 0.1 }} key={idx} className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
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
            SECTION 6: VISION & MISSION
        ========================================= */}
        <section className="py-24 border-b border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="group bg-gradient-to-br from-[#0B1120] to-[#050810] border border-white/10 hover:border-primary/50 p-12 rounded-3xl transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-colors" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Our Vision</h3>
                <h4 className="text-3xl font-extrabold text-white mb-6 leading-snug">Shaping a blockchain-powered world through education.</h4>
                <p className="text-slate-400 leading-relaxed text-lg">
                  To be a leading force in innovation. By fostering a deep understanding of blockchain technology and driving groundbreaking advancements, we aim to empower individuals and organizations to harness its full potential for transformative impact.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="group bg-gradient-to-br from-[#0B1120] to-[#050810] border border-white/10 hover:border-accent/50 p-12 rounded-3xl transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-accent/20 transition-colors" />
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Our Mission</h3>
                <h4 className="text-3xl font-extrabold text-white mb-6 leading-snug">Empowering the leaders of tomorrow.</h4>
                <p className="text-slate-400 leading-relaxed text-lg">
                  With a focus on practical, hands-on learning and mentorship from experienced professionals, we strive to not just educate, but to inspire and empower the developers who will build the future of the decentralized web.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 7: COMMAND CENTER
        ========================================= */}
        <section className="py-32 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-[100%] blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Academy Analytics</h2>
                <p className="text-slate-400 text-lg">Live metrics from our global learning network.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Status
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: "Active Learners", val: 1200 },
                { label: "Premium Courses", val: 50 },
                { label: "Expert Mentors", val: 15 },
                { label: "Completion Rate", val: 96, s: "%" },
                { label: "Projects Deployed", val: 350 },
                { label: "Hiring Partners", val: 50 },
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  key={i} className="bg-[#0B1120] border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg hover:border-primary/30 transition-colors"
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                    <AnimatedCounter value={stat.val} suffix={stat.s || "+"} />
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 6: STUDENT SUCCESS MARQUEE
        ========================================= */}
        <section className="py-24 border-b border-white/5 bg-[#0B1120] overflow-hidden">
          <div className="container mx-auto px-6 mb-12 text-center">
            <h2 className="text-2xl font-extrabold text-white">Trusted by Thousands</h2>
          </div>
          
          <div className="flex overflow-hidden group">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              className="flex gap-6 whitespace-nowrap px-3"
            >
              {/* Double array for seamless loop */}
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div key={idx} className="w-[350px] shrink-0 bg-[#050810] border border-white/10 p-8 rounded-3xl whitespace-normal">
                  <div className="flex gap-1 text-primary mb-4">
                    {[1,2,3,4,5].map(s => <FiStar key={s} className="fill-current" size={14} />)}
                  </div>
                  <p className="text-slate-300 mb-8 italic">"{t.review}"</p>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="text-white font-bold">{t.name}</h4>
                      <p className="text-xs text-slate-500">{t.role} • <span className="text-accent">{t.pkg}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 8: MEET THE MENTORS
        ========================================= */}
        <section className="py-32 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">World-Class Mentorship</h2>
              <p className="text-slate-400 text-lg">Learn directly from engineers who build the protocols of tomorrow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Dr. Sarah Jenkins", role: "Lead Protocol Architect", exp: "8 Yrs", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
                { name: "David Chen", role: "Smart Contract Auditor", exp: "5 Yrs", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
                { name: "Priya Sharma", role: "DeFi Engineer", exp: "6 Yrs", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" }
              ].map((mentor, i) => (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.1 }} key={i} className="group relative bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden p-6 hover:bg-[#0f172a] transition-colors cursor-pointer">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
                    <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent opacity-80" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"><FiGithub /></div>
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"><FiTwitter /></div>
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"><FiLinkedin /></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 text-center">{mentor.name}</h3>
                  <p className="text-sm text-primary text-center font-medium mb-4">{mentor.role}</p>
                  <div className="flex justify-center border-t border-white/5 pt-4">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{mentor.exp} Web3 Experience</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 10: PREMIUM CTA
        ========================================= */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-purple-500/20 opacity-30" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Your Blockchain <br/> Journey Starts Here.</h2>
            <p className="text-xl text-slate-300 mb-12">Join thousands of learners building the future of the decentralized web.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/courses')}
                className="px-10 py-5 bg-white text-[#050810] text-lg font-extrabold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto"
              >
                Start Learning Now
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-10 py-5 bg-[#050810] border border-white/20 text-white text-lg font-extrabold rounded-2xl hover:bg-white/5 transition-all w-full sm:w-auto"
              >
                Book Consultation
              </button>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
