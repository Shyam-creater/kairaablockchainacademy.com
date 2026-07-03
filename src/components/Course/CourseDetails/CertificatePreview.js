import React from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';

const CertificatePreview = ({ data }) => {
  if (!data?.certificate?.enabled) return null;

  return (
    <div className="pt-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8 }} className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Verified On-Chain Credentials</h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl">Share your achievements globally with cryptographic proof. Validate your skills and enhance your resume with an industry-recognized certificate.</p>
        
        <div className="relative w-full max-w-3xl aspect-[1.4] bg-[#050810] border border-white/10 rounded-3xl flex items-center justify-center p-8 overflow-hidden shadow-2xl group cursor-default">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 group-hover:opacity-20 transition-opacity" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--tw-colors-primary)_360deg)] animate-[spin_4s_linear_infinite] opacity-20" />
          <div className="absolute inset-1 bg-[#050810] rounded-3xl z-0" />

          <div className="border-8 border-double border-primary/20 w-full h-full flex flex-col items-center justify-center p-8 bg-[#050810]/90 backdrop-blur-md relative z-10 rounded-2xl group-hover:border-primary/40 transition-colors">
            <FiAward size={56} className="text-primary mb-6 drop-shadow-[0_0_15px_rgba(0,242,254,0.5)]" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-widest mb-4">Certificate of {data.certificate.type || 'Excellence'}</h3>
            <p className="text-slate-400 mb-10 text-center max-w-lg">This certifies the successful completion of the {data.name} program.</p>
            <div className="w-full flex justify-between border-t border-white/10 pt-6 px-4 md:px-12">
              <div className="text-left"><p className="text-[10px] text-primary font-bold uppercase tracking-widest">ID Number</p><p className="text-white font-mono font-bold mt-1">KBA-{data._id ? data._id.substring(0,6).toUpperCase() : '2026-98X'}</p></div>
              <div className="text-right"><p className="text-[10px] text-primary font-bold uppercase tracking-widest">Verified By</p><p className="text-white font-bold mt-1">Kairaa Blockchain</p></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificatePreview;
