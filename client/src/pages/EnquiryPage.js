import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useRegisterCourseMutation } from "../redux/features/user/userApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiClock, FiStar, FiUsers, FiVideo, FiBriefcase, FiAward, FiBox, FiCode, FiLink, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import CountUp from "react-countup";
import Confetti from "react-confetti";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

const coursesList = [
  { id: "Blockchain Developer Fundamentals", name: "Blockchain Fundamentals", duration: "8 Weeks", level: "Beginner", icon: <FiBox className="text-3xl" /> },
  { id: "Blockchain Developer Professional", name: "Solidity Development", duration: "12 Weeks", level: "Intermediate", icon: <FiCode className="text-3xl" /> },
  { id: "Blockchain Developer Expert", name: "Smart Contract Engineering", duration: "16 Weeks", level: "Advanced", icon: <FiLink className="text-3xl" /> },
  { id: "Certified Blockchain Trainer", name: "Blockchain Trainer Program", duration: "24 Weeks", level: "Expert", icon: <FiAward className="text-3xl" /> }
];

const EnquiryPage = () => {
  const [step, setStep] = useState(1);
  const [registerCourse, { isSuccess, error, isLoading }] = useRegisterCourseMutation();
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const validationSchemas = [
    Yup.object().shape({
      firstName: Yup.string().required("Please enter your full name"),
    }),
    Yup.object().shape({
      email: Yup.string().email("Invalid email address").required("Please enter your email"),
      phoneNumber: Yup.string().required("Please enter your phone number").min(10, "Phone number must be at least 10 digits"),
    }),
    Yup.object().shape({
      course: Yup.string().required("Please select a course"),
    }),
  ];

  const currentSchema = validationSchemas[step - 1] || validationSchemas[2];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      course: "",
    },
    validationSchema: currentSchema,
    onSubmit: async (values) => {
      if (step < 3) {
        setStep(step + 1);
        formik.setTouched({});
      } else {
        try {
          await registerCourse(values);
        } catch (err) {
          console.error("Error submitting form:", err);
        }
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setStep(4);
      toast.success("Enquiry submitted successfully!");
    }
    if (error) {
      if ("data" in error) {
        toast.error(error.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
      formik.setTouched({});
    } else {
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, type: "spring", bounce: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const renderProgress = () => (
    <div className="w-full mb-12 max-w-2xl mx-auto">
      <div className="flex justify-between text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">
        <span className={step >= 1 ? "text-primary" : ""}>01. Identity</span>
        <span className={step >= 2 ? "text-primary" : ""}>02. Contact</span>
        <span className={step >= 3 ? "text-primary" : ""}>03. Program</span>
      </div>
      <div className="w-full h-3 bg-[#0F172A] rounded-full overflow-hidden border border-white/5 shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-poppins selection:bg-primary/30 flex flex-col">
      <Heading title="Enroll | Kairaa Academy" description="Start your Web3 journey today." keywords="enquiry, enroll, blockchain" />
      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
      
      <main className="flex-grow pt-[100px] pb-20 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-[100%] blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none -z-10" />
        
        {/* Animated Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,242,254,0.8)] pointer-events-none -z-10"
            animate={{
              y: ["0vh", "100vh"],
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
            style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
          />
        ))}

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 text-primary text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,254,0.1)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Admissions Open
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Web3 Legacy</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
              Secure your spot in the most comprehensive blockchain engineering bootcamps. Our advisors will guide you through the enrollment process.
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
            
            {/* LEFT SIDE: FORM */}
            <div className="w-full lg:w-3/5">
              <div className="bg-[#0B1120] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                
                {step < 4 && renderProgress()}

                {step === 4 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
                    <Confetti width={1200} height={800} recycle={false} numberOfPieces={600} colors={['#00f2fe', '#4facfe', '#050810', '#ffffff']} />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }} className="w-32 h-32 bg-primary/10 border-2 border-primary text-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,242,254,0.3)]">
                      <FiCheckCircle size={64} />
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-white mb-6">Application Received!</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                      Your journey has officially begun. An academic advisor will reach out within 24 hours to schedule your interview.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                      <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-[#050810] py-4 px-8 rounded-xl font-extrabold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-lg text-lg">
                        <FaWhatsapp size={24} /> Fast Track via WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={formik.handleSubmit} className="flex-grow flex flex-col relative z-10">
                    <AnimatePresence mode="wait">
                      
                      {step === 1 && (
                        <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow flex flex-col justify-center space-y-8">
                          <div>
                            <h3 className="text-3xl font-extrabold text-white mb-2">Who are we speaking with?</h3>
                            <p className="text-slate-400">Please provide your legal name as it should appear on your certificate.</p>
                          </div>
                          <div className="relative group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Full Legal Name <span className="text-red-500">*</span></label>
                            <input
                              type="text" name="firstName" placeholder="e.g. Satoshi Nakamoto"
                              value={values.firstName} onChange={handleChange} onBlur={handleBlur}
                              className={`w-full bg-[#050810] border ${errors.firstName && touched.firstName ? "border-red-500" : values.firstName && !errors.firstName ? "border-primary" : "border-white/10"} text-white text-xl px-6 py-6 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner`}
                            />
                            {values.firstName && !errors.firstName && touched.firstName && <FiCheck className="absolute right-6 top-[54px] text-primary" size={24} />}
                            {errors.firstName && touched.firstName && <p className="text-red-500 text-sm mt-3 font-bold">{errors.firstName}</p>}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow flex flex-col justify-center space-y-8">
                          <div>
                            <h3 className="text-3xl font-extrabold text-white mb-2">How can we reach you?</h3>
                            <p className="text-slate-400">We'll use these to send your interview link and course materials.</p>
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Email Address <span className="text-red-500">*</span></label>
                            <input
                              type="email" name="email" placeholder="satoshi@bitcoin.org"
                              value={values.email} onChange={handleChange} onBlur={handleBlur}
                              className={`w-full bg-[#050810] border ${errors.email && touched.email ? "border-red-500" : values.email && !errors.email ? "border-primary" : "border-white/10"} text-white text-xl px-6 py-6 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner`}
                            />
                            {errors.email && touched.email && <p className="text-red-500 text-sm mt-3 font-bold">{errors.email}</p>}
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Mobile Number <span className="text-red-500">*</span></label>
                            <div className="flex">
                              <span className="flex items-center justify-center bg-white/5 border border-r-0 border-white/10 rounded-l-2xl px-6 text-slate-400 font-bold text-xl">+91</span>
                              <input
                                type="number" name="phoneNumber" placeholder="9876543210"
                                value={values.phoneNumber} onChange={handleChange} onBlur={handleBlur}
                                className={`w-full bg-[#050810] border ${errors.phoneNumber && touched.phoneNumber ? "border-red-500" : values.phoneNumber && !errors.phoneNumber ? "border-primary" : "border-white/10"} text-white text-xl px-6 py-6 rounded-r-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner`}
                              />
                            </div>
                            {errors.phoneNumber && touched.phoneNumber && <p className="text-red-500 text-sm mt-3 font-bold">{errors.phoneNumber}</p>}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow flex flex-col justify-center space-y-6">
                          <div>
                            <h3 className="text-3xl font-extrabold text-white mb-2">Select Your Path</h3>
                            <p className="text-slate-400">Choose the program that aligns with your career goals.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {coursesList.map((c) => (
                              <div 
                                key={c.id} 
                                onClick={() => setFieldValue("course", c.id)}
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                                  values.course === c.id 
                                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,242,254,0.15)] transform scale-[1.02]" 
                                  : "border-white/5 bg-[#050810] hover:border-white/20 hover:bg-white/5"
                                }`}
                              >
                                <div className="flex flex-col h-full justify-between gap-4">
                                  <div className={`p-4 rounded-xl w-fit ${values.course === c.id ? "bg-primary text-[#050810]" : "bg-white/5 text-slate-300"}`}>
                                    {c.icon}
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-white mb-2 leading-tight">{c.name}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                      <span className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> {c.duration}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                      <span className={c.level === "Expert" ? "text-accent" : "text-primary"}>{c.level}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {errors.course && touched.course && <p className="text-red-500 text-sm font-bold">{errors.course}</p>}

                          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mt-6 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Next Cohort Deadline</p>
                              <p className="text-xl font-black text-red-400 font-mono tracking-widest">{formatTime(timeLeft)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Seats Remaining</p>
                              <p className="text-xl font-black text-red-400 animate-pulse">12 / 30</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex gap-4 pt-8 border-t border-white/5">
                      {step > 1 && (
                        <button type="button" onClick={handleBack} className="px-8 py-5 rounded-xl font-extrabold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center group">
                          <FiArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                      )}
                      
                      {step < 3 ? (
                        <button type="button" onClick={handleNext} className="flex-1 py-5 bg-white text-[#050810] hover:bg-slate-200 rounded-xl font-extrabold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] text-lg">
                          Continue to next step <FiArrowRight size={20} />
                        </button>
                      ) : (
                        <button type="submit" disabled={isLoading} className="flex-1 py-5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 text-[#050810] rounded-xl font-extrabold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_30px_rgba(0,242,254,0.4)] text-lg">
                          {isLoading ? "Processing..." : "Submit Application"}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: PREMIUM INFO PANEL */}
            <div className="w-full lg:w-2/5">
              <div className="bg-gradient-to-br from-[#0B1120] to-[#050810] border border-white/10 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
                
                <div className="relative z-10 mb-12">
                  <h3 className="text-3xl font-extrabold text-white mb-10 leading-tight">
                    Why Top Companies Hire Our Graduates
                  </h3>
                  
                  <div className="space-y-8">
                    {[
                      { icon: <FiUsers size={28} className="text-primary" />, title: "Elite Network", desc: "Join 1000+ alumni at top Web3 firms" },
                      { icon: <FiStar size={28} className="text-yellow-400" />, title: "Expert Mentorship", desc: "Learn directly from senior protocol engineers" },
                      { icon: <FiBriefcase size={28} className="text-accent" />, title: "Guaranteed Interviews", desc: "With our 50+ hiring partners worldwide" },
                      { icon: <FiBox size={28} className="text-purple-400" />, title: "Production Portfolio", desc: "Build real dApps deployed to mainnet" }
                    ].map((feature, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.3 }}
                        key={i} className="flex items-start gap-6 group"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          {feature.icon}
                        </div>
                        <div className="pt-2">
                          <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                          <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex -space-x-4">
                      {[1,2,3,4,5].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Alumni" className="w-14 h-14 rounded-full border-4 border-[#0B1120]" />
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex text-yellow-500 mb-1">
                        <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                      </div>
                      <span className="text-sm font-bold text-slate-300">4.9/5 Average Rating</span>
                    </div>
                  </div>
                  <p className="text-lg text-slate-400 italic">
                    "The curriculum is directly aligned with what Web3 companies are looking for today. Best investment in my career."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EnquiryPage;
