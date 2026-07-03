import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiPlayCircle, FiFileText } from 'react-icons/fi';

const CourseRoadmap = ({ data }) => {
  const modules = data?.courseContentData || [];
  const [activeModule, setActiveModule] = useState(0);

  if (modules.length === 0) return null;

  return (
    <div className="pt-16 relative overflow-hidden">
      <div className="mb-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          The Success Roadmap
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg">
          A highly optimized pipeline designed for ultimate career acceleration.
        </motion.p>
      </div>
      
      <div className="relative pl-8 md:pl-12">
        {/* Animated Connector Line */}
        <motion.div 
          initial={{ height: 0 }} 
          whileInView={{ height: "100%" }} 
          viewport={{ amount: 0.1 }} 
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-0 left-[19px] md:left-[27px] w-1 bg-gradient-to-b from-primary via-accent to-purple-500 rounded-full z-0 origin-top" 
        />
        <div className="absolute top-0 bottom-0 left-[19px] md:left-[27px] w-1 bg-white/10 rounded-full z-[-1]" />

        <div className="space-y-6">
          {modules.map((mod, idx) => {
            const isActive = activeModule === idx;
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10"
              >
                {/* Node Dot */}
                <div className={`absolute -left-[45px] md:-left-[53px] top-6 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[#050810] border-primary shadow-[0_0_15px_rgba(0,242,254,0.6)]' : 'bg-[#050810] border-white/20'}`}>
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </div>

                <div className={`bg-[#050810] border ${isActive ? 'border-primary shadow-[0_0_30px_rgba(0,242,254,0.15)]' : 'border-white/10'} rounded-3xl overflow-hidden transition-all duration-300 hover:border-primary/50`}>
                  <button
                    onClick={() => setActiveModule(isActive ? null : idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                  >
                    <div>
                      <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">Step 0{idx + 1}</span>
                      <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {mod.videoSection || `Module ${idx + 1}`}
                      </h3>
                      <div className="flex gap-6 mt-3 text-sm text-slate-500 font-bold">
                        <span className="flex items-center gap-2"><FiPlayCircle /> {mod.links?.length || 1} Lessons</span>
                        {mod.duration && <span>• {mod.duration}</span>}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${isActive ? 'bg-primary border-primary text-[#050810]' : 'border-white/20 text-white'}`}>
                      <FiChevronDown size={20} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/5"
                      >
                        <div className="p-6 md:p-8 pt-0 border-t border-white/5 mt-4">
                          <div className="flex items-start gap-4 py-2 group cursor-pointer">
                             <div className="w-10 h-10 rounded-xl bg-[#050810] border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#050810] transition-all flex-shrink-0">
                                <FiPlayCircle size={18} />
                             </div>
                             <div>
                               <h4 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">{mod.title}</h4>
                               {mod.description && <p className="text-slate-400 text-sm leading-relaxed mb-4">{mod.description}</p>}
                               
                               {mod.links && mod.links.length > 0 && (
                                 <div className="flex flex-wrap gap-3">
                                   {mod.links.map((link, lIdx) => (
                                     <a key={lIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold bg-[#050810] px-3 py-1.5 rounded-full border border-white/10 text-slate-300 hover:border-accent hover:text-accent transition-colors">
                                       <FiFileText /> {link.title || 'Resource'}
                                     </a>
                                   ))}
                                 </div>
                               )}
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseRoadmap;
