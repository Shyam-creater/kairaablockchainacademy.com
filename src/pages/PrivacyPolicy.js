import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Heading from "../components/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiShield, FiLock, FiDatabase, FiUserCheck, FiGlobe, FiMail, FiArrowRight } from "react-icons/fi";

function PrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  const [activeSection, setActiveSection] = useState("collection");
  const navigate = useNavigate();

  // Scroll spy effect for sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["collection", "security", "third-party", "rights", "jurisdiction"];
      let current = "collection";
      
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
      id: "collection",
      icon: <FiDatabase />,
      title: "Information Collection",
      tldr: "We only collect what we absolutely need to provide you with a world-class educational experience.",
      content: [
        "Kairaa Blockchain Academy is committed to ensuring the utmost privacy and security of your personal data. We collect information explicitly provided by you during registration, including but not limited to your name, email address, phone number, and educational background.",
        "Furthermore, our platform automatically gathers telemetry data, such as IP addresses, browser types, and usage patterns, utilizing secure cookies to enhance your learning experience, optimize platform performance, and deliver personalized course recommendations."
      ]
    },
    {
      id: "security",
      icon: <FiShield />,
      title: "Data Security Architecture",
      tldr: "Your data is encrypted at rest and in transit using military-grade AES-256 protocols.",
      content: [
        "Safeguarding your data is our highest priority. All personal and financial data transmitted through our platform is secured using industry-standard AES-256 encryption protocols and SSL/TLS secure channels.",
        "We employ strict Role-Based Access Control (RBAC) mechanisms within our organization. Only authorized personnel have access to your data, strictly limited to what is necessary for academic support and administrative functions. Regular third-party security audits are conducted to ensure compliance."
      ]
    },
    {
      id: "third-party",
      icon: <FiGlobe />,
      title: "Third-Party Gateways",
      tldr: "We never sell your data. Financial data is handled exclusively by PCI-DSS compliant partners.",
      content: [
        "Kairaa Blockchain Academy does not store your credit card or sensitive banking details on our servers. All financial transactions are processed exclusively through certified, PCI-DSS compliant third-party payment gateways (e.g., Stripe, Razorpay).",
        "We may share minimal required data with our secure educational and infrastructure partners (such as AWS and MongoDB) solely for the purpose of facilitating your coursework, managing certifications, and maintaining platform uptime. We unequivocally do not sell, rent, or trade your personal data to external marketers."
      ]
    },
    {
      id: "rights",
      icon: <FiUserCheck />,
      title: "User Rights & Control",
      tldr: "You own your data. You can export it, modify it, or permanently delete it at any time.",
      content: [
        "Under applicable data protection laws (including GDPR frameworks), you retain complete sovereignty over your personal data. You reserve the right to request access to, modification of, or the permanent deletion of your personal records from our database.",
        "To enforce a 'Right to be Forgotten' or to opt-out of promotional communications (DND Policy), you may utilize the settings dashboard in your student portal or submit a formal request to our compliance department. We guarantee compliance with such requests within legally mandated timeframes."
      ]
    },
    {
      id: "jurisdiction",
      icon: <FiLock />,
      title: "Modifications & Jurisdiction",
      tldr: "We operate under the legal frameworks of India. Major policy changes will be emailed to you.",
      content: [
        "Kairaa Blockchain Academy reserves the right to modify, amend, or update this Privacy Policy to reflect changes in our operational practices or regulatory frameworks. Material changes will be communicated to active students via email no less than 30 days prior to implementation.",
        "Continued use of the platform following modifications constitutes your explicit acceptance of the revised policy. This agreement is governed by the laws of India, and any disputes shall fall under its exclusive jurisdiction."
      ]
    }
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-poppins text-slate-300 bg-[#050810] selection:bg-primary/30">
      <Heading 
        title="Privacy Policy | Kairaa Blockchain Academy" 
        description="Comprehensive privacy policy outlining data protection, security measures, and user rights." 
        keywords="privacy policy, data protection, security, blockchain academy" 
      />
      
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />

      <main>
        {/* =========================================
            SECTION 1: PREMIUM SAAS HERO
        ========================================= */}
        <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden border-b border-white/5 pt-24 pb-20 bg-[#050810]">
          {/* Abstract Linear-style Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
          
          {/* Animated Background Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,254,0.8)] pointer-events-none"
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
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Legal Hub
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            >
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-purple-500">Policy.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-6"
            >
              We believe that true decentralization starts with respecting individual privacy. This document outlines exactly how we collect, secure, and respect your data.
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
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={activeSection === section.id ? "text-primary" : "text-slate-500"}>
                          {section.icon}
                        </span>
                        {section.title}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-4">Need help understanding our policies?</p>
                    <a href="mailto:privacy@kairaaacademy.com" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                      Contact Privacy Team <FiArrowRight size={14} />
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
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-primary shadow-[0_0_15px_rgba(0,242,254,0.05)]">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* TLDR Summary Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 flex items-start gap-4">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded mt-0.5">TL;DR</span>
                      <p className="text-sm font-medium text-primary/90">{section.tldr}</p>
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
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Data Protection Officer</h3>
                      <p className="text-slate-400">Reach out to our global compliance team 24/7.</p>
                    </div>
                    <a href="mailto:support@kairaaacademy.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#050810] font-extrabold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap">
                      <FiMail /> support@kairaaacademy.com
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

export default PrivacyPolicy;
