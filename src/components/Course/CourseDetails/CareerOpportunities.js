import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiTrendingUp } from 'react-icons/fi';

const CareerOpportunities = ({ data }) => {
  if (!data?.careerPaths || data.careerPaths.length === 0) return null;

  return (
    <div className="pt-16">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Career Outcomes</h2>
        <p className="text-slate-400">The roles you'll be prepared for after graduation.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {data.careerPaths.map((career, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="group relative bg-[#050810] border border-white/10 rounded-3xl p-8 overflow-hidden cursor-default"
          >
            {/* Background Image / Blur */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent z-0" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors z-0" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                <FiBriefcase size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{career.title}</h3>
              
              {career.expectedSalary && (
                <div className="inline-flex items-center gap-2 text-accent font-mono text-sm bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl">
                  <FiTrendingUp /> Avg. Salary: {career.expectedSalary}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerOpportunities;
