import React from "react";
import { useGetStaffEligibleStudentsQuery, useGetStaffCertificatesQuery, useRecommendCertificateMutation } from "../../redux/features/certificate/certificateApi";
import toast from "react-hot-toast";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { FiAward, FiAlertCircle, FiCheck, FiX, FiInfo } from "react-icons/fi";
import AdminLayout from "../../components/Admin/AdminLayout";

const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const StaffCertificatesPage = () => {
  const { data: eligibleData, isLoading: eligibleLoading, refetch: refetchEligible } = useGetStaffEligibleStudentsQuery();
  const { data: certData, isLoading: certsLoading, refetch: refetchCerts } = useGetStaffCertificatesQuery();
  const [recommend, { isLoading: isRecommending }] = useRecommendCertificateMutation();

  const handleRecommend = async (studentId, courseId) => {
    const remarks = window.prompt("Enter recommendation remarks for the Admin (e.g. 'Student excelled in final project'):");
    if (!remarks) return;
    try {
      await recommend({ studentId, courseId, remarks }).unwrap();
      toast.success("Successfully recommended to Admin");
      refetchEligible();
      refetchCerts();
    } catch (e) {
      toast.error(typeof (e.data?.message || "Error recommending certificate") === "string" ? (e.data?.message || "Error recommending certificate") : JSON.stringify(e.data?.message || "Error recommending certificate") || "An error occurred");
    }
  };

  const students = eligibleData?.eligibleStudents || [];
  const recommendedCerts = certData?.certificates || [];

  return (
    <AdminLayout
      title="Certificate Recommendations"
      subtitle="Evaluate student eligibility metrics and recommend certificates to Administration."
    >
      <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Eligible Students</h2>
          {eligibleLoading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
          ) : students.length === 0 ? (
            <GlassPanel className="p-8 flex flex-col items-center justify-center text-center">
              <FiAward className="text-slate-500 text-4xl mb-3" />
              <p className="text-slate-400 font-medium">No students currently tracked in your courses.</p>
            </GlassPanel>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {students.map((s, idx) => (
                <GlassPanel key={idx} className="p-6 flex flex-col transition-all hover:bg-white/5 hover:border-primary/30">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-lg border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                        {s.student?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg leading-tight">{s.student?.name}</p>
                        <p className="text-sm font-medium text-slate-400">{s.course?.name}</p>
                      </div>
                    </div>
                    {s.isEligible ? (
                      <span className="px-3 py-1 bg-success/20 text-success border border-success/30 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(0,230,118,0.2)]"><FiCheck size={12}/> Eligible</span>
                    ) : (
                      <span className="px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1"><FiAlertCircle size={12}/> Incomplete</span>
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-3 mb-6">
                     {s.stats?.map((stat, sIdx) => (
                       <div key={sIdx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                          <div>
                            <p className="text-xs font-bold text-slate-300">{stat.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{stat.value}</p>
                          </div>
                          {stat.met ? (
                            <FiCheck className="text-success" />
                          ) : (
                            <FiX className="text-danger" />
                          )}
                       </div>
                     ))}
                  </div>

                  <button 
                    disabled={!s.isEligible || isRecommending}
                    onClick={() => handleRecommend(s.student._id, s.course._id)}
                    className="w-full bg-primary/10 hover:bg-primary/20 disabled:bg-white/5 disabled:text-slate-500 disabled:border-white/10 text-primary border border-primary/50 py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] disabled:shadow-none"
                  >
                    {s.isEligible ? <><FaCheckCircle /> Recommend to Admin</> : <><FiInfo /> Requirements Not Met</>}
                  </button>
                </GlassPanel>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 mt-8">Your Past Recommendations</h2>
          <GlassPanel className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[10px] uppercase tracking-widest">
                  <th className="p-4 font-bold">Student</th>
                  <th className="p-4 font-bold">Course</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Admin Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {recommendedCerts.map(cert => (
                  <tr key={cert._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{cert.studentId?.name}</td>
                    <td className="p-4">{cert.courseId?.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${
                        cert.status === 'approved' ? 'bg-success/20 text-success border-success/30' :
                        cert.status === 'staff_recommended' ? 'bg-warning/20 text-warning border-warning/30' :
                        cert.status === 'rejected' ? 'bg-danger/20 text-danger border-danger/30' :
                        cert.status === 'returned_for_review' ? 'bg-danger/10 text-danger border-danger/20' :
                        'bg-white/10 text-slate-400 border-white/20'
                      }`}>
                        {cert.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{cert.remarks || "—"}</td>
                  </tr>
                ))}
                {recommendedCerts.length === 0 && !certsLoading && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No past recommendations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlassPanel>
        </section>

      </div>
    </AdminLayout>
  );
};

export default StaffCertificatesPage;
