import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare } from 'react-icons/fi';

const Prerequisites = ({ data }) => {
  if (!data?.prerequisites || data.prerequisites.length === 0) return null;

  return (
    <div className="pt-16">
      <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} className="text-3xl font-extrabold text-white mb-6">Prerequisites</motion.h2>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} className="bg-[#050810] border border-white/10 rounded-3xl p-8">
        <ul className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
          {data.prerequisites.map((p, i) => (
            <li key={i} className="flex items-start gap-4 text-slate-300 text-sm group">
              <div className="w-6 h-6 rounded bg-accent/10 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-[#050810] transition-colors">
                <FiCheckSquare size={14} />
              </div>
              <span className="leading-relaxed group-hover:text-white transition-colors">{p.title}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Prerequisites;
