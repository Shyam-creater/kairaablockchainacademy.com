import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const LearningOutcomes = ({ data }) => {
  const outcomes = data?.benefits || data?.learningOutcomes || [];

  if (!outcomes || outcomes.length === 0) return null;

  return (
    <div className="pt-16">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">Master Future Skills</h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outcomes.map((outcome, idx) => {
          // Make the first item span 2 columns if there's enough items to create a bento effect
          const isLarge = idx === 0 && outcomes.length > 2;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`bg-[#050810] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/5 transition-colors cursor-default ${isLarge ? 'md:col-span-2' : ''}`}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <FiCheckCircle className="text-primary mb-6" size={32} />
                <h3 className={`font-bold text-white group-hover:text-primary transition-colors ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {outcome.title}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningOutcomes;
