import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetAllBlogsQuery } from "../redux/features/blog/blogApi";
import Loader from "../components/Loader/Loader";
import { FiCalendar, FiTag, FiArrowLeft, FiClock, FiShare2, FiTwitter, FiLinkedin } from "react-icons/fi";
import { motion } from "framer-motion";

const SingleBlogPage = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const { data, isLoading } = useGetAllBlogsQuery();
  const blogs = data?.blogs || [];
  
  const blog = blogs.find((b) => b._id === id);

  const calculateReadTime = (text) => {
    if(!text) return "5 min read";
    const words = text.split(" ").length;
    return `${Math.ceil(words / 200)} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050810] font-poppins selection:bg-primary/30">
        <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Article Not Found</h2>
          <p className="text-slate-400 mb-8 max-w-md text-lg">
            The article you are looking for does not exist or has been removed from the network.
          </p>
          <Link
            to="/blogs"
            className="flex items-center gap-2 bg-white text-[#050810] hover:bg-slate-200 px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <FiArrowLeft size={18} />
            Back to Knowledge Hub
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] font-poppins text-slate-300 overflow-x-hidden flex flex-col selection:bg-primary/30">
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main className="flex-1 pt-12 pb-24 relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none z-0" />
        
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-4xl px-6 mb-10 relative z-10">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10"
          >
            <FiArrowLeft size={16} />
            Back to Articles
          </Link>
        </div>

        <article className="container mx-auto max-w-4xl px-6 relative z-10">
          {/* Header Section */}
          <header className="mb-12 text-center">
            {blog.category && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
              >
                {blog.category}
              </motion.span>
            )}
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 tracking-tight"
            >
              {blog.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-bold uppercase tracking-wider text-slate-400 border-y border-white/10 py-5 mb-10"
            >
              {blog.createdAt && (
                <span className="flex items-center gap-2">
                  <FiCalendar className="text-primary" size={16} />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-2">
                <FiClock className="text-primary" size={16} />
                {calculateReadTime(blog.description || blog.content)}
              </span>
              {blog.tags && (
                <span className="flex items-center gap-2">
                  <FiTag className="text-primary" size={16} />
                  {blog.tags}
                </span>
              )}
            </motion.div>
          </header>

          {/* Hero Image */}
          {blog.image?.url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-16 border border-white/10 relative group"
            >
              <img
                src={blog.image.url}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-80" />
            </motion.div>
          )}

          {/* Content Body */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl relative"
          >
            {/* Description (Intro) */}
            {blog.description && (
              <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed mb-10 pb-10 border-b border-white/10 italic">
                {blog.description}
              </p>
            )}

            {/* Main Content Body */}
            <div className="text-slate-300 leading-loose text-lg space-y-6 font-light">
              {blog.content?.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="text-slate-300">{paragraph}</p> : null
              ))}
            </div>
            
            {/* Share / Author Footer */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Author" className="w-12 h-12 rounded-full border border-primary/50" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Written By</p>
                  <p className="text-white font-bold text-sm">Kairaa Editorial Team</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Share</span>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white transition-colors text-slate-400">
                  <FiTwitter size={16} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-colors text-slate-400">
                  <FiLinkedin size={16} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-slate-400 hover:text-white">
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default SingleBlogPage;
