import React from "react";
import { 
  useGetAdminCertificatesQuery, 
  useGetCertificateAnalyticsQuery, 
  useAdminApproveCertificateMutation, 
  useRevokeCertificateMutation, 
  useRejectCertificateMutation 
} from "../../redux/features/certificate/certificateApi";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaDownload, FaUndo } from "react-icons/fa";
import { FiAward, FiBarChart2, FiMessageSquare } from "react-icons/fi";
import AdminLayout from "../../components/Admin/AdminLayout";
import Heading from "../../components/Heading";
import { motion } from "framer-motion";

// ── Neon UI Primitives ────────────────────────────────────────────────────────
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonBadge = ({ status }) => {
  const map = {
    staff_recommended: { label: "Ready", cls: "bg-warning/10 text-warning border-warning/30 shadow-[0_0_10px_rgba(255,179,0,0.2)]" },
    approved:          { label: "Issued", cls: "bg-success/10 text-success border-success/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]" },
    revoked:           { label: "Revoked", cls: "bg-danger/10 text-danger border-danger/30 shadow-[0_0_10px_rgba(255,23,68,0.2)]" },
    rejected:          { label: "Rejected", cls: "bg-danger/10 text-danger border-danger/30 shadow-[0_0_10px_rgba(255,23,68,0.2)]" },
    returned_for_review:{ label: "Returned", cls: "bg-accent/10 text-accent border-accent/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]" }
  };
  const { label, cls } = map[status] || { label: status, cls: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
  return <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

const NeonButton = ({ children, onClick, disabled, variant = "primary", className = "", title="" }) => {
  const variants = {
    primary:   "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    secondary: "bg-accent/10  border-accent/50  text-accent  hover:bg-accent/20  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    success:   "bg-success/10 border-success/50 text-success hover:bg-success/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
    warning:   "bg-warning/10 border-warning/50 text-warning hover:bg-warning/20 hover:shadow-[0_0_20px_rgba(255,179,0,0.3)]",
    danger:    "bg-danger/10  border-danger/50  text-danger  hover:bg-danger/20  hover:shadow-[0_0_20px_rgba(255,23,68,0.3)]",
    ghost:     "bg-white/5    border-white/10   text-slate-300 hover:bg-white/10 hover:text-white",
  };
  return (
    <button title={title} onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const AdminCertificatePage = () => {
  const { data: listData, isLoading, refetch } = useGetAdminCertificatesQuery();
  const { data: analyticsData } = useGetCertificateAnalyticsQuery();
  const [approve, { isLoading: isApproving }] = useAdminApproveCertificateMutation();
  const [revoke, { isLoading: isRevoking }] = useRevokeCertificateMutation();
  const [reject, { isLoading: isRejecting }] = useRejectCertificateMutation();

  const handleApprove = async (id) => {
    try {
      const res = await approve(id).unwrap();
      toast.success(res.message);
      refetch();
    } catch (e) {
      toast.error(typeof (e.data?.message || "Error approving certificate") === "string" ? (e.data?.message || "Error approving certificate") : JSON.stringify(e.data?.message || "Error approving certificate") || "An error occurred");
    }
  };

  const handleReturn = async (id) => {
    const remarks = window.prompt("Enter remarks for returning this to staff for review:");
    if (!remarks) return;
    try {
      await reject({ id, remarks, status: "returned_for_review" }).unwrap();
      toast.success("Returned to staff for review");
      refetch();
    } catch (e) {
      toast.error(typeof (e.data?.message || "Error returning certificate") === "string" ? (e.data?.message || "Error returning certificate") : JSON.stringify(e.data?.message || "Error returning certificate") || "An error occurred");
    }
  };

  const handleReject = async (id) => {
    const remarks = window.prompt("Enter permanent rejection remarks:");
    if (!remarks) return;
    try {
      await reject({ id, remarks, status: "rejected" }).unwrap();
      toast.success("Certificate rejected permanently");
      refetch();
    } catch (e) {
      toast.error(typeof (e.data?.message || "Error rejecting certificate") === "string" ? (e.data?.message || "Error rejecting certificate") : JSON.stringify(e.data?.message || "Error rejecting certificate") || "An error occurred");
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this certificate? This action is permanent.")) return;
    try {
      await revoke(id).unwrap();
      toast.success("Certificate revoked");
      refetch();
    } catch (e) {
      toast.error(typeof (e.data?.message || "Error revoking certificate") === "string" ? (e.data?.message || "Error revoking certificate") : JSON.stringify(e.data?.message || "Error revoking certificate") || "An error occurred");
    }
  };

  const pendingAdmin = listData?.certificates?.filter(c => c.status === "staff_recommended") || [];
  const activeCerts = listData?.certificates?.filter(c => c.status === "approved") || [];
  const stats = analyticsData?.analytics || { totalIssued: 0, pendingRequests: 0, revoked: 0, overallCompletionRate: 0 };

  return (
    <>
      <Heading title="Certificate Operations" description="LMS Certificate Management" keywords="Admin, Certificates" />
      <AdminLayout
        title="Certificate Operations"
        subtitle="Final approval, issuance, and revocation of staff-recommended certificates."
      >
        <div className="space-y-8">
          
          {/* Analytics Top Cards */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Issued", value: stats.approved || stats.totalIssued, icon: <FiAward />, col: "text-success" },
              { label: "Pending Approvals", value: stats.pending || stats.pendingRequests, icon: <FiBarChart2 />, col: "text-warning" },
              { label: "Total Tracked", value: stats.total || stats.revoked, icon: <FiBarChart2 />, col: "text-primary" },
              { label: "Avg Completion Rate", value: `${Math.round(stats.overallCompletionRate || 95)}%`, icon: <FiBarChart2 />, col: "text-accent" },
            ].map((stat, i) => (
              <GlassPanel key={i} className="p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className={`text-3xl ${stat.col}`}>{stat.icon}</div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                </div>
              </GlassPanel>
            ))}
          </motion.div>

          {isLoading ? (
             <div className="flex justify-center py-20">
               <FaSpinner className="animate-spin text-primary text-4xl" />
             </div>
          ) : (
            <>
              {/* Needs Final Approval */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <FiAward className="text-warning" /> Ready For Issuance (Staff Recommended)
                </h2>
                
                <GlassPanel className="overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-black/20 text-xs uppercase text-slate-500 border-b border-white/10 sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Course & Staff</th>
                          <th className="p-4">Staff Remarks</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {pendingAdmin.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-8 text-center text-slate-500">No certificates pending your final approval.</td>
                          </tr>
                        ) : (
                          pendingAdmin.map(cert => (
                            <tr key={cert._id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <p className="font-bold text-white">{cert.studentId?.name}</p>
                                <p className="text-xs text-slate-400">{cert.studentId?.email}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-slate-300">{cert.courseId?.name}</p>
                                <p className="text-xs text-slate-400">Rec. by: {cert.staffId?.name}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 max-w-xs">
                                  <FiMessageSquare className="text-slate-400 mt-0.5 shrink-0" />
                                  <p className="text-xs text-slate-300 italic leading-tight">{cert.remarks}</p>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <NeonButton disabled={isApproving} onClick={() => handleApprove(cert._id)} variant="success">
                                    <FaCheckCircle /> Approve
                                  </NeonButton>
                                  <NeonButton disabled={isRejecting} onClick={() => handleReturn(cert._id)} variant="warning">
                                    <FaUndo /> Return
                                  </NeonButton>
                                  <NeonButton disabled={isRejecting} onClick={() => handleReject(cert._id)} variant="danger">
                                    <FaTimesCircle /> Reject
                                  </NeonButton>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassPanel>
              </motion.section>

              {/* Issued Certificates */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <FaCheckCircle className="text-success" /> Issued Certificates Directory
                </h2>
                <GlassPanel className="overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-black/20 text-xs uppercase text-slate-500 border-b border-white/10 sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="p-4">Cert ID</th>
                          <th className="p-4">Student</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Issue Date</th>
                          <th className="p-4 text-right">Management</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeCerts.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-500">No active certificates found.</td>
                          </tr>
                        ) : (
                          activeCerts.slice(0, 10).map(cert => (
                            <tr key={cert._id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-xs text-accent">{cert.certificateNumber}</td>
                              <td className="p-4 font-bold text-white">{cert.studentId?.name}</td>
                              <td className="p-4 text-slate-300">{cert.courseId?.name}</td>
                              <td className="p-4 text-slate-400">{new Date(cert.issueDate).toLocaleDateString()}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                                    <FaDownload /> PDF
                                  </a>
                                  <NeonButton disabled={isRevoking} onClick={() => handleRevoke(cert._id)} variant="danger" title="Revoke Certificate">
                                    <FaTimesCircle /> Revoke
                                  </NeonButton>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassPanel>
              </motion.section>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminCertificatePage;
