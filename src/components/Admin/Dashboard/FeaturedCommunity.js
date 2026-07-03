import React from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiMessageCircle, FiDollarSign } from 'react-icons/fi';

const FeaturedCommunity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/20 rounded-full blur-[60px] pointer-events-none"></div>

      <h3 className="text-lg font-semibold text-white mb-6 relative z-10 w-full text-left">Featured Community</h3>

      {/* Main Circular Graphic (Simulating the 3D 'A' logo from the mockup) */}
      <div className="relative w-40 h-40 mb-8 z-10 flex items-center justify-center">
        {/* Outer rings */}
        <div className="absolute inset-0 border-[6px] border-accent/20 rounded-full border-t-accent animate-spin-slow" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-2 border-[6px] border-primary/20 rounded-full border-b-primary animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 border-[6px] border-secondary/20 rounded-full border-l-secondary animate-spin-slow" style={{ animationDuration: '10s' }}></div>
        
        {/* Center Logo Area */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)] flex items-center justify-center border border-slate-600">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-md">A</span>
        </div>
      </div>

      {/* Stats List */}
      <div className="w-full space-y-3 z-10">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
          <div>
            <p className="text-lg font-bold text-white leading-none">$17,045</p>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Subscriptions</p>
          </div>
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <FiPlayCircle size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
          <div>
            <p className="text-lg font-bold text-white leading-none">$92,342</p>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Messages</p>
          </div>
          <div className="p-2 bg-accent/20 rounded-lg text-accent">
            <FiMessageCircle size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
          <div>
            <p className="text-lg font-bold text-white leading-none">$5,463</p>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Tips</p>
          </div>
          <div className="p-2 bg-success/20 rounded-lg text-success">
            <FiDollarSign size={20} />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-info text-white font-bold text-lg shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group flex items-center justify-center gap-3">
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
        <span className="text-2xl group-hover:animate-bounce">🚀</span> Join Our Community
      </button>

    </motion.div>
  );
};

export default FeaturedCommunity;
