import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaAward,
  FaQrcode,
  FaDownload,
  FaPrint,
  FaShareAlt,
  FaLinkedin,
  FaLink,
  FaShieldAlt,
  FaUserGraduate,
  FaBook,
  FaClock,
  FaCalendarAlt,
  FaIdBadge,
  FaChalkboardTeacher,
  FaLock,
  FaHistory,
} from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { Custom } from "../";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Dummy avatars/logos if needed
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const VerifyCertificatePage = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle, loading, valid, invalid
  const [data, setData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  // States for layout
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const loadingStepsText = [
    "Searching Certificate...",
    "Validating Student...",
    "Checking Course...",
    "Verifying Digital Signature...",
    "Final Verification...",
  ];

  useEffect(() => {
    const verify = async () => {
      setStatus("loading");
      setLoadingStep(0);

      // Simulate loading steps for UX
      for (let i = 0; i < loadingStepsText.length; i++) {
        setLoadingStep(i);
        await new Promise((res) => setTimeout(res, 600)); // 600ms per step
      }

      try {
        const serverUri = process.env.REACT_APP_PUBLIC_SERVER_URI || "http://localhost:8987/api/v1";
        const res = await fetch(`${serverUri}/certificate/verify/${certificateNumber}`);
        const json = await res.json();
        
        if (json.success && json.certificate) {
          setData(json.certificate);
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        setStatus("invalid");
      }
    };

    if (certificateNumber) {
      verify();
    } else {
      setStatus("idle");
    }
  }, [certificateNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify-certificate/${searchInput.trim()}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Verification link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  const mockData = {
    batch: "Spring 2026",
    completionPercentage: "100%",
    duration: data?.courseId?.estimatedDuration || "12 Weeks",
    modules: data?.courseId?.courseData?.length || 14,
    projects: 3,
    network: "Academy Secure Ledger",
    recordId: data?._id || "REC-00000000",
    hash: data?.verificationCode || "0x00000000000000000000",
    enrollmentDate: new Date(new Date(data?.createdAt || Date.now()).getTime() - 1000 * 60 * 60 * 24 * 90).toLocaleDateString(),
    startedDate: new Date(new Date(data?.createdAt || Date.now()).getTime() - 1000 * 60 * 60 * 24 * 85).toLocaleDateString(),
    completedDate: new Date(data?.createdAt || Date.now()).toLocaleDateString(),
    generatedDate: new Date(data?.issueDate || Date.now()).toLocaleDateString(),
    verifiedToday: new Date().toLocaleDateString(),
    verificationTime: new Date().toLocaleTimeString(),
  };

  return (
    <Custom title="Verify Certificate - Kairaa Academy">
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
      
      <div className="min-h-screen bg-[#050810] text-slate-300 relative overflow-hidden font-sans pt-[20px] pb-20 selection:bg-primary/30">
        
        {/* Animated Gradient Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* HERO SECTION */}
          {status === "idle" && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="max-w-3xl mx-auto mt-10 text-center"
            >
              <div className="w-24 h-24 bg-surface border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.15)] mb-8">
                <FiAward className="text-5xl text-primary drop-shadow-[0_0_15px_rgba(0,242,254,0.5)]" />
              </div>
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-6">
                Digital Certificate Verification
              </h1>
              <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Verify the authenticity of certificates issued by Kairaa Academy. Every verified certificate is digitally secured and tamper-proof.
              </p>

              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-[28px] blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center bg-[#0d1326] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-2">
                  <div className="pl-6 text-slate-500">
                    <FaSearch className="text-xl" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Certificate Number (Example: ACA-2026-FSD-123456)"
                    className="w-full bg-transparent border-none py-5 px-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-0"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] shrink-0"
                  >
                    Verify
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /> Secure Verification</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /> Instant Result</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /> QR Enabled</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" /> Digital Signature Protected</span>
              </div>
            </motion.div>
          )}

          {/* LOADING STATE */}
          {status === "loading" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="max-w-xl mx-auto mt-32 bg-surface/50 backdrop-blur-2xl border border-white/5 p-12 rounded-[32px] text-center shadow-2xl"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl text-primary">
                  <FaShieldAlt className="animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Record</h2>
              <p className="text-primary font-medium mb-8 h-6">{loadingStepsText[loadingStep]}</p>
              
              <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadingStep + 1) / loadingStepsText.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono">ESTABLISHING SECURE CONNECTION...</p>
            </motion.div>
          )}

          {/* INVALID STATE */}
          {status === "invalid" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="max-w-2xl mx-auto mt-20"
            >
              <div className="bg-red-950/20 backdrop-blur-xl border border-red-500/20 rounded-[32px] p-10 md:p-14 text-center shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <FaTimesCircle className="text-5xl text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-4">Certificate Not Found</h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                  The entered certificate number could not be verified in our secure registry.
                </p>

                <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 text-left mb-10">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Possible Reasons</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="mt-1 text-red-400">•</span>
                      The certificate number was typed incorrectly.
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="mt-1 text-red-400">•</span>
                      The certificate has been revoked by Kairaa Academy.
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="mt-1 text-red-400">•</span>
                      The certificate has expired and is no longer valid.
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <span className="mt-1 text-red-400">•</span>
                      The certificate has not been officially issued yet.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => { setStatus("idle"); setSearchInput(""); }}
                    className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all hover:bg-slate-200"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-white/5"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {status === "valid" && data && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full mt-10"
            >
              {/* Header Badge */}
              <div className="flex flex-col items-center justify-center text-center mb-16">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-28 h-28 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                >
                  <FaCheckCircle className="text-6xl text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Successfully Verified</h2>
                <p className="text-lg text-emerald-400/80 max-w-2xl font-medium">
                  This certificate has been officially issued by Kairaa Academy and its digital signature is fully intact.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Student Profile Card */}
                  <div className="bg-[#0B101E] border border-white/10 rounded-[24px] overflow-hidden shadow-xl backdrop-blur-md relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-6 mb-8">
                        <img 
                          src={data?.studentId?.avatar?.url || DEFAULT_AVATAR + (data?.studentId?.name || "Student")} 
                          alt="Student Avatar" 
                          className="w-20 h-20 rounded-full border-2 border-primary/50 object-cover shadow-[0_0_20px_rgba(0,242,254,0.2)]"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{data?.studentId?.name}</h3>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Certified Status
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Student ID</p>
                          <p className="text-sm text-white font-mono bg-white/5 inline-block px-2 py-1 rounded">{data?.studentId?._id?.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Batch</p>
                          <p className="text-sm text-white font-medium">{mockData.batch}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Final Grade</p>
                          <p className="text-sm text-primary font-bold text-xl">{data?.overallScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Completion</p>
                          <p className="text-sm text-white font-medium">{mockData.completionPercentage}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Card */}
                  <div className="bg-[#0B101E] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-white/5 transform translate-x-4 -translate-y-4 pointer-events-none">
                      <FaBook className="text-8xl" />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <FaBook />
                      </div>
                      <h3 className="text-xl font-bold text-white">Course Details</h3>
                    </div>

                    <div className="mb-6 relative z-10">
                      <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary mb-2">
                        {data?.courseId?.name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaClock /> Duration</p>
                        <p className="text-sm text-white">{mockData.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaChalkboardTeacher /> Instructor</p>
                        <p className="text-sm text-white">{data?.staffId?.name || "Kairaa Faculty"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaBook /> Modules</p>
                        <p className="text-sm text-white">{mockData.modules} Modules</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaUserGraduate /> Projects</p>
                        <p className="text-sm text-white">{mockData.projects} Completed</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaCalendarAlt /> Issue Date</p>
                        <p className="text-sm text-white">{new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><FaIdBadge /> Cert Number</p>
                        <p className="text-sm text-primary font-mono">{data.certificateNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Card */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-[#0B101E] border border-amber-500/20 rounded-[24px] p-6 md:p-8 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <FaAward />
                      </div>
                      <h3 className="text-xl font-bold text-amber-400">Achievements & Honors</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {data?.honors && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
                          <span className="font-bold text-white">Graduation Honor</span>
                          <span className="text-amber-400 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-full">{data.honors}</span>
                        </div>
                      )}
                      
                      {data?.microCredentials && data.microCredentials.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 mt-6">Micro-Credentials</p>
                          <div className="flex flex-wrap gap-2">
                            {data.microCredentials.map((cred, i) => (
                              <span key={i} className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-500 text-[10px]" /> {cred}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Security Verification Card */}
                  <div className="bg-[#0B101E] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <FaShieldAlt />
                      </div>
                      <h3 className="text-xl font-bold text-white">Security & Ledger</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <FaCheckCircle className="text-emerald-400" />
                          <span className="text-slate-300 font-medium">Digital Signature</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">Verified Authentic</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <FaQrcode className="text-primary" />
                          <span className="text-slate-300 font-medium">QR Verification</span>
                        </div>
                        <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">Passed</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Certificate Hash</p>
                          <p className="text-xs text-slate-400 font-mono break-all">{mockData.hash}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Verification Record ID</p>
                          <p className="text-xs text-slate-400 font-mono">{mockData.recordId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Timestamp</p>
                          <p className="text-xs text-slate-400 font-mono">{mockData.verifiedToday} • {mockData.verificationTime}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Network Protocol</p>
                          <p className="text-xs text-primary font-mono">{mockData.network}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Grid for Preview, QR, and Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left Sub-column: Timeline */}
                    <div className="bg-[#0B101E] border border-white/10 rounded-[24px] p-6 shadow-xl h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <FaHistory />
                        </div>
                        <h3 className="text-lg font-bold text-white">Timeline</h3>
                      </div>
                      
                      <div className="relative border-l-2 border-white/10 ml-4 space-y-6 pb-4">
                        <div className="relative pl-6">
                          <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[7px] top-1"></div>
                          <p className="text-sm font-bold text-white">Enrollment</p>
                          <p className="text-xs text-slate-500">{mockData.enrollmentDate}</p>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[7px] top-1"></div>
                          <p className="text-sm font-bold text-white">Course Started</p>
                          <p className="text-xs text-slate-500">{mockData.startedDate}</p>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[7px] top-1"></div>
                          <p className="text-sm font-bold text-white">Course Completed</p>
                          <p className="text-xs text-slate-500">{mockData.completedDate}</p>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute w-4 h-4 border-2 border-[#050810] bg-primary rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(0,242,254,0.5)]"></div>
                          <p className="text-sm font-bold text-primary">Certificate Generated</p>
                          <p className="text-xs text-primary/70 font-medium">{mockData.generatedDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Sub-column: QR & Preview */}
                    <div className="space-y-8">
                      
                      {/* QR Verification Card */}
                      <div className="bg-[#0B101E] border border-white/10 rounded-[24px] p-6 shadow-xl flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-3 rounded-2xl shadow-xl mb-4">
                          <img 
                            src={data.qrCodeUrl} 
                            alt="Verification QR Code" 
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <h4 className="text-white font-bold mb-1">Scan to Verify</h4>
                        <p className="text-xs text-slate-400">Instantly authenticate this certificate on any mobile device.</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-[#0B101E] border border-white/10 rounded-[24px] p-6 shadow-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <a 
                            href={data.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                          >
                            <FaDownload className="text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">Download</span>
                          </a>
                          <button 
                            onClick={handlePrint}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                          >
                            <FaPrint className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all" />
                            <span className="text-xs font-bold">Print</span>
                          </button>
                          <button 
                            onClick={handleCopyLink}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                          >
                            <FaLink className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all" />
                            <span className="text-xs font-bold">Copy Link</span>
                          </button>
                          <a 
                            href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(data?.courseId?.name)}&organizationName=Kairaa%20Academy&issueYear=${new Date(data.issueDate).getFullYear()}&issueMonth=${new Date(data.issueDate).getMonth()+1}&certUrl=${encodeURIComponent(window.location.href)}&certId=${data.certificateNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                          >
                            <FaLinkedin className="text-[#0A66C2] group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">LinkedIn</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Action reset to search another */}
              <div className="mt-12 text-center">
                <button 
                  onClick={() => { setStatus("idle"); setSearchInput(""); navigate("/verify-certificate"); }}
                  className="text-sm font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full transition-all"
                >
                  <FaSearch className="inline mr-2 mb-1" /> Verify another certificate
                </button>
              </div>
            </motion.div>
          )}

          {/* BOTTOM FOOTER SECTION FOR PORTAL */}
          <div className="mt-32 pt-10 border-t border-white/10 text-center">
            <h4 className="text-white font-bold mb-4">Need Help?</h4>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-12">
              <a href="/faq" className="hover:text-primary transition-colors">Verification FAQ</a>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <a href="mailto:support@kairaaacademy.com" className="hover:text-primary transition-colors">support@kairaaacademy.com</a>
            </div>

            <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Powered By</p>
              <p className="text-sm text-white font-medium flex items-center gap-2">
                <FiAward className="text-primary" /> Kairaa Academy Verification Engine <span className="text-slate-500 font-mono text-[10px] ml-2">v2.4.0</span>
              </p>
              {status === "valid" && (
                <p className="text-[10px] text-slate-500 mt-3 font-mono">
                  Verification completed in 0.32 seconds.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer hideQuickAccess={true} />
    </Custom>
  );
};

export default VerifyCertificatePage;
