import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Loader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-8">

        <div className="relative w-16 h-16">
          {/* Outer ping ring */}
          <div className="absolute inset-0 border-[1px] border-primary-200 rounded-lg transform rotate-45 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30"></div>

          {/* Mid pulse ring */}
          <div className="absolute inset-2 border-[1px] border-[#1C1678]/30 rounded-lg transform rotate-45 animate-pulse"></div>

          {/* Spinning inner ring */}
          <div className="absolute inset-4 border-2 border-primary-500 rounded-md transform rotate-45 animate-[spin_4s_linear_infinite]"></div>

          {/* Inner core dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#1C1678] rounded-full animate-bounce shadow-[0_0_10px_rgba(28,22,120,0.8)]"></div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-xs font-bold tracking-[0.3em] text-[#1C1678] uppercase animate-pulse">
            Loading
          </div>
          <div className="text-[10px] text-neutral-400 tracking-widest uppercase">
            Please wait...
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

export default Loader;
