import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiEye, FiArrowRight, FiTag, FiSearch, FiMail, FiUser } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { useGetAllBlogsQuery } from "../redux/features/blog/blogApi";
import Loader from "../components/Loader/Loader";

const BlogPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllBlogsQuery({}, { refetchOnMountOrArgChange: true });
  const blogs = data?.blogs || [];

  // MOCK DATA for Layout Structure
  const categories = ["All", "Smart Contracts", "Career Advice", "Academy News", "Blockchain Basics", "DeFi", "Web3"];
  
  const trendingBlogs = blogs.slice(0, 3); // Simulate trending
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const feedBlogs = blogs.slice(1);

  const authors = [
    { name: "Dr. Sarah Jenkins", role: "Lead Protocol Researcher", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { name: "David Chen", role: "Smart Contract Auditor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { name: "Priya Sharma", role: "DeFi Architect", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" }
  ];

  const topics = ["Ethereum", "Solidity", "Rust", "Zero Knowledge", "Career Growth", "Interview Prep", "Hackathons", "Tokenomics"];

  const calculateReadTime = (text) => {
    if(!text) return "3 min read";
    const words = text.split(" ").length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const carouselRef = useRef(null);

  // Auto-scroll the Trending Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 3000); // scrolls every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] overflow-x-hidden font-poppins text-slate-300 selection:bg-primary/30">
      <Heading
        title="Knowledge Hub | Kairaa Blockchain Academy"
        description="Insights, tutorials, and career advice for the Web3 generation."
        keywords="blockchain blog, web3 articles, smart contract tutorial, career advice"
      />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main>
        {/* 1. HERO KNOWLEDGE HUB */}
        <section className="relative pt-12 pb-16 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full mb-4"
                >
                  The Kairaa Publication
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight"
                >
                  Insights & Knowledge.<br />Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Web3.</span>
                </motion.h1>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full md:w-72"
              >
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full bg-[#0B1120] border border-white/10 text-white text-sm rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
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
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-32 flex justify-center"><Loader /></div>
        ) : (
          <>
            {/* 2. FEATURED ARTICLE SECTION */}
            {featuredBlog && (
              <section className="py-12 border-b border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}
                    onClick={() => navigate(`/blogs/${featuredBlog._id}`)}
                    className="group relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  >
                    <img 
                      src={featuredBlog.image?.url || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=2000"} 
                      alt={featuredBlog.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-accent text-[#050810] text-[10px] font-bold uppercase tracking-wider rounded-md">Featured</span>
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">{featuredBlog.category || "Academy"}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-300 font-medium"><FiClock /> {calculateReadTime(featuredBlog.description)}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-300 font-medium"><FiEye /> {(Math.floor(Math.random() * 5000) + 500).toLocaleString()} Views</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight group-hover:text-primary transition-colors">{featuredBlog.title}</h2>
                        <p className="text-base md:text-lg text-slate-300 line-clamp-2 max-w-2xl">{featuredBlog.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/20">
                          <FiUser className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Author</p>
                          <p className="text-sm font-bold text-white">Kairaa Editorial</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            )}

            {/* 3. TRENDING ARTICLES CAROUSEL */}
            <section className="py-20 border-b border-white/5 bg-[#0B1120]">
              <div className="container mx-auto px-6 max-w-7xl mb-10">
                <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5 }} className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Trending Now
                </motion.h2>
              </div>
              <div 
                ref={carouselRef}
                className="flex gap-6 px-6 pb-8 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <div className="w-[calc((100vw-80rem)/2)] shrink-0 hidden xl:block" />
                
                {trendingBlogs.map((blog, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                    key={blog._id || idx} 
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                    className="w-[300px] md:w-[400px] shrink-0 snap-center group cursor-pointer"
                  >
                    <div className="w-full h-[250px] rounded-2xl overflow-hidden relative mb-5 shadow-lg border border-white/10">
                      <img 
                        src={blog.image?.url || `https://images.unsplash.com/photo-${1500000000000 + idx}?auto=format&fit=crop&q=80&w=800`} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded">
                        #{idx + 1} Trending
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                      <span className="text-primary">{blog.category || "Tech"}</span>
                      <span>•</span>
                      <span>{calculateReadTime(blog.description)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                  </motion.div>
                ))}
                
                <div className="w-6 shrink-0" />
              </div>
            </section>

            {/* 4. EDITORIAL MAGAZINE LAYOUT & SIDEBAR */}
            <section className="py-24">
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  
                  {/* Left: Feed */}
                  <div className="lg:col-span-8 space-y-12">
                    <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.5 }} className="text-3xl font-extrabold text-white tracking-tight mb-8 border-b border-white/10 pb-4">Latest Stories</motion.h2>
                    
                    {feedBlogs.map((blog, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: idx * 0.1 }}
                        key={blog._id} 
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="group flex flex-col md:flex-row gap-8 items-start cursor-pointer border-b border-white/5 pb-12 last:border-0"
                      >
                        <div className="w-full md:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/10 shrink-0">
                          <img 
                            src={blog.image?.url || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800"} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-3">
                            <span className="text-primary">{blog.category || "Ecosystem"}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">{calculateReadTime(blog.description)}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors">{blog.title}</h3>
                          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6">{blog.description}</p>
                          
                          <div className="mt-auto flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center"><FiUser size={10} className="text-slate-400" /></div>
                              <span className="text-xs font-medium text-slate-300">Kairaa Team</span>
                            </div>
                            <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read Story <FiArrowRight size={14}/></span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {feedBlogs.length === 0 && (
                      <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-slate-400">No articles found in this category.</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Sidebar */}
                  <div className="lg:col-span-4 space-y-16">
                    
                    {/* Topic Cloud */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6 }}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Popular Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition-colors">
                            <FiTag className="inline mr-1 text-primary" size={10} /> {topic}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Expert Authors Showcase */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Meet the Experts</h3>
                      <div className="space-y-4">
                        {authors.map((author, idx) => (
                          <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                            <img src={author.img} alt={author.name} className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-primary transition-colors" />
                            <div>
                              <h4 className="text-white font-bold text-sm group-hover:text-primary transition-colors">{author.name}</h4>
                              <p className="text-xs text-slate-500">{author.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Recommended Read */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                      <span className="bg-primary text-[#050810] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-4 inline-block">Must Read</span>
                      <h4 className="text-lg font-bold text-white mb-2">The 2024 State of Smart Contract Security</h4>
                      <p className="text-xs text-slate-400 mb-6 leading-relaxed">A comprehensive analysis of recent vulnerabilities and how to audit against them.</p>
                      <button className="w-full py-2 bg-white text-[#050810] text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">Read Report</button>
                    </motion.div>

                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;