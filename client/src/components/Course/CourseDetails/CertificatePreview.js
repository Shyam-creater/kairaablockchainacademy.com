import React from 'react';
import { motion } from 'framer-motion';
import CertificateTemplate from '../../ui/CertificateTemplate';

const CertificatePreview = ({ data }) => {
  if (!data?.certificate?.enabled) return null;

  return (
    <div className="pt-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8 }} className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Verified On-Chain Credentials</h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl">Share your achievements globally with cryptographic proof. Validate your skills and enhance your resume with an industry-recognized certificate.</p>
        
        <div className="w-full max-w-4xl mx-auto shadow-2xl">
          <CertificateTemplate 
            studentName="STUDENT NAME"
            courseName={data.name || "Blockchain Development"}
            isLocked={true}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CertificatePreview;
