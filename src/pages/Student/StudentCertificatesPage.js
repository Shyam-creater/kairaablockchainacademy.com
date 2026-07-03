import React from "react";
import { useGetStudentCertificatesQuery, useGetStudentProgressQuery } from "../../redux/features/certificate/certificateApi";
import { FaDownload, FaQrcode, FaCheckCircle, FaSpinner, FaTimesCircle, FaClock } from "react-icons/fa";
import { FiAward, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

const StudentCertificatesPage = () => {
  const { data: certData, isLoading: certsLoading } = useGetStudentCertificatesQuery();
  const { data: progressData, isLoading: progressLoading } = useGetStudentProgressQuery();

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] border border-[#34D399] rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle/> Approved</span>;
      case "staff_recommended": 
      case "pending": return <span className="px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FBBF24] rounded-full text-xs font-bold flex items-center gap-1"><FaClock/> In Review</span>;
      case "rejected": return <span className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] border border-[#F87171] rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle/> Rejected</span>;
      case "returned_for_review": return <span className="px-3 py-1 bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] rounded-full text-xs font-bold flex items-center gap-1"><FiAlertCircle/> Returned</span>;
      case "revoked": return <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] rounded-full text-xs font-bold flex items-center gap-1"><FiAlertCircle/> Revoked</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12 min-h-screen">
      <div className="border-b border-[#E5E7EB] pb-6">
          <h1 className="text-3xl font-extrabold text-[#111827] flex items-center gap-3">
             Certificate Progress & Vault
          </h1>
          <p className="text-[#6B7280] mt-2">Track your eligibility progress and download issued certificates.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Col: Eligibility Progress */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#111827]">Eligibility Progress</h2>
          {progressLoading ? (
            <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-[#3B82F6] text-3xl" /></div>
          ) : progressData?.progress?.length > 0 ? (
            <div className="space-y-6">
              {progressData.progress.map((prog, idx) => (
                <div key={idx} className="border border-[#E5E7EB] rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h3 className="font-bold text-[#111827] text-lg">{prog.course?.name}</h3>
                       {prog.certificate ? (
                          <div className="mt-2">{getStatusBadge(prog.certificate.status)}</div>
                       ) : (
                          <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${prog.isEligible ? 'bg-[#D1FAE5] text-[#065F46] border border-[#34D399]' : 'bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB]'}`}>
                             {prog.isEligible ? <><FiCheck /> Eligible for Recommendation</> : <><FiAlertCircle /> Not Yet Eligible</>}
                          </div>
                       )}
                     </div>
                   </div>

                   <div className="space-y-3">
                     {prog.stats?.map((stat, sIdx) => (
                       <div key={sIdx} className="flex justify-between items-center p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                          <div>
                            <p className="text-sm font-bold text-[#374151]">{stat.label}</p>
                            <p className="text-xs text-[#6B7280]">Target: {stat.target}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#111827]">{stat.value}</span>
                            {stat.met ? (
                              <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white"><FiCheck size={12} /></div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#F3F4F6] border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF]"><FiX size={12} /></div>
                            )}
                          </div>
                       </div>
                     ))}
                   </div>

                   {!prog.certificate && prog.isEligible && (
                     <div className="mt-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-sm text-[#1E40AF]">
                       <p className="font-bold mb-1">🎉 You are eligible!</p>
                       <p>A staff member will review your progress and recommend your certificate to administration shortly.</p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] flex flex-col items-center justify-center text-center">
              <p className="text-[#6B7280] font-medium">Enroll in a course to start tracking progress.</p>
            </div>
          )}
        </div>

        {/* Right Col: Vault */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#111827]">Earned Certificates</h2>
          {certsLoading ? (
            <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-[#3B82F6] text-3xl" /></div>
          ) : certData?.certificates?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certData.certificates.map((cert) => (
                <div key={cert._id} className="relative group border border-[#E5E7EB] rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-full aspect-[4/3] rounded-xl mb-5 relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex flex-col items-center justify-center p-6 text-center shadow-inner`}>
                     <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><FiAward className="text-white text-xl" /></div>
                     <h2 className="text-white font-black text-xl uppercase leading-tight">{cert.courseId?.name}</h2>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#111827] text-lg leading-tight truncate mr-2">{cert.courseId?.name}</h3>
                    {getStatusBadge(cert.status)}
                  </div>
                  <p className="text-sm text-[#6B7280] mb-1 font-mono">ID: {cert.certificateNumber || "N/A"}</p>
                  <p className="text-sm text-[#6B7280] mb-5">Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "Pending"}</p>
                  
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                    <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="flex-1 bg-[#111827] hover:bg-[#374151] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors shadow-sm">
                      <FaDownload /> Download
                    </a>
                    <a href={`/verify-certificate/${cert.certificateNumber}`} target="_blank" rel="noreferrer" className="bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] p-3 rounded-xl transition-colors shadow-sm" title="Verify Online">
                      <FaQrcode />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
                 <FiAward className="text-3xl text-[#9CA3AF]" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">No Certificates Yet</h3>
              <p className="text-[#6B7280] max-w-sm">Complete your courses and meet the eligibility criteria to unlock and earn your certificates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCertificatesPage;
