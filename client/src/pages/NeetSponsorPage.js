import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiPhone, FiInfo, FiStar } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SERVER_URI = process.env.REACT_APP_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1';

const NeetSponsorPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  
  // State for highlighted students
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    reason: ''
  });
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHighlightedStudents();
  }, []);

  const fetchHighlightedStudents = async () => {
    try {
      const res = await fetch(`${SERVER_URI}/sponsor-requests/highlighted`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.requests);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) setImageFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contactNumber || !formData.reason) {
      return alert("Please fill in all required fields.");
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${SERVER_URI}/sponsor-requests/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl: imageFileUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert("Your request has been submitted successfully! Admins will review it soon.");
        setShowForm(false);
        setFormData({ name: '', email: '', contactNumber: '', reason: '' });
        setImageFileUrl('');
      } else {
        alert(data.message || "Failed to submit request.");
      }
    } catch (err) {
      alert("Error submitting request. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-[#0B0F19] font-poppins text-slate-300">
      <Header open={open} setOpen={setOpen} activeItem={0} setRoute={setRoute} route={route} />
      
      <div className="pt-[120px] pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent"
          >
            NEET & Sponsorships
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Empowering future medical professionals by connecting passionate students with generous sponsors.
          </motion.p>
        </div>

        {/* Content Section: About NEET & Sponsors */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#111827] border border-white/10 rounded-3xl p-8 hover:border-primary/50 transition-colors shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="p-3 bg-primary/10 text-primary rounded-xl"><FiInfo /></span>
              About NEET Access
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-lg">
              Our comprehensive NEET Question Bank provides thousands of highly curated practice questions, mock exams, and past papers. We believe that access to premium medical preparation materials should be driven by merit, not just financial capability.
            </p>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-primary font-bold">Cost: ₹10 per Question Bank</p>
              <p className="text-sm text-slate-400 mt-1">Select your preferred year and subject in the student dashboard, then pay ₹10 to instantly unlock and download that specific question bank.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-colors shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><FiStar /></span>
              Sponsorship Ideas
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-lg">
              Make a tangible difference in a student's life. By browsing the profiles below, you can choose a deserving student and fund their NEET preparation. You deal directly with the student, providing them the funds needed to unlock their portal.
            </p>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-2">✓ Read their personal stories</li>
              <li className="flex items-center gap-2">✓ Contact them directly via phone</li>
              <li className="flex items-center gap-2">✓ Empower the next generation of doctors</li>
            </ul>
          </motion.div>
        </div>

        {/* Highlighted Students Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Students Looking For Sponsors</h2>
            <p className="text-slate-400">Reach out directly to these ambitious students and help them achieve their dreams.</p>
          </div>

          {loading ? (
            <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : students.length === 0 ? (
            <div className="bg-[#111827] border border-white/10 p-10 text-center rounded-2xl">
              <p className="text-gray-400 text-lg">No students are currently highlighted for sponsorship. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student._id} className="bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-white/10 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    {student.imageUrl ? (
                      <img src={student.imageUrl} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">{student.name}</h3>
                      <p className="text-xs text-primary font-bold lowercase tracking-wider">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl mb-6 relative">
                    <div className="absolute -top-3 left-4 bg-[#111827] px-2 text-xs font-bold text-slate-400 uppercase">Their Story</div>
                    <p className="text-sm text-slate-300 leading-relaxed italic">"{student.reason}"</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FiPhone className="text-green-400" />
                      <span className="font-mono text-sm">{student.contactNumber}</span>
                    </div>
                    <a href={`tel:${student.contactNumber}`} className="px-4 py-2 bg-green-500/10 text-green-400 font-bold text-sm rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action for Students */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/5 border border-primary/30 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Are you a student in need?</h3>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              If you require financial assistance to access our premium NEET Question Bank, submit your details. Your profile may be highlighted here for generous sponsors to find you.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-primary text-black text-lg font-extrabold rounded-full shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:scale-105 transition-all"
            >
              Request a Sponsor
            </button>
          </div>
        </motion.div>

      </div>
      <Footer />

      {/* Sponsor Request Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-[#111827] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                <FiX size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Submit Sponsorship Request</h2>
              <p className="text-slate-400 mb-8">Tell us why you need access to the NEET Question Bank.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="student@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Number <span className="text-red-500">*</span></label>
                  <input required type="tel" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="+91 9876543210" />
                  <p className="text-xs text-slate-500 mt-1">This will be visible to potential sponsors.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Profile Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {imageFileUrl && <img src={imageFileUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-white/20" />}
                    <label className="flex-1 cursor-pointer border-2 border-dashed border-white/20 hover:border-primary/50 bg-[#050810] rounded-xl p-4 text-center transition-colors">
                      <FiUpload className="mx-auto mb-2 text-slate-400" size={24} />
                      <span className="text-sm text-slate-400">Click to upload an image</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Reason for Sponsorship <span className="text-red-500">*</span></label>
                  <textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows="4" className="w-full bg-[#050810] border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Explain your financial situation and your goals for clearing NEET..."></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={submitting} className="w-full bg-primary text-black font-extrabold py-4 rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                    {submitting ? 'Submitting Request...' : 'Submit Request'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Also define missing FiStar in framer-motion imports if needed
// Actually, add FiStar to react-icons/fi import
export default NeetSponsorPage;
