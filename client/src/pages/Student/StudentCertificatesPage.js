import React, { useState } from "react";
import { useGetStudentCertificatesQuery, useGetStudentProgressQuery } from "../../redux/features/certificate/certificateApi";
import { FaDownload, FaQrcode, FaCheckCircle, FaSpinner, FaTimesCircle, FaClock } from "react-icons/fa";
import { FiAward, FiAlertCircle, FiCheck, FiX, FiChevronRight, FiUsers, FiStar, FiActivity, FiTarget, FiBriefcase, FiLink } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import CertificateTemplate from "../../components/ui/CertificateTemplate";

const StudentCertificatesPage = ({ activeCourseId, globalCourseName, globalInstructorName }) => {
  const { user } = useSelector((state) => state.auth);
  const { data: certData, isLoading: certsLoading } = useGetStudentCertificatesQuery();
  const { data: progressData, isLoading: progressLoading } = useGetStudentProgressQuery();
  const [activeTab, setActiveTab] = useState("vault");

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FaCheckCircle size={10}/> Approved</span>;
      case "staff_recommended": 
      case "pending": return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FaClock size={10}/> In Review</span>;
      case "rejected": return <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FaTimesCircle size={10}/> Rejected</span>;
      case "returned_for_review": return <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FiAlertCircle size={10}/> Returned</span>;
      case "revoked": return <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FiAlertCircle size={10}/> Revoked</span>;
      default: return null;
    }
  };

  const getHonorsBadge = (honors) => {
    if (!honors) return null;
    if (honors === "Highest Honors") return <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-100 to-yellow-300 text-yellow-900 border border-yellow-400 shadow-sm text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><FiStar className="fill-yellow-900"/> {honors}</div>;
    if (honors === "Honors") return <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-100 to-slate-300 text-slate-800 border border-slate-400 shadow-sm text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><FiStar className="fill-slate-800"/> {honors}</div>;
    if (honors === "Distinction") return <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-100 to-orange-300 text-orange-900 border border-orange-400 shadow-sm text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><FiStar className="fill-orange-900"/> {honors}</div>;
    return null;
  };

  // Filter if activeCourseId is provided
  let filteredProgress = progressData?.progress || [];
  if (activeCourseId) {
    filteredProgress = filteredProgress.filter(p => p.course?._id === activeCourseId);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans">
      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Certificates & Honors
            </h1>
            {globalCourseName && (
              <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
                <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                  {globalCourseName}
                </span>
                {globalInstructorName && (
                   <>
                    <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                      <FiUsers size={13} className="text-[#94A3B8]" />
                      {globalInstructorName}
                    </div>
                   </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-8 pb-16">

          {/* ── KPI STRIP ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {[
              { label: "Earned Certificates", value: certData?.certificates?.length || 0, icon: <FiAward size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: (certData?.certificates?.length || 0) / (progressData?.progress?.length || 1) },
              { label: "Courses In Progress", value: progressData?.progress?.filter(p => !p.certificate).length || 0, icon: <FiActivity size={18} strokeWidth={2.5} />, color: "text-blue-600", bg: "bg-blue-100", accent: "bg-blue-500", track: "bg-blue-100", ratio: (progressData?.progress?.filter(p => !p.certificate).length || 0) / (progressData?.progress?.length || 1) },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                    {kpi.icon}
                  </div>
                  <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{kpi.value}</h3>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : kpi.track}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div className="flex items-center gap-6 mb-6 border-b border-[#E2E8F0] px-1">
            {[
              { id: "vault", label: "Certificate Vault" },
              { id: "progress", label: "Eligibility Progress" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-[13px] font-bold tracking-wide uppercase transition-colors relative ${
                  activeTab === tab.id ? "text-[#0F172A]" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="certTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F172A]" />
                )}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="min-h-[400px]">
            {activeTab === "vault" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                {progressLoading ? (
                  <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-[#64748B] text-2xl" /></div>
                ) : filteredProgress?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredProgress.map((prog) => {
                      const isLocked = !prog.certificate || prog.certificate.status !== "approved";
                      return (
                        <div key={prog.course?._id || prog._id} className="flex flex-col relative group">
                                                    <CertificateTemplate 
                            studentName={user?.name || "STUDENT NAME"}
                            courseName={prog.course?.name || "Blockchain Course"}
                            isLocked={isLocked}
                            startDate={prog.createdAt ? new Date(prog.createdAt).toLocaleDateString() : "N/A"}
                            endDate={prog.certificate?.issueDate ? new Date(prog.certificate.issueDate).toLocaleDateString() : "Present"}
                            certificateNumber={prog.certificate?.certificateNumber || "XXXX-XXXX"}
                            qrCodeUrl={prog.certificate?.qrCodeUrl || ""}
                          />
                          {!isLocked && (
                            <div className="mt-4 flex gap-3">
                              <a href={prog.certificate?.pdfUrl} target="_blank" rel="noreferrer" className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] text-white py-2.5 rounded-lg text-[13px] font-bold flex justify-center items-center gap-2 transition-colors">
                                 <FaDownload size={14}/> Download PDF
                              </a>
                              <a href={`/verify-certificate/${prog.certificate?.certificateNumber}`} target="_blank" rel="noreferrer" className="flex-1 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] py-2.5 rounded-lg text-[13px] font-bold flex justify-center items-center gap-2 transition-colors">
                                 <FaQrcode size={14}/> Verify
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 border border-dashed border-[#CBD5E1] rounded-[16px] bg-[#F8FAFC] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex items-center justify-center mb-4 text-[#94A3B8]">
                       <FiAward size={24} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">No Certificates Yet</h3>
                    <p className="text-[13px] text-[#64748B] max-w-[280px]">Enroll in a course to start earning your verified certificates.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "progress" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                {progressLoading ? (
                  <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-[#64748B] text-2xl" /></div>
                ) : filteredProgress?.length > 0 ? (
                  <div className="space-y-6">
                    {filteredProgress.map((prog, idx) => (
                      <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 lg:p-8 hover:border-[#CBD5E1] shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col gap-6 group relative overflow-hidden">
                       
                       {/* Smart Honors Header */}
                       <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between items-start lg:items-center mb-2">
                         <div className="flex-1 min-w-0 flex flex-col gap-3.5">
                           <div className="flex flex-wrap items-center gap-3">
                             <h3 className="text-lg lg:text-[19px] font-bold text-[#0F172A] leading-tight tracking-tight">{prog.course?.name}</h3>
                             {prog.certificate ? (
                                getStatusBadge(prog.certificate.status)
                             ) : (
                                <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${prog.isEligible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                   {prog.isEligible ? 'Eligible for Certificate' : 'Pending Eligibility'}
                                </span>
                             )}
                           </div>
                           
                           {/* Overall Score */}
                           {prog.overallScore > 0 && (
                              <p className="text-[14px] text-[#475569] leading-relaxed break-words">
                                Current Overall Score: <strong className={`font-black ${prog.overallScore >= 90 ? 'text-amber-600' : 'text-[#0F172A]'}`}>{prog.overallScore}%</strong>
                              </p>
                           )}
                         </div>
                         
                         <div className="shrink-0 hidden lg:block">
                           <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                             <FiTarget size={28} strokeWidth={2}/>
                           </div>
                         </div>
                       </div>

                         {/* Micro Credentials Prediction */}
                         {!prog.certificate && prog.microCredentials?.length > 0 && (
                           <div className="mb-6 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-3">
                              <div className="mt-0.5 text-amber-500"><FiStar size={16}/></div>
                              <div>
                                <p className="text-[12px] font-bold text-amber-900 mb-1">Path to Honors</p>
                                <p className="text-[13px] text-amber-800">
                                  You are on track to unlock: <span className="font-bold">{prog.microCredentials.join(", ")}</span>!
                                </p>
                              </div>
                           </div>
                         )}

                         {/* Stats Grid */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                           {prog.stats?.map((stat, sIdx) => (
                             <div key={sIdx} className={`flex flex-col p-4 rounded-xl border ${stat.met ? 'bg-emerald-50/50 border-emerald-100' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="text-[13px] font-bold text-[#334155] leading-none mb-1.5">{stat.label}</p>
                                    <p className="text-[11px] font-medium text-[#64748B]">Target: {stat.target}</p>
                                  </div>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${stat.met ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-rose-100 text-rose-500'}`}>
                                     {stat.met ? <FiCheck size={16} strokeWidth={3} /> : <FiX size={16} strokeWidth={3} />}
                                  </div>
                                </div>
                                <div className="flex items-end justify-between mt-auto">
                                  <span className={`text-[18px] font-black leading-none ${stat.met ? 'text-emerald-700' : 'text-[#0F172A]'}`}>{stat.value}</span>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider ${stat.met ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {stat.met ? 'Achieved' : 'Pending'}
                                  </span>
                                </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 border border-dashed border-[#CBD5E1] rounded-[16px] bg-[#F8FAFC] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex items-center justify-center mb-4 text-[#94A3B8]">
                       <FiTarget size={24} />
                    </div>
                    <p className="text-[14px] font-medium text-[#64748B]">Enroll in a course to start tracking eligibility progress.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentCertificatesPage;
