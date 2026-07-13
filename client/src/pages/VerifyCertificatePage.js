import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { Custom } from "../";

const VerifyCertificatePage = () => {
  const { certificateNumber } = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`/api/v1/certificate/verify/${certificateNumber}`);
        const json = await res.json();
        if (json.success && json.valid) {
          setData(json.certificate);
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        setStatus("invalid");
      }
    };
    if (certificateNumber) verify();
  }, [certificateNumber]);

  return (
    <Custom>
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-md w-full bg-surface/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative z-10 text-center"
        >
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-primary text-5xl mb-4" />
              <h2 className="text-xl font-bold text-white">Verifying Certificate...</h2>
              <p className="text-slate-400 text-sm mt-2">Checking secure database records.</p>
            </div>
          )}

          {status === "valid" && data && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-success/20 border border-success/40 rounded-full flex items-center justify-center text-success text-5xl mb-6 shadow-[0_0_30px_rgba(0,230,118,0.3)]">
                <FaCheckCircle />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Verified Authentic</h2>
              <p className="text-slate-400 text-sm mb-6">This certificate is valid and issued by the Academy.</p>
              
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Issued To</p>
                  <p className="text-base font-bold text-white">{data.studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Course Name</p>
                  <p className="text-base font-bold text-primary">{data.courseName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Issue Date</p>
                  <p className="text-sm font-medium text-white">{new Date(data.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Certificate Number</p>
                  <p className="text-sm font-mono text-slate-300">{data.certificateNumber}</p>
                </div>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-danger/20 border border-danger/40 rounded-full flex items-center justify-center text-danger text-5xl mb-6 shadow-[0_0_30px_rgba(255,23,68,0.3)]">
                <FaTimesCircle />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Invalid Certificate</h2>
              <p className="text-slate-400 text-sm">We could not verify this certificate number. It may be revoked, expired, or incorrect.</p>
            </div>
          )}
        </motion.div>
      </div>
    </Custom>
  );
};

export default VerifyCertificatePage;
