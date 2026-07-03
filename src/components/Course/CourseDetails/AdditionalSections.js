import React from 'react';
import { motion } from 'framer-motion';

export const FooterCTA = ({ data, paymentHandler, handleEnrollFree }) => {
  return (
    <div className="mt-32 mb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-purple-500/10 opacity-50 rounded-[3rem]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }} 
        whileInView={{ opacity: 1, scale: 1, y: 0 }} 
        viewport={{ amount: 0.3 }} 
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} 
        className="relative z-10 p-12 md:p-20 text-center rounded-[3rem] border border-white/5 bg-[#050810]/50 backdrop-blur-xl shadow-[0_0_100px_rgba(0,242,254,0.05)]"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">Deploy Your Future To <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white animate-gradient-x">The Mainnet.</span>
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Stop watching tutorials. Start shipping production-grade dApps, AI bots, and Full-Stack systems with Elite Web3 Engineers.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={data?.price === 0 ? handleEnrollFree : paymentHandler}
            className="px-12 py-5 bg-white text-[#050810] text-lg font-extrabold rounded-2xl hover:bg-primary transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,254,0.4)] w-full sm:w-auto hover:scale-105 duration-300"
          >
            {data?.price === 0 ? 'Initialize Free Access' : 'Initialize Enrollment'}
          </button>
        </div>
        {data?.refundPolicy && (
          <p className="text-primary text-sm pt-6 font-bold tracking-widest uppercase">✓ {data.refundPolicy}</p>
        )}
      </motion.div>
    </div>
  );
};
