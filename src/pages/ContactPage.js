import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiArrowRight, FiCheckCircle, FiVideo, FiLinkedin, FiArrowLeft
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { branchDetails } from "../utils/branchDetails.js";
import Map1 from "../components/Map.js";

const ContactPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  
  // Multi-Step Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", goal: "", email: "", phone: "" });

  // Branch Explorer State
  const [activeBranch, setActiveBranch] = useState(branchDetails[0]);

  // Network Map Coordinates (Abstract representation for 9 branches)
  const networkNodes = [
    { ...branchDetails[0], top: '20%', left: '70%' },  // Chennai
    { ...branchDetails[1], top: '50%', left: '55%' },  // Trichy
    { ...branchDetails[2], top: '75%', left: '50%' },  // Madurai
    { ...branchDetails[3], top: '85%', left: '45%' },  // Tirunelveli
    { ...branchDetails[4], top: '25%', left: '60%' },  // Vellore
    { ...branchDetails[5], top: '45%', left: '40%' },  // Salem
    { ...branchDetails[6], top: '55%', left: '25%' },  // Coimbatore
    { ...branchDetails[7], top: '70%', left: '15%' },  // Thrissur
    { ...branchDetails[8], top: '35%', left: '65%' },  // Chittoor
  ];

  return (
    <div className="overflow-x-hidden min-h-screen bg-[#050810] font-poppins text-slate-300 selection:bg-primary/30">
      <Heading
        title="Command Center | Kairaa Blockchain Academy"
        description="Connect with our global network, meet our advisors, and launch your Web3 career."
        keywords="blockchain consultation, career advice web3, kairaa network"
      />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main>
        {/* HERO & CONTACT HUB */}
        <section className="relative min-h-[85vh] flex flex-col justify-center pt-8 pb-12 overflow-hidden border-b border-white/5">
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

          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-4 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-xs font-bold text-slate-300 tracking-widest uppercase"
            >
              Contact Command Center
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
            >
              Connect with <br />
              the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Network.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Whether you're looking to launch a career, hire elite developers, or partner with us—our command center is your direct line to the academy.
            </motion.p>
          </div>

          {/* Contact Hub Grid (Overlapping Bottom) */}
          <div className="container mx-auto px-6 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
            >
              <a href="tel:+917092774077" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-xl flex flex-col items-start h-full">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all"><FiPhone size={18} /></div>
                <h3 className="text-white font-bold mb-1">Direct Call</h3>
                <p className="text-xs text-slate-400 mb-4">Speak to an advisor instantly.</p>
                <div className="mt-auto text-sm font-medium text-slate-300 group-hover:text-white transition-colors">+91 70927 74077</div>
              </a>
              <a href="https://wa.me/917092774077" target="_blank" rel="noreferrer" className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 hover:border-[#25D366]/50 transition-all group backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col items-start h-full">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-6 group-hover:scale-110 transition-transform"><FaWhatsapp size={20} /></div>
                <h3 className="text-white font-bold mb-1">WhatsApp Hub</h3>
                <p className="text-xs text-slate-400 mb-4">Quick replies and course brochures.</p>
                <div className="mt-auto text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">Chat Now <FiArrowRight /></div>
              </a>
              <a href="#" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-xl flex flex-col items-start h-full">
                <div className="w-10 h-10 rounded-full bg-[#2D8CFF]/20 flex items-center justify-center text-[#2D8CFF] mb-6 group-hover:scale-110 transition-transform"><FiVideo size={18} /></div>
                <h3 className="text-white font-bold mb-1">Video Meeting</h3>
                <p className="text-xs text-slate-400 mb-4">Schedule a 1-on-1 Zoom call.</p>
                <div className="mt-auto text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">Book Slot <FiCalendar /></div>
              </a>
              <a href="mailto:support@kairaaacademy.com" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-xl flex flex-col items-start h-full">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all"><FiMail size={18} /></div>
                <h3 className="text-white font-bold mb-1">Email Support</h3>
                <p className="text-xs text-slate-400 mb-4">Detailed inquiries and partnerships.</p>
                <div className="mt-auto text-sm font-medium text-slate-300 group-hover:text-white transition-colors">support@kairaaacademy.com</div>
              </a>
            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE BRANCH EXPLORER */}
        <section className="py-32 border-b border-white/5 relative overflow-hidden bg-[#020408]">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">South India Network</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Click on any node to explore our physical academy locations and state-of-the-art blockchain labs.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Interactive Original Map */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }} className="relative w-full h-[500px] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10">
                <Map1 onBranchSelect={(id) => {
                  const branch = branchDetails.find(b => b.id === id);
                  if (branch) setActiveBranch(branch);
                }} />
              </motion.div>

              {/* Right: Dynamic Branch Panel */}
              <div className="h-full flex flex-col justify-center">

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeBranch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <FiMapPin size={120} />
                    </div>
                    
                    <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full mb-6">
                      Physical Academy
                    </div>
                    <h3 className="text-4xl font-extrabold text-white mb-6 tracking-tight">{activeBranch.city} Hub</h3>
                    
                    <div className="space-y-6 mb-10">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-slate-400"><FiMapPin /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                          <p className="text-sm text-slate-300 leading-relaxed max-w-[280px]">{activeBranch.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-slate-400"><FiCalendar /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Working Hours</p>
                          <p className="text-sm text-slate-300">Mon - Sat: 10:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>

                    <a href={`https://maps.google.com/?q=${activeBranch.address}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#050810] font-bold rounded-xl hover:bg-slate-200 transition-colors">
                      Get Directions <FiArrowRight />
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* CONVERSATIONAL FORM & ADVISORS */}
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              
              {/* Left: Conversational Form */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Let's craft your journey.</h2>
                <p className="text-slate-400 mb-12">Skip the generic forms. Tell us exactly what you need, and we'll route you to the right expert.</p>

                <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                  {/* Progress Bar */}
                  <div className="flex gap-2 mb-10">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                  </div>

                  <div className="min-h-[250px]">
                    <AnimatePresence mode="wait">
                      
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <h3 className="text-2xl font-bold text-white mb-6">Hello! What's your name?</h3>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Type your full name..." 
                            className="w-full bg-transparent border-b-2 border-white/20 text-3xl text-white pb-4 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-700" 
                            autoFocus
                          />
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <h3 className="text-2xl font-bold text-white mb-6">Nice to meet you, {formData.name || 'friend'}.<br/>What are you looking for?</h3>
                          <div className="flex flex-col gap-3">
                            {['I want to start a Web3 career', 'I want to upskill my team', 'I want to hire graduates'].map((goal) => (
                              <button 
                                key={goal}
                                onClick={() => setFormData({...formData, goal: goal})}
                                className={`p-4 text-left rounded-xl border transition-all font-medium ${
                                  formData.goal === goal 
                                    ? 'bg-primary/10 border-primary text-white' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {goal}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <h3 className="text-2xl font-bold text-white mb-6">Got it. Where should we reach you?</h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                              <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="name@example.com" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                              <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+91 98765 43210" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" 
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-[250px]">
                          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-success mb-6"><FiCheckCircle size={32} /></div>
                          <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                          <p className="text-slate-400">An advisor will be in touch with you shortly.</p>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons */}
                  {step < 4 && (
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                      <button 
                        onClick={() => setStep(step > 1 ? step - 1 : 1)}
                        className={`p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                      >
                        <FiArrowLeft />
                      </button>
                      
                      <button 
                        onClick={() => setStep(step + 1)}
                        className="px-8 py-3 bg-white text-[#050810] font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
                      >
                        {step === 3 ? 'Submit Request' : 'Continue'} <FiArrowRight />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right: Meet Your Advisors */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Meet your team.</h2>
                <p className="text-slate-400 mb-12">Behind every successful student is a team of dedicated experts guiding them.</p>

                <div className="space-y-4">
                  {[
                    { name: 'Sarah Jenkins', role: 'Senior Career Advisor', exp: 'Guides you through course selection and career mapping.', classes: 'bg-primary/20 border-primary/30 text-primary' },
                    { name: 'David Chen', role: 'Lead Blockchain Mentor', exp: 'Technical support and project architecture guidance.', classes: 'bg-accent/20 border-accent/30 text-accent' },
                    { name: 'Priya Sharma', role: 'Placement Coordinator', exp: 'Connects you with hiring partners and handles interviews.', classes: 'bg-success/20 border-success/30 text-success' }
                  ].map((advisor, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className={`w-16 h-16 rounded-full border flex items-center justify-center shrink-0 ${advisor.classes}`}>
                        {/* Avatar Placeholder */}
                        <span className="font-bold text-xl">{advisor.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{advisor.name}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{advisor.role}</p>
                        <p className="text-sm text-slate-400">{advisor.exp}</p>
                      </div>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                        <FiLinkedin />
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#050810] mb-6 tracking-tight">Ready to build the future?</h2>
            <p className="text-xl text-slate-600 mb-10 font-medium">Join thousands of students and developers mastering Web3 technologies.</p>
            <button className="px-10 py-4 bg-[#050810] text-white font-extrabold text-lg rounded-xl hover:bg-[#0B1120] hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto">
              Start Your Application <FiArrowRight />
            </button>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
