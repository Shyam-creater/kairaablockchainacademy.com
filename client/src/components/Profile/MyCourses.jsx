import React, { useState } from "react";
import CourseCard from "../Course/CourseCard";
import { GlassPanel, NeonButton } from "../ui/NeonUI";
import { FiGrid, FiList, FiMap, FiSearch, FiFilter, FiPlayCircle, FiClock, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MyCourses = ({ courses }) => {
  const [view, setView] = useState("grid"); // grid, list, roadmap
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Mock Overall Stats
  const totalCourses = courses?.length || 0;
  const inProgress = Math.floor(totalCourses * 0.7) || 0;
  const completed = totalCourses - inProgress || 0;

  const filteredCourses = courses?.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      {/* 1. Learning Journey Dashboard Stats */}
      <GlassPanel glow="border-t-2 border-t-primary" className="p-6 relative overflow-hidden">
         <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
         <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
            <div>
               <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 flex items-center gap-3">
                 <span className="bg-primary/20 p-2 rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                   <FiPlayCircle className="text-primary text-2xl" />
                 </span>
                 My Learning Hub
               </h2>
               <p className="text-slate-400">Track, resume, and accelerate your learning journey.</p>
            </div>
            
            <div className="flex items-center gap-6 bg-[#0B0F19]/80 p-4 rounded-2xl border border-white/10 shadow-inner">
               <div className="text-center px-4 border-r border-white/10">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Enrolled</p>
                  <p className="text-2xl font-black text-white">{totalCourses}</p>
               </div>
               <div className="text-center px-4 border-r border-white/10">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">In Progress</p>
                  <p className="text-2xl font-black text-primary">{inProgress}</p>
               </div>
               <div className="text-center px-4">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-2xl font-black text-[#00e676]">{completed}</p>
               </div>
            </div>
         </div>
      </GlassPanel>

      {/* 2. Smart Command Bar & View Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0B0F19] p-2 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] sticky top-20 z-40">
         <div className="flex items-center gap-2 w-full md:w-auto bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-primary/50 transition-colors flex-1 md:max-w-md">
            <FiSearch className="text-slate-400" />
            <input 
               type="text" 
               placeholder="Search enrolled courses..." 
               className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-slate-500"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/30">
               <FiFilter /> <span className="hidden sm:inline">Filter</span>
            </button>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
               <button 
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-primary text-[#0B0F19] shadow-[0_0_10px_rgba(0,242,254,0.5)]" : "text-slate-400 hover:text-white"}`}
                  title="Grid View"
               ><FiGrid /></button>
               <button 
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-primary text-[#0B0F19] shadow-[0_0_10px_rgba(0,242,254,0.5)]" : "text-slate-400 hover:text-white"}`}
                  title="List View"
               ><FiList /></button>
               <button 
                  onClick={() => setView("roadmap")}
                  className={`p-2 rounded-lg transition-all ${view === "roadmap" ? "bg-primary text-[#0B0F19] shadow-[0_0_10px_rgba(0,242,254,0.5)]" : "text-slate-400 hover:text-white"}`}
                  title="Roadmap View"
               ><FiMap /></button>
            </div>
         </div>
      </div>

      {/* 3. Dynamic Course Views */}
      <AnimatePresence mode="wait">
        {filteredCourses && filteredCourses.length > 0 ? (
          
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {/* GRID VIEW */}
             {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((item, index) => (
                    <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                      <CourseCard item={item} isProfile={true} />
                    </div>
                  ))}
                </div>
             )}

             {/* LIST VIEW */}
             {view === "list" && (
                <div className="flex flex-col gap-4">
                  {filteredCourses.map((item, index) => (
                    <GlassPanel key={index} className="p-4 flex flex-col sm:flex-row items-center gap-6 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate(`/profile/course-access/${item._id}`)}>
                       <img 
                          src={item.thumbnail?.url || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} 
                          alt="Thumbnail" 
                          className="w-full sm:w-48 h-28 object-cover rounded-xl border border-white/10 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-shadow"
                       />
                       <div className="flex-1 w-full">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-6 mb-4">
                             <span className="text-xs text-slate-400 flex items-center gap-1"><FiClock /> Last accessed 2 days ago</span>
                             <span className="text-xs text-slate-400 flex items-center gap-1"><FiPlayCircle /> {item.courseData?.length || 0} Lessons</span>
                          </div>
                          <div className="flex items-center gap-4 w-full">
                             <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full shadow-[0_0_10px_rgba(0,242,254,0.8)]" style={{ width: "45%" }}></div>
                             </div>
                             <span className="text-xs font-bold text-white">45%</span>
                          </div>
                       </div>
                       <NeonButton variant="ghost" className="w-full sm:w-auto py-3 px-6 shrink-0" onClick={(e) => { e.stopPropagation(); navigate(`/profile/course-access/${item._id}`); }}>
                          Resume
                       </NeonButton>
                    </GlassPanel>
                  ))}
                </div>
             )}

             {/* ROADMAP VIEW */}
             {view === "roadmap" && (
                <div className="relative py-8 pl-8 md:pl-0">
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full"></div>
                  <div className="md:hidden absolute left-4 top-0 bottom-0 w-1 bg-white/10 rounded-full"></div>
                  
                  <div className="space-y-12">
                     {filteredCourses.map((item, index) => {
                        const isEven = index % 2 === 0;
                        const status = index === 0 ? "completed" : index === 1 ? "active" : "locked";
                        
                        return (
                           <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                              {/* Central Node */}
                              <div className="absolute left-[-16px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#0B0F19] z-10 flex items-center justify-center
                                 ${status === 'completed' ? 'bg-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.8)]' : 
                                   status === 'active' ? 'bg-primary shadow-[0_0_15px_rgba(0,242,254,0.8)]' : 'bg-slate-700'}">
                                 {status === 'completed' && <FiCheckCircle className="text-[#0B0F19]" />}
                                 {status === 'active' && <div className="w-2 h-2 bg-[#0B0F19] rounded-full animate-ping"></div>}
                              </div>

                              {/* Content Card */}
                              <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                                 <GlassPanel className={`p-6 hover:border-primary/50 transition-colors cursor-pointer ${status === 'active' ? 'border-primary/50 shadow-[0_0_20px_rgba(0,242,254,0.15)]' : ''}`} onClick={() => navigate(`/profile/course-access/${item._id}`)}>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 inline-block px-2 py-1 rounded-md border
                                       ${status === 'completed' ? 'text-[#00e676] bg-[#00e676]/10 border-[#00e676]/30' : 
                                         status === 'active' ? 'text-primary bg-primary/10 border-primary/30' : 'text-slate-500 bg-white/5 border-white/10'}`}>
                                       {status === 'completed' ? 'Completed' : status === 'active' ? 'In Progress' : 'Up Next'}
                                    </span>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                                 </GlassPanel>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                </div>
             )}

          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-[#0B0F19] rounded-2xl border border-white/10 shadow-inner"
          >
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 relative">
               <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20"></div>
               <FiSearch className="text-4xl text-slate-500" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
             <p className="text-slate-400 max-w-md text-center mb-8">
               We couldn't find any courses matching your search. Try clearing your filters or explore the course catalog.
             </p>
             <NeonButton onClick={() => setSearchQuery("")} variant="primary" className="px-8 py-3">
               Clear Search
             </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCourses;
