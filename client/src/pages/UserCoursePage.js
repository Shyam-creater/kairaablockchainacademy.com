import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useGetUserAllCoursesQuery } from "../redux/features/courses/coursesApi";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Footer from "../components/Footer";
import Loader from "../components/Loader/Loader";
import { FiCheckCircle, FiClock, FiUsers, FiAward, FiCalendar, FiArrowRight, FiShield, FiStar, FiCode, FiBriefcase, FiHeart, FiShare2, FiEye, FiVideo, FiFileText, FiCheck } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";
import topCourseImg from "../assets/topcourseBlockchain.jpg";

const UserCoursePage = ({ defaultCategory }) => {
  const { isLoading, data } = useGetUserAllCoursesQuery({});
  const [course, setCourse] = useState([]);
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultCategory || "All");
  
  useEffect(() => {
    if (defaultCategory) {
      setActiveTab(defaultCategory);
    }
  }, [defaultCategory]);
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (data) {
      setCourse(data.courses);
    }
  }, [data]);

  // Dynamically extract unique categories and normalize them
  const rawCategories = course.map(c => c.categories || c.category || "Fundamentals").filter(Boolean);
  
  // Create a normalized list of categories for the tabs
  const formattedCategories = ["All", ...new Set(rawCategories.map(cat => {
    const lower = cat.toLowerCase();
    if (lower === "blockchain") return "Blockchain";
    if (lower === "other") return "Specializations";
    if (lower === "general") return "Fundamentals";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }))];

  // Helper to normalize the active tab for comparison
  const getNormalizedTab = (tab) => {
    const lower = tab.toLowerCase();
    if (lower === "blockchain") return "blockchain";
    if (lower === "other" || lower === "specializations") return "specializations";
    if (lower === "general" || lower === "fundamentals") return "fundamentals";
    return lower;
  };

  const normalizedActiveTab = getNormalizedTab(activeTab);

  const filteredCourses = activeTab === "All" 
    ? course 
    : course.filter(c => {
        const cat = getNormalizedTab(c.categories || c.category || "Fundamentals");
        // Match normalized category or check tags
        return cat === normalizedActiveTab || (c.tags && c.tags.some(tag => getNormalizedTab(tag) === normalizedActiveTab));
      });

  const faqs = [
    { q: "Do I need prior coding experience?", a: "For our beginner bootcamps, no prior experience is required. For advanced tracks like Smart Contract Auditing, basic programming knowledge is recommended." },
    { q: "Are the classes recorded?", a: "Yes, all live instructor-led sessions are recorded and made available in your learning dashboard for lifetime access." },
    { q: "Is there job placement assistance?", a: "Absolutely. Graduates of our career tracks get access to our dedicated placement cell, mock interviews, and direct referrals to our 50+ hiring partners." }
  ];

  const flagshipCourse = course.find(c => (c.name || "").toLowerCase().includes("certified blockchain architect") || (c.name || "").toLowerCase().includes("blockchain")) || course[0];

  return (
    <div className="overflow-x-hidden min-h-screen font-poppins text-slate-300 bg-[#050810] selection:bg-primary/30">
      <Heading
        title="Career Acceleration Platform | Kairaa Academy"
        description="Premium instructor-led Web3 bootcamps and career tracks."
        keywords="blockchain bootcamp, web3 career, live coding classes"
      />
      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />

      <main>
        {/* 1. PREMIUM HERO SECTION */}
        <section className="relative pt-32 pb-32 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          
          {/* Animated Background Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,254,0.8)] pointer-events-none"
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

          <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Admissions Open For Fall 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
            >
              Accelerate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Web3 Career.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12"
            >
              Master blockchain engineering through immersive, live instructor-led bootcamps. Build a stunning portfolio and get hired by top tier companies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 md:gap-12"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">94%</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Placement Rate</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">50+</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Hiring Partners</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">1:1</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Expert Mentorship</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. FEATURED FLAGSHIP PROGRAM */}
        <section className="py-12 border-b border-white/5 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-gradient-to-br from-[#0B1120] to-[#050810] border border-primary/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.05)] flex flex-col lg:flex-row relative">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-primary text-[#050810] text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-bl-xl z-20">
                Flagship Program
              </div>
              
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10">
                {flagshipCourse ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <FiShield className="text-primary" size={24} />
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">{flagshipCourse.category || "Flagship Program"}</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">{flagshipCourse.name || "Master Smart Contracts & Protocol Design"}</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                      {flagshipCourse.subtitle || flagshipCourse.description || "Our most comprehensive 6-month intensive. Go from basics to auditing enterprise-grade smart contracts. Includes 5 production-ready capstone projects."}
                    </p>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="flex items-start gap-3">
                        <FiClock className="text-accent mt-1" />
                        <div>
                          <p className="text-white font-bold text-sm">{flagshipCourse.totalDuration || flagshipCourse.duration || "6 Months"}</p>
                          <p className="text-xs text-slate-500">Duration</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiBriefcase className="text-accent mt-1" />
                        <div>
                          <p className="text-white font-bold text-sm">{flagshipCourse.projectsCount || 5}</p>
                          <p className="text-xs text-slate-500">Capstone Projects</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/courses/${flagshipCourse._id}`)}
                      className="w-fit px-8 py-4 bg-white text-[#050810] font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      Secure Your Seat
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <FiShield className="text-primary" size={24} />
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Certified Blockchain Architect</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">Master Smart Contracts & Protocol Design</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                      Our most comprehensive 6-month intensive. Go from basics to auditing enterprise-grade smart contracts. Includes 5 production-ready capstone projects.
                    </p>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="flex items-start gap-3">
                        <FiClock className="text-accent mt-1" />
                        <div>
                          <p className="text-white font-bold text-sm">6 Months</p>
                          <p className="text-xs text-slate-500">Live Weekends</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-accent mt-1" />
                        <div>
                          <p className="text-white font-bold text-sm">Oct 15, 2026</p>
                          <p className="text-xs text-slate-500">Next Cohort</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate("/course-registration")}
                      className="w-fit px-8 py-4 bg-white text-[#050810] font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      Secure Your Seat
                    </button>
                  </>
                )}
              </motion.div>
              
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="w-full lg:w-1/2 relative min-h-[400px]">
                <img 
                  src={flagshipCourse?.thumbnail?.url || topCourseImg} 
                  alt="Flagship Bootcamp" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/60 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. DISCOVERY GRID WITH SMART FILTERS */}
        <section className="py-16 border-b border-white/5 bg-[#0B1120]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Explore Career Tracks</h2>
                <p className="text-slate-400">Find the perfect specialized program for your goals.</p>
              </motion.div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {formattedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      getNormalizedTab(activeTab) === getNormalizedTab(cat)
                        ? 'bg-white text-[#050810]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><Loader /></div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((c, idx) => {
                  const discount = c.estimatedPrice && c.price < c.estimatedPrice 
                    ? Math.round(((c.estimatedPrice - c.price) / c.estimatedPrice) * 100)
                    : 0;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ amount: 0.2 }} 
                      transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                      key={c._id || idx}
                      onClick={() => navigate(`/courses/${c._id}`)}
                      className="group flex flex-col bg-[#0B1120] border border-white/5 rounded-[20px] overflow-hidden hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer relative"
                    >
                      {/* 1. Hero Image */}
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        <img 
                          src={c.thumbnail?.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"} 
                          alt={c.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent" />
                        
                        {/* Top-left Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          {c.bestseller && <span className="bg-yellow-500/90 backdrop-blur text-black px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shadow-lg">Bestseller</span>}
                          {c.newCourseBadge && <span className="bg-primary/90 backdrop-blur text-black px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shadow-lg">New</span>}
                        </div>

                        {/* Top-right Actions */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button 
                            className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors group/btn" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const url = `${window.location.origin}/courses/${c._id}`;
                              navigator.clipboard.writeText(url);
                              toast.success("Link copied to clipboard!");
                            }}
                          >
                            <FiShare2 size={12} className="group-hover/btn:text-blue-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        {/* 2. Information Header */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wider">
                          <span>{c.category || "Technology"}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span>{c.level || "Beginner"}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{c.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-3">{c.subtitle || c.description}</p>
                        
                        <div className="mb-4">
                          <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold border border-primary/20">
                            {c.careerPaths?.length > 0 ? "Job Ready" : "Most Popular"}
                          </span>
                        </div>
                        
                        {/* 3. Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-5 mt-auto">
                          <div className="flex items-center gap-2 text-xs text-slate-300 group/stat">
                            <FiVideo className="text-slate-500 group-hover/stat:text-primary transition-colors group-hover/stat:scale-110" />
                            <span>{c.lessonsCount || c.courseContentData?.length || 0} Lessons</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-300 group/stat">
                            <FiClock className="text-slate-500 group-hover/stat:text-primary transition-colors group-hover/stat:scale-110" />
                            <span>{c.totalDuration || c.duration || "Self Paced"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-300 group/stat">
                            <FiBriefcase className="text-slate-500 group-hover/stat:text-primary transition-colors group-hover/stat:scale-110" />
                            <span>{c.projectsCount || 0} Projects</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-300 group/stat">
                            <FiStar className="text-slate-500 group-hover/stat:text-primary transition-colors group-hover/stat:scale-110" />
                            <span>{c.averageRating || c.ratings || 0} Rating</span>
                          </div>
                        </div>

                        {/* 4. Skills Section */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {(c.tags && c.tags.length > 0 ? c.tags : ["React", "Node.js", "Web3"]).slice(0, 4).map((skill, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded text-[10px] hover:bg-white/10 transition-colors">
                              {skill}
                            </span>
                          ))}
                          {c.tags && c.tags.length > 4 && (
                            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                              +{c.tags.length - 4} More
                            </span>
                          )}
                        </div>

                        {/* 5. Instructor Section */}
                        <div className="flex items-center justify-between py-3 border-y border-white/5 mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-[10px] text-white bg-gradient-to-br from-primary to-accent shadow-sm group-hover:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-shadow">
                              {c.instructorId?.name ? c.instructorId.name.charAt(0) : "K"}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-slate-200">{c.instructorId?.name || "Kairaa Academy"}</span>
                                <MdVerified className="text-primary text-[10px]" />
                              </div>
                              <span className="text-[9px] text-slate-500">8+ Years Experience</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">{c.language || "English"}</span>
                            <span className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">Certificate</span>
                          </div>
                        </div>

                        {/* 6. Bottom Pricing Section */}
                        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><FiCheck className="text-primary" /> Certificate</span>
                          <span className="flex items-center gap-1"><FiCheck className="text-primary" /> Lifetime Access</span>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            {c.estimatedPrice && (
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="line-through text-slate-500 text-[11px] whitespace-nowrap">₹&nbsp;{c.estimatedPrice}</span>
                                {discount > 0 && <span className="bg-green-500/20 text-green-400 px-1 py-0.5 rounded text-[8px] font-extrabold uppercase">{discount}% OFF</span>}
                              </div>
                            )}
                            <span className="text-xl font-extrabold text-white leading-none whitespace-nowrap">{c.price === 0 ? "Free" : `₹\u00A0${c.price}`}</span>
                          </div>
                          
                          <button className="bg-white text-black px-4 py-2 rounded-xl font-bold text-[11px] flex items-center gap-1.5 group/btn hover:bg-slate-200 transition-colors">
                            View Course 
                            <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-slate-400 text-lg">No programs found for this track.</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. CAREER OUTCOME ROADMAP */}
        <section className="py-20 border-b border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Your Transformation Journey</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">A proven pathway from enrollment to landing your dream job in Web3.</p>
            </motion.div>

            <div className="relative">
              {/* Line connector */}
              <div className="absolute left-[28px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent opacity-20" />
              
              {[
                { step: "01", title: "Immersive Learning", desc: "Master core concepts through live, interactive sessions with industry experts.", icon: <FiStar /> },
                { step: "02", title: "Build Portfolio", desc: "Develop 5+ production-ready dApps and smart contracts to showcase your skills.", icon: <FiCode /> },
                { step: "03", title: "Certification", desc: "Pass the rigorous final audit to earn your verified blockchain credential.", icon: <FiAward /> },
                { step: "04", title: "Career Placement", desc: "Interview with our 50+ hiring partners and land a high-paying Web3 role.", icon: <FiBriefcase /> },
              ].map((item, idx) => (
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-1/2 flex justify-start md:justify-end">
                    <div className={`w-full md:w-[80%] bg-[#0B1120] border border-white/10 p-8 rounded-3xl relative ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-24 md:pl-8 hover:border-primary transition-colors cursor-pointer group`}>
                      <span className="text-primary text-sm font-bold mb-2 block">Phase {item.step}</span>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 bg-[#050810] border-4 border-primary rounded-full flex items-center justify-center text-white z-10 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
                    {item.icon}
                  </div>
                  
                  <div className="w-full md:w-1/2 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="py-16 overflow-hidden">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, type: "spring", bounce: 0.4 }} className="text-center bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
              <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10">Ready to accelerate your career?</h3>
              <p className="text-slate-400 mb-8 relative z-10">Join the next cohort and start building the future of the internet.</p>
              <button 
                onClick={() => navigate("/contact")}
                className="relative z-10 px-8 py-4 bg-primary text-[#050810] font-extrabold rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,242,254,0.4)]"
              >
                Talk to an Advisor
              </button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default UserCoursePage;

