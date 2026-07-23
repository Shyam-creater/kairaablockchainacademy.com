import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVideo, FiFileText, FiGlobe, FiAward, FiHeart, FiShare2, FiSmartphone, FiWifiOff, FiLock } from 'react-icons/fi';

const SidebarPurchaseCard = ({ data, isPurchased, paymentHandler, handleEnrollFree }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-[#050810]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,242,254,0.1)] relative"
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-purple-500" />

      {data?.thumbnail?.url ? (
        <div className="w-full aspect-video relative group overflow-hidden">
          <img src={data.thumbnail.url} alt="Course Thumbnail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[#050810]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(0,242,254,0.5)]">
              <FiVideo size={24} className="text-white ml-1" />
            </div>
          </div>
          
          {/* Animated "LIVE" / "PREMIUM" Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#050810]/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"/> Premium
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video bg-[#0B1120] flex items-center justify-center border-b border-white/5">
           <FiVideo size={48} className="text-white/10" />
        </div>
      )}
      
      <div className="p-8 space-y-8">
        <div className="flex items-end gap-3 mb-6">
          <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight whitespace-nowrap">₹&nbsp;{data?.price === 0 ? 'Free' : data?.price}</span>
          {data?.estimatedPrice > data?.price && (
            <span className="text-lg text-slate-500 line-through mb-1.5 font-medium whitespace-nowrap">₹&nbsp;{data.estimatedPrice}</span>
          )}
          {data?.discountPercentage && (
            <span className="text-xs font-bold text-[#050810] bg-accent px-2 py-1 rounded mb-2 ml-2">SAVE {data.discountPercentage}%</span>
          )}
        </div>

        <button onClick={data?.price === 0 ? handleEnrollFree : paymentHandler} className="w-full py-5 rounded-2xl bg-white text-[#050810] font-extrabold text-lg hover:bg-primary transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,254,0.4)] flex items-center justify-center gap-2">
          {data?.price === 0 ? 'Initialize Free Access' : 'Initialize Enrollment'}
        </button>

        <div className="flex items-center gap-4">
          <button className="flex-1 py-3 flex justify-center items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/10">
            <FiHeart className="text-accent" /> Wishlist
          </button>
          <button className="flex-1 py-3 flex justify-center items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/10">
            <FiShare2 className="text-primary" /> Share
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5 text-sm text-slate-300 font-medium">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Included in Package</h4>
          
          {data?.duration && (
            <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary"><FiVideo /></div> {data.duration} on-demand video</div>
          )}
          {(data?.assignmentCount > 0 || data?.projectsCount > 0) && (
            <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent"><FiFileText /></div> {data.assignmentCount + (data.projectsCount || 0)} assignments & projects</div>
          )}
          {data?.lifetimeAccess && (
            <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400"><FiGlobe /></div> Full lifetime access</div>
          )}
          {(data?.mobileAccess || data?.desktopAccess) && (
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400"><FiSmartphone /></div> Access on multiple devices
             </div>
          )}
          {data?.offlineAccess && (
             <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-yellow-400"><FiWifiOff /></div> Offline download capability</div>
          )}
          {data?.certificate?.enabled && (
            <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-pink-400"><FiAward /></div> Verified Certificate</div>
          )}
          
          <div className="flex items-center gap-4 pt-2"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><FiLock /></div> Secure Checkout (256-bit SSL)</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarPurchaseCard;
