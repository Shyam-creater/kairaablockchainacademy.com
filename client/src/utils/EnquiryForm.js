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

const coursesList = [
  { id: "Blockchain Developer Fundamentals", name: "Blockchain Fundamentals", duration: "8 Weeks", level: "Beginner", icon: <FiBox className="text-2xl" /> },
  { id: "Blockchain Developer Professional", name: "Solidity Development", duration: "12 Weeks", level: "Intermediate", icon: <FiCode className="text-2xl" /> },
  { id: "Blockchain Developer Expert", name: "Smart Contract Engineering", duration: "16 Weeks", level: "Advanced", icon: <FiLink className="text-2xl" /> },
  { id: "Certified Blockchain Trainer", name: "Blockchain Trainer Program", duration: "24 Weeks", level: "Expert", icon: <FiAward className="text-2xl" /> }
];

const EnquiryForm = ({ setOpen }) => {
  const [step, setStep] = useState(1);
  const [registerCourse, { isSuccess, error, isLoading }] = useRegisterCourseMutation();
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds

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
      firstName: Yup.string().required("Please enter your name"),
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
      setStep(4); // Success step
    }
    if (error) {
      if ("data" in error) {
        toast.error(typeof (error.data.message) === "string" ? (error.data.message) : JSON.stringify(error.data.message) || "An error occurred");
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

  // Variants for step animations
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const renderProgress = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between text-[10px] sm:text-xs font-bold text-muted mb-2 uppercase tracking-wider font-poppins">
        <span>Details</span>
        <span>Contact</span>
        <span>Course</span>
      </div>
      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl bg-surface rounded-3xl overflow-hidden shadow-glass flex flex-col md:flex-row relative z-10 border border-muted/10 font-poppins text-text">
      
      {/* SUCCESS STATE - Full Overlap */}
      {step === 4 && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col items-center justify-center p-8 text-center">
          <Confetti width={1000} height={800} recycle={false} numberOfPieces={500} colors={['#00f2fe', '#8B5CF6', '#fe0979', '#00e676']} />
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 bg-success-500/10 text-success-500 rounded-full flex items-center justify-center mb-6 shadow-md"
          >
            <FiCheckCircle size={48} />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-extrabold text-text mb-4 tracking-tight font-headingFont">
            Demo Session Reserved!
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted text-lg mb-8 max-w-md">
            Your learning advisor will contact you shortly. In the meantime, connect with us instantly on WhatsApp.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1">
              <FaWhatsapp size={20} /> Connect WhatsApp
            </a>
            <button onClick={() => {if(setOpen) setOpen(false)}} className="flex-1 bg-background hover:bg-sidebar text-text py-4 rounded-xl font-bold transition-all border border-muted/20 hover:border-primary-500/50">
              Explore Courses
            </button>
          </motion.div>
        </div>
      )}

      {/* LEFT SIDE: FORM */}
      <div className="w-full md:w-[60%] p-6 sm:p-8 md:p-12 relative flex flex-col justify-center min-h-[500px]">
        {/* Animated Gradient background subtle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-warning-500/10 border border-warning-500/20 text-warning-500 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            🔥 Limited Seats Available
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight leading-tight mb-2 font-headingFont">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Blockchain</span> Career
          </h2>
          <p className="text-muted font-medium text-sm sm:text-base">Join 1000+ developers shaping the future of Web3.</p>
        </div>

        {renderProgress()}

        <form onSubmit={formik.handleSubmit} className="flex-1 relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-text mb-2">Full Name <span className="text-danger-500">*</span></label>
                  <input
                    type="text" name="firstName" placeholder="John Doe"
                    value={values.firstName} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-5 py-4 rounded-xl border bg-background/50 backdrop-blur-sm text-text placeholder-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.firstName && touched.firstName ? "border-danger-500 focus:ring-danger-500/20" : values.firstName && !errors.firstName ? "border-success-500 focus:ring-success-500/20" : "border-muted/20 focus:ring-primary-500/20 focus:border-primary-500"
                    }`}
                  />
                  {values.firstName && !errors.firstName && touched.firstName && <FiCheck className="absolute right-5 top-[46px] text-success-500" size={20} />}
                  {errors.firstName && touched.firstName && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-danger-500 text-xs mt-2 font-bold">{errors.firstName}</motion.p>}
                </div>

            
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-text mb-2">Email Address <span className="text-danger-500">*</span></label>
                  <input
                    type="email" name="email" placeholder="john@example.com"
                    value={values.email} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-5 py-4 rounded-xl border bg-background/50 backdrop-blur-sm text-text placeholder-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email && touched.email ? "border-danger-500 focus:ring-danger-500/20" : values.email && !errors.email ? "border-success-500 focus:ring-success-500/20" : "border-muted/20 focus:ring-primary-500/20 focus:border-primary-500"
                    }`}
                  />
                  {errors.email && touched.email && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-danger-500 text-xs mt-2 font-bold">{errors.email}</motion.p>}
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-text mb-2">Mobile Number <span className="text-danger-500">*</span></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-muted/20 bg-background text-muted font-bold">+91</span>
                    <input
                      type="number" name="phoneNumber" placeholder="9876543210"
                      value={values.phoneNumber} onChange={handleChange} onBlur={handleBlur}
                      className={`w-full px-5 py-4 rounded-r-xl border bg-background/50 backdrop-blur-sm text-text placeholder-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.phoneNumber && touched.phoneNumber ? "border-danger-500 focus:ring-danger-500/20" : values.phoneNumber && !errors.phoneNumber ? "border-success-500 focus:ring-success-500/20" : "border-muted/20 focus:ring-primary-500/20 focus:border-primary-500"
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-danger-500 text-xs mt-2 font-bold">{errors.phoneNumber}</motion.p>}
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <label className="block text-sm font-bold text-text mb-2">Select Your Path <span className="text-danger-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {coursesList.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setFieldValue("course", c.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                        values.course === c.id 
                        ? "border-primary-500 bg-primary-500/10 shadow-md" 
                        : "border-muted/10 bg-background hover:border-primary-500/50 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${values.course === c.id ? "bg-primary-500 text-background" : "bg-surface text-muted"}`}>
                          {c.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-text leading-tight mb-1">{c.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase">
                            <span className="flex items-center gap-1"><FiClock /> {c.duration}</span>
                            <span>•</span>
                            <span className={c.level === "Expert" ? "text-accent-400" : "text-primary-400"}>{c.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => setFieldValue("course", "Other Courses")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                      values.course === "Other Courses" ? "border-primary-500 bg-primary-500/10 shadow-md" : "border-muted/10 bg-background hover:border-primary-500/50 hover:bg-surface"
                    }`}
                  >
                    <h4 className="font-bold text-sm text-text text-center mt-2">Other Courses</h4>
                  </div>
                </div>
                {errors.course && touched.course && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-danger-500 text-xs mt-2 font-bold">{errors.course}</motion.p>}

                {/* Urgency Block */}
                <div className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-4 mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-danger-500 uppercase tracking-wider mb-1">Next Batch Starts In</p>
                    <p className="text-base sm:text-lg font-black text-danger-400 font-mono tracking-widest">{formatTime(timeLeft)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-danger-500 uppercase tracking-wider mb-1">Seats Left</p>
                    <p className="text-base sm:text-lg font-black text-danger-400 animate-pulse">12 / 30</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Form Actions */}
          <div className="mt-8 flex gap-4 pt-4 border-t border-muted/10">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-5 sm:px-6 py-4 rounded-xl font-bold text-text bg-background hover:bg-muted/20 border border-muted/20 transition-colors flex items-center justify-center">
                <FiArrowLeft size={20} />
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="flex-1 py-4 bg-primary-500 hover:bg-primary-600 text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:-translate-y-1 transition-all shadow-md">
                Continue <FiArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-70 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:-translate-y-1 transition-all shadow-xl text-sm sm:text-base">
                {isLoading ? "Processing..." : "Reserve Your Seat Now"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* RIGHT SIDE: LIVE TRUST PANEL */}
      <div className="hidden md:flex w-[40%] bg-sidebar text-text p-12 flex-col justify-between relative overflow-hidden border-l border-muted/10">
        {/* Background Network Graphic */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-2xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-300 font-headingFont">
            Why Choose Kairaa?
          </h3>
          
          <div className="space-y-6">
            {[
              { icon: <FiUsers className="text-primary-400" size={24} />, title: "Learners Network", val: 1200, suff: "+" },
              { icon: <FiStar className="text-warning-400" size={24} />, title: "Expert Mentors", val: 50, suff: "+" },
              { icon: <FiVideo className="text-success-400" size={24} />, title: "Live Instructor Sessions", fixed: true },
              { icon: <FiBriefcase className="text-accent-400" size={24} />, title: "Placement Assistance", fixed: true }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.5 }}
                key={i} className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-muted/20 flex items-center justify-center shrink-0 shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-text leading-tight">
                    {feature.fixed ? feature.title : (
                      <><CountUp end={feature.val} duration={2} />{feature.suff} {feature.title.split(' ')[0]}</>
                    )}
                  </h4>
                  {!feature.fixed && <p className="text-sm text-muted">{feature.title.split(' ').slice(1).join(' ')}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Proof Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="relative z-10 mt-12 pt-8 border-t border-muted/10">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" className="w-10 h-10 rounded-full border-2 border-surface" />
              ))}
            </div>
            <div className="flex text-warning-400 text-sm">
              <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted">
            "The curriculum is directly aligned with what Web3 companies are looking for today."
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default EnquiryForm;
