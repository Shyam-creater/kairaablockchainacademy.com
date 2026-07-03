import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        key="simple-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050810] font-poppins"
      >
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Minimalist Spinner */}
          <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
            {/* Spinning Outer Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary border-opacity-80"
            />
            {/* Inner Pulsing Ring */}
            <motion.div 
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 rounded-full border border-primary/20"
            />
            {/* Center Logo */}
            <div className="text-2xl font-extrabold text-white select-none">
              K
            </div>
          </div>

          {/* Clean Text */}
          <div className="text-center">
            <h1 className="text-sm font-bold text-white tracking-[0.2em] uppercase mb-2">
              Kairaa Academy
            </h1>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[10px] text-slate-500 tracking-widest uppercase"
            >
              Loading...
            </motion.p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Loader;
