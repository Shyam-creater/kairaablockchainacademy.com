import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Heading from "../components/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiBookOpen, FiAlertTriangle, FiLock, FiCreditCard, FiAlertOctagon, FiArrowRight, FiFileText } from "react-icons/fi";

function Terms_and_cond() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  const [activeSection, setActiveSection] = useState("acceptance");
  const navigate = useNavigate();

  // Scroll spy effect for sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["acceptance", "integrity", "ip-rights", "payments", "liability"];
      let current = "acceptance";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth"
      });
    }
  };

  const sections = [
    {
      id: "acceptance",
      icon: <FiBookOpen />,
      title: "Acceptance of Terms",
      tldr: "By using our platform, you agree to follow our rules. If you disagree, please do not use the service.",
      content: [
        "By accessing, browsing, or registering for courses at Kairaa Blockchain Academy, you explicitly agree to comply with and be bound by the following Terms & Conditions. This constitutes a legally binding agreement between you ('the Student' or 'the User') and Kairaa Blockchain Academy.",
        "If you do not agree with any part of these terms, you must immediately cease the use of our platform, services, and educational materials. We reserve the right to suspend accounts that violate these core agreements."
      ]
    },
    {
      id: "integrity",
      icon: <FiAlertTriangle />,
      title: "Academic Integrity & Conduct",
      tldr: "Cheating, plagiarism, and harassment will result in immediate expulsion.",
      content: [
        "Students are expected to maintain the highest standards of academic integrity. Plagiarism, unauthorized sharing of proprietary course materials, or the use of automated bots to manipulate attendance or quiz results will result in immediate expulsion without refund.",
        "Disruptive behavior, harassment, or unprofessional conduct during live Zoom sessions or within community forums will not be tolerated. We maintain a zero-tolerance policy for abuse against mentors, staff, or fellow students."
      ]
    },
    {
      id: "ip-rights",
      icon: <FiLock />,
      title: "Intellectual Property Rights",
      tldr: "Our courses are for your personal use only. You cannot pirate, resell, or distribute them.",
      content: [
        "All course content, including but not limited to video lectures, PDF notes, project repositories, source code templates, and UI designs, are the exclusive intellectual property of Kairaa Blockchain Academy.",
        "You are granted a limited, non-exclusive, non-transferable license to access these materials strictly for personal educational purposes. Redistributing, reselling, or publicly broadcasting our materials is strictly prohibited and actionable under international copyright laws."
      ]
    },
    {
      id: "payments",
      icon: <FiCreditCard />,
      title: "Payments, Fees & Refunds",
      tldr: "All sales are final once course material is accessed. Fraudulent chargebacks will be contested.",
      content: [
        "All tuition fees are quoted in Indian Rupees (INR) unless otherwise specified. Payment must be successfully processed prior to gaining access to premium courses or mentor-assigned batches.",
        "Given the digital nature of our comprehensive curriculum and immediate access to proprietary resources, Kairaa Blockchain Academy strictly adheres to a 'No Refund' policy once a course has been accessed. In exceptional circumstances, refunds may be issued solely at the discretion of the Management Board.",
        "Fraudulent chargebacks or disputes filed after completing course materials will be vigorously contested and may result in the permanent revocation of previously issued blockchain certificates."
      ]
    },
    {
      id: "liability",
      icon: <FiAlertOctagon />,
      title: "Limitation of Liability",
      tldr: "We provide education, not a guarantee of employment. We are not liable for platform downtimes.",
      content: [
        "While we provide world-class education and direct placement support via our hiring partners, Kairaa Blockchain Academy does not guarantee immediate employment, specific salary packages, or financial outcomes resulting from our programs.",
        "Under no circumstances shall Kairaa Blockchain Academy, its directors, or mentors be held liable for any indirect, incidental, or consequential damages arising from server downtimes, unannounced maintenance, or your inability to access the platform temporarily."
      ]
    }
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-poppins text-slate-300 bg-[#050810] selection:bg-accent/30">
      <Heading 
        title="Terms & Conditions | Kairaa Blockchain Academy" 
        description="Official terms of service, academic guidelines, and payment policies." 
        keywords="terms and conditions, user agreement, blockchain academy, policy" 
      />
      
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />

      <main>
        {/* =========================================
            SECTION 1: PREMIUM SAAS HERO
        ========================================= */}
        <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden border-b border-white/5 pt-24 pb-20 bg-[#050810]">
          {/* Abstract Linear-style Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-accent/10 rounded-[100%] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          
          {/* Animated Background Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)] pointer-events-none"
              animate={{
                y: ["0vh", "100vh"],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{ left: `${Math.random() * 100}%`, top: '-10%' }}
            />
          ))}
          
          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-xs font-bold text-slate-300 tracking-widest uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Legal Hub
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            >
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-primary">Service.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-6"
            >
              Our Terms of Service establish the professional standards, academic integrity, and operational guidelines that power our global learning ecosystem.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="text-sm text-slate-500 font-mono"
            >
              Effective Date: January 1, 2026 • Version 2.4.0
            </motion.p>
          </div>
        </section>

        {/* =========================================
            SECTION 2: SAAS GRID LAYOUT (SIDEBAR + CONTENT)
        ========================================= */}
        <section className="py-16 relative bg-[#050810]">
          <div className="container mx-auto px-6 max-w-7xl relative z-20">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* LEFT SIDEBAR: Sticky TOC */}
              <div className="lg:w-1/4 hidden lg:block">
                <div className="sticky top-32 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">On this page</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                          activeSection === section.id 
                            ? "bg-accent/10 text-accent border border-accent/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={activeSection === section.id ? "text-accent" : "text-slate-500"}>
                          {section.icon}
                        </span>
                        {section.title}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-4">Require legal clarification?</p>
                    <a href="mailto:legal@kairaaacademy.com" className="text-sm text-accent font-bold hover:underline flex items-center gap-1">
                      Contact Legal Team <FiArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Content Sections */}
              <div className="lg:w-3/4 space-y-24">
                {sections.map((section, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    key={section.id} 
                    id={section.id}
                    className="scroll-mt-32"
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-accent shadow-[0_0_15px_rgba(139,92,246,0.05)]">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* TLDR Summary Card */}
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-8 flex items-start gap-4">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded mt-0.5">TL;DR</span>
                      <p className="text-sm font-medium text-accent/90">{section.tldr}</p>
                    </div>
                    
                    {/* Legal Paragraphs */}
                    <div className="space-y-6 text-slate-400 leading-relaxed text-[17px]">
                      {section.content.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {idx !== sections.length - 1 && (
                      <div className="w-full h-px bg-white/5 mt-16" />
                    )}
                  </motion.div>
                ))}

                {/* Footer Contact Banner */}
                <div className="mt-16 bg-gradient-to-r from-[#0B1120] to-[#050810] rounded-3xl p-10 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/10 transition-colors" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Legal Support Team</h3>
                      <p className="text-slate-400">If any clause is unclear, our team is available to assist.</p>
                    </div>
                    <a href="mailto:support@kairaaacademy.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#050810] font-extrabold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap">
                      <FiFileText /> support@kairaaacademy.com
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Terms_and_cond;
