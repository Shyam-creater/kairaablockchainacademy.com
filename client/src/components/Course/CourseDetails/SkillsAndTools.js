import React from 'react';
import { motion } from 'framer-motion';
import { FiCode } from 'react-icons/fi';

const SkillsAndTools = ({ data }) => {
  if (!data?.toolsCovered || data.toolsCovered.length === 0) return null;

  return (
    <div className="pt-16">
      <h2 className="text-3xl font-extrabold text-white mb-8">Tech Stack Covered</h2>
      <div className="flex flex-wrap gap-6">
        {data.toolsCovered.map((tool, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="group w-24 h-24 bg-[#050810] border-2 border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-300 shadow-xl hover:border-primary hover:text-primary transition-colors duration-300 relative cursor-default"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" />
            
            <div className="relative z-10 mb-2">
              {tool.logo ? (
                <img src={tool.logo} alt={tool.name || tool} className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all" />
              ) : (
                <FiCode className="w-8 h-8" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider relative z-10 text-center px-1">
              {tool.name || tool}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsAndTools;
