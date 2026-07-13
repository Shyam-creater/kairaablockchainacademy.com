import React from 'react';
import { FiLock, FiAward } from 'react-icons/fi';
import logo from '../../carouselimages/Blockchain-Academy-Logo.png'; // Fallback logo

const CertificateTemplate = ({ 
  studentName = "STUDENT NAME", 
  courseName = "Full Stack Web Development",
  startDate = "28/1/2026",
  endDate = "5/6/2026",
  isLocked = false 
}) => {
  return (
    <div className="relative w-full aspect-[1.414] bg-white text-slate-900 rounded-sm overflow-hidden select-none border border-slate-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.01) 10px, rgba(0,0,0,0.01) 20px)' }}>
      
      {/* --- CORNER ACCENTS --- */}
      {/* Bottom Left Corner Bars */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] z-0 pointer-events-none origin-bottom-left">
        <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[150%] bg-[#60a5fa] -rotate-[35deg] shadow-lg transform origin-bottom-left"></div>
        <div className="absolute bottom-[-10%] left-[5%] w-[70%] h-[150%] bg-[#2563eb] -rotate-[35deg] shadow-lg transform origin-bottom-left"></div>
        <div className="absolute bottom-[0%] left-[-10%] w-[60%] h-[150%] bg-[#1e3a8a] -rotate-[35deg] shadow-lg transform origin-bottom-left"></div>
      </div>
      
      {/* Bottom Right Corner Bars */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] z-0 pointer-events-none origin-bottom-right">
        <div className="absolute bottom-[-20%] right-[20%] w-[80%] h-[150%] bg-[#60a5fa] rotate-[35deg] shadow-lg transform origin-bottom-right"></div>
        <div className="absolute bottom-[-10%] right-[5%] w-[70%] h-[150%] bg-[#2563eb] rotate-[35deg] shadow-lg transform origin-bottom-right"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[150%] bg-[#1e3a8a] rotate-[35deg] shadow-lg transform origin-bottom-right"></div>
      </div>

      {/* --- HEADER (Logo & Seal) --- */}
      <div className="absolute top-6 left-8 z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xl rounded-sm relative">
           <div className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-white border border-[#1e3a8a]"></div>
           <span className="relative z-10 font-black">X</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[#1e3a8a] font-black text-xl tracking-wide uppercase">KAIRAA</span>
          <span className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase">EDU TECH</span>
        </div>
      </div>

      <div className="absolute top-8 right-10 z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full shadow-lg border-2 border-yellow-200 flex items-center justify-center relative">
          <div className="absolute -bottom-4 left-[20%] w-3 h-8 bg-yellow-500 -rotate-12"></div>
          <div className="absolute -bottom-4 right-[20%] w-3 h-8 bg-yellow-500 rotate-12"></div>
          <div className="w-16 h-16 rounded-full border border-yellow-300/50" style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.05) 10deg 20deg)'}}></div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative w-full h-full flex flex-col items-center justify-center text-center z-10 pt-8 px-12">
        <div className="mb-8">
          <h1 className="text-[#0052cc] text-5xl md:text-[64px] font-black tracking-widest uppercase leading-none mb-2">CERTIFICATE</h1>
          <h2 className="text-[#0052cc] text-xl md:text-2xl font-bold tracking-[0.3em] uppercase">OF COMPLETION</h2>
        </div>

        <p className="text-slate-700 font-bold text-sm md:text-base mb-4 tracking-wide">This certificate is proudly presented to</p>
        
        <h3 className="text-black text-4xl md:text-[52px] font-black uppercase tracking-tight mb-2 leading-none w-full max-w-[80%] border-b border-slate-300 pb-2">{studentName}</h3>
        
        <div className="mt-4 max-w-[70%]">
          <p className="text-slate-800 font-bold text-[13px] md:text-[15px] leading-relaxed">
            for successfully Participated in {courseName} <br/>
            Conducted By Kairaa Edu Tech from {startDate} - {endDate}
          </p>
        </div>
      </div>

      {/* --- SIGNATURE --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center w-48">
        <div className="w-full h-12 flex justify-center mb-1">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" 
            alt="Signature" 
            className="h-full object-contain opacity-80 filter grayscale mix-blend-multiply" 
          />
        </div>
        <div className="w-full border-t border-slate-400 pt-1">
          <p className="text-[11px] text-slate-700 font-medium tracking-wide">Managing director, KBA</p>
        </div>
      </div>

      {/* --- LOCK OVERLAY --- */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px] z-50 flex flex-col items-center justify-center transition-all duration-300">
           <div className="w-14 h-14 bg-[#0B0F19] rounded-full flex items-center justify-center text-white mb-4 shadow-[0_10px_30px_rgba(11,15,25,0.4)]">
              <FiLock size={24} />
           </div>
           <h3 className="text-xl font-black text-[#0B0F19] mb-1.5 tracking-tight uppercase">Certificate Locked</h3>
           <p className="text-[13px] text-slate-700 max-w-xs text-center font-bold px-4 leading-relaxed">
             Complete 100% of the course progress to unlock and download your verified certificate.
           </p>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
