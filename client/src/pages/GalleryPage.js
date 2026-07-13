import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiX, FiArrowRight, FiMapPin, FiCalendar, FiStar, FiAward, FiPlayCircle } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { useGetAllGalleryImageQuery } from "../redux/features/gallery/galleryApi";
import Loader from "../components/Loader/Loader";
import { branchDetails } from "../utils/branchDetails.js";

const GalleryPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Filters State
  const [activeCategory, setActiveCategory] = useState("All Experiences");
  const [activeBranchId, setActiveBranchId] = useState(branchDetails[0]?.id);

  // Fetch Gallery Images
  const { data, isLoading } = useGetAllGalleryImageQuery();
  const apiImages = data?.images || [];

  // MOCK DATA for Layout Showcase
  const categories = ["All Experiences", "Hackathons", "Workshops", "Campus Life", "Graduations", "Bootcamps"];
  
  const achievements = [
    { title: "EthIndia Finalists", desc: "Our team built a decentralized identity protocol in 48 hours.", img: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=800" },
    { title: "Polygon Grant Winners", desc: "Secured $10k funding for a student-built DApp.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800" },
    { title: "100% Placement Batch", desc: "The Advanced Smart Contract cohort achieved total placement.", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" },
    { title: "Web3 Summit Speakers", desc: "Two alumni presented their thesis at the Dubai Web3 Summit.", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" }
  ];

  const timeline = [
    { year: "2021", title: "The Inception", desc: "Kairaa Blockchain Academy was founded with our first campus in Chennai." },
    { year: "2022", title: "Pan-India Expansion", desc: "Opened 5 new state-of-the-art blockchain labs across South India." },
    { year: "2023", title: "10,000+ Alumni", desc: "Reached a major milestone of graduating over ten thousand students." },
    { year: "2024", title: "Global Partnerships", desc: "Partnered with leading L1 ecosystems for direct placement pipelines." }
  ];

  return (
    <div className="min-h-screen bg-[#050810] overflow-x-hidden font-poppins text-slate-300 selection:bg-primary/30">
      <Heading
        title="Experience Showcase | Kairaa Blockchain Academy"
        description="A visual journey through our academy's events, achievements, and campuses."
        keywords="blockchain gallery, kairaa events, hackathons, web3 campus"
      />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main>
        {/* 1. CINEMATIC HERO & FEATURED STORY */}
        <section className="relative pt-12 pb-20 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          
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

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                The Kairaa Experience
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
              >
                More than an Academy.<br />A <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Movement.</span>
              </motion.h1>
            </div>

            {/* Featured Event Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000" 
                alt="Featured Event" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary text-[#050810] text-xs font-bold uppercase tracking-wider rounded-md">Featured Story</span>
                    <span className="flex items-center gap-1 text-sm text-slate-300 font-medium"><FiCalendar /> Oct 2024</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Web3 Global Summit: Shaping the Future.</h2>
                  <p className="text-lg text-slate-300">Over 500+ students, 20+ industry leaders, and 48 hours of relentless building at our flagship annual summit.</p>
                </div>
                <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#050810] transition-colors shrink-0">
                  <FiPlayCircle size={32} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. DYNAMIC MASONRY GALLERY (API INTEGRATION) */}
        <section className="py-24 border-b border-white/5 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">The Gallery</h2>
              
              {/* Event Collections Filter */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-white text-[#050810]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : apiImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-3xl border border-white/10">
                <FiImage size={48} className="text-slate-600 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Experiences Loading...</h3>
                <p className="text-slate-400">We are curating our best moments for this collection.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {apiImages.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
                    key={item._id || index}
                    onClick={() => setSelectedImage(item)}
                    className="relative group overflow-hidden rounded-2xl bg-white/5 cursor-pointer break-inside-avoid border border-white/10"
                  >
                    <img
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      src={item?.image?.url}
                      alt={item?.tags || "Gallery Moment"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/90 via-[#050810]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      {item.tags && (
                        <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider w-fit mb-2 rounded-md">
                          {item.tags}
                        </div>
                      )}
                      <p className="text-white font-medium text-sm leading-snug line-clamp-3">
                        {item.description || "A glimpse into our academy's vibrant learning environment."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>



        {/* 4. BRANCH-WISE EXPLORER & TIMELINE */}
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              
              {/* Left: Branch Explorer */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8">Campus Views</h2>
                
                {/* Branch Selection List */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {branchDetails.slice(0, 5).map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => setActiveBranchId(branch.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeBranchId === branch.id
                          ? 'bg-primary text-[#050810]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <FiMapPin className="inline mr-1" /> {branch.city}
                    </button>
                  ))}
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                    +4 More
                  </button>
                </div>

                {/* Simulated Branch Gallery */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeBranchId}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="h-48 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" alt="Lab" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="h-48 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                      <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" alt="Students" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="col-span-2 h-40 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                      <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Seminar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white text-[#050810] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">View Campus Gallery <FiArrowRight/></span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Right: Academy Timeline */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-12">Our Journey</h2>
                
                <div className="relative border-l border-white/10 ml-4 space-y-12 pb-4">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-10 group cursor-default">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#050810] border-2 border-white/20 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300" />
                      <div className="text-primary font-bold text-sm mb-1">{event.year}</div>
                      <h4 className="text-xl font-extrabold text-white mb-2">{event.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{event.desc}</p>
                    </div>
                  ))}
                  {/* Fading line bottom */}
                  <div className="absolute bottom-0 -left-[1px] w-[2px] h-20 bg-gradient-to-t from-[#050810] to-transparent" />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} className="container mx-auto px-6 text-center max-w-4xl">
            <FiStar size={40} className="mx-auto text-[#050810] mb-6" />
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#050810] mb-6 tracking-tight">Ready to join the gallery?</h2>
            <p className="text-xl text-slate-600 mb-10 font-medium">Become a part of our next success story. Enroll in an upcoming cohort today.</p>
            <button className="px-10 py-4 bg-[#050810] text-white font-extrabold text-lg rounded-xl hover:bg-[#0B1120] hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto">
              Explore Programs <FiArrowRight />
            </button>
          </motion.div>
        </section>

      </main>

      {/* 5. ORIGINAL LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-3 transition-all z-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <FiX size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center cursor-default rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage?.image?.url}
                alt={selectedImage?.tags || "Gallery Full View"}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
              {selectedImage?.description && (
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#050810]/95 via-[#050810]/40 to-transparent text-center">
                  {selectedImage?.tags && (
                    <span className="inline-block bg-primary text-[#050810] text-[10px] font-bold uppercase tracking-wider px-3 py-1 mb-2 rounded-full">
                      {selectedImage.tags}
                    </span>
                  )}
                  <h3 className="text-white font-medium text-sm md:text-base leading-snug max-w-3xl mx-auto">
                    {selectedImage.description}
                  </h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;
