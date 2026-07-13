import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiGlobe, FiAward, FiCode, FiDatabase, FiCpu, FiMonitor } from 'react-icons/fi';

const HeroSection = ({ data }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
      {/* Background Video/Grid */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay loop muted playsInline 
          className="w-full h-full object-cover opacity-20"
        >
          <source src="https://media.istockphoto.com/id/2197107553/video/futuristic-network-workflow-and-data-connection-diagram.mp4?s=mp4-640x640-is&k=20&c=z4xV3yVLPOglXKBsr0-o38_4JUY6lV4fUxsmkTK9VKY=" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/40 via-transparent to-[#050810]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-transparent to-[#050810]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center mt-20">
        
        {/* Animated Rising Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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
            { icon: <FiCode size={24} />, top: "15%", left: "10%", delay: 0 },
            { icon: <FiDatabase size={24} />, top: "70%", left: "5%", delay: 1 },
            { icon: <FiCpu size={24} />, top: "25%", right: "10%", delay: 2 },
            { icon: <FiMonitor size={24} />, top: "65%", right: "8%", delay: 0.5 },
          ].map((node, idx) => (
            <motion.div
              key={idx}
              animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6 + idx, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
              className="absolute text-primary bg-[#050810]/80 p-4 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(0,242,254,0.3)] backdrop-blur-md"
              style={{ top: node.top, left: node.left, right: node.right }}
            >
              {node.icon}
            </motion.div>
          ))}
        </div>

        {/* The Glass Terminal Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-full max-w-4xl relative group z-20"
        >
          {/* Glowing Aura Behind Terminal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-purple-500 rounded-3xl blur-2xl opacity-20 transition duration-1000" />
          
          <div className="relative bg-[#050810]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,242,254,0.1)] overflow-hidden text-left">
            
            {/* Top Window Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-[10px] font-mono text-slate-500">root@kairaa:~# load_module --course="{data?.name || 'course'}"</span>
            </div>

            <div className="pt-8">
              <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                <span className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{data?.category || 'General'}</span>
                {data?.bestseller && <span className="px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">Bestseller</span>}
                {data?.newCourseBadge && <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">New Arrival</span>}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-xl">
                {data?.name}
              </h1>
              
              <p className="text-lg text-slate-300 mb-10 max-w-2xl font-medium leading-relaxed">
                {data?.subtitle || data?.description?.substring(0, 150)}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-sm font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex text-accent">
                    <FiStar className="fill-accent" />
                    <FiStar className="fill-accent" />
                    <FiStar className="fill-accent" />
                    <FiStar className="fill-accent" />
                    <FiStar className="fill-accent" />
                  </div>
                  <span className="text-white font-bold">{data?.averageRating || 4.9}</span> 
                  <span>({data?.totalEnrollments || 0} students)</span>
                </div>
                <div className="flex items-center gap-2"><FiClock className="text-primary" /> {data?.duration || '10 Hours'}</div>
                <div className="flex items-center gap-2"><FiGlobe className="text-blue-500" /> {data?.language || 'English'}</div>
                <div className="flex items-center gap-2"><FiAward className="text-purple-400" /> {data?.level || 'All Levels'}</div>
              </div>
            </div>

            {/* Decorative background dashed circles */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -bottom-32 -right-32 w-80 h-80 border border-white/5 rounded-full border-dashed opacity-30 pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
