import React, { useState } from "react";
import { Toaster, toast, resolveValue } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiClock } from "react-icons/fi";

const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <FiCheckCircle className="text-emerald-500 w-5 h-5" />;
    case "error":
      return <FiAlertCircle className="text-rose-500 w-5 h-5" />;
    case "loading":
      return (
        <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
      );
    default:
      return <FiInfo className="text-blue-500 w-5 h-5" />;
  }
};

const getToastStyles = (type) => {
  switch (type) {
    case "success":
      return { borderLeftColor: "rgba(16, 185, 129, 0.8)", glow: "rgba(16, 185, 129, 0.15)" };
    case "error":
      return { borderLeftColor: "rgba(244, 63, 94, 0.8)", glow: "rgba(244, 63, 94, 0.15)" };
    default:
      return { borderLeftColor: "rgba(255, 255, 255, 0.2)", glow: "rgba(255, 255, 255, 0.05)" };
  }
};

const CustomToast = ({ t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = getToastStyles(t.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100 || info.offset.x < -100) {
          toast.dismiss(t.id);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col w-[350px] bg-[#0A0A0A]/70 backdrop-blur-2xl rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/10 pointer-events-auto"
      style={{
        boxShadow: `0 8px 30px rgba(0,0,0,0.4), inset 4px 0 0 ${styles.borderLeftColor}`,
      }}
    >
      {/* Subtle Glow Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 0% 50%, ${styles.glow}, transparent 50%)` }}
      />

      <div className="flex items-start p-4 gap-3 relative z-10">
        <div className="shrink-0 mt-0.5">
          <ToastIcon type={t.type} />
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/90">
              {t.type === "success" ? "Success" : t.type === "error" ? "Error" : "Notification"}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-medium text-white/40">
                <FiClock size={10} /> Just now
              </span>
              <button 
                onClick={() => toast.dismiss(t.id)}
                className="text-white/40 hover:text-white/80 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1"
              >
                <FiX size={12} />
              </button>
            </div>
          </div>
          <div className="text-[13px] text-white/70 leading-relaxed font-medium font-sans">
            {resolveValue(t.message, t)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-[3px] w-full bg-white/5 relative z-10">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ 
            duration: isHovered ? 0 : (t.duration || 4000) / 1000, 
            ease: "linear" 
          }}
          className="h-full"
          style={{ backgroundColor: styles.borderLeftColor }}
        />
      </div>
    </motion.div>
  );
};

export const PremiumToaster = () => {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 4000,
      }}
    >
      {(t) => (
        <AnimatePresence>
          {t.visible && <CustomToast t={t} />}
        </AnimatePresence>
      )}
    </Toaster>
  );
};
