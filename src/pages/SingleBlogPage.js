import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetAllBlogsQuery } from "../redux/features/blog/blogApi";
import Loader from "../components/Loader/Loader";
import { FiCalendar, FiTag, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

const SingleBlogPage = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const { data, isLoading } = useGetAllBlogsQuery();
  const blogs = data?.blogs || [];
  
  const blog = blogs.find((b) => b._id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 font-sans">
        <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-4 font-headingFont">Blog Not Found</h2>
          <p className="text-neutral-500 mb-8 max-w-md">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            <FiArrowLeft size={18} />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans overflow-x-hidden flex flex-col">
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <main className="flex-1 pt-8 pb-20">
        {/* Back Button & Breadcrumb */}
        <div className="container mx-auto max-w-4xl px-4 md:px-8 mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to all articles
          </Link>
        </div>

        <article className="container mx-auto max-w-4xl px-4 md:px-8">
          {/* Header Section */}
          <header className="mb-10 text-center">
            {blog.category && (
              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
                {blog.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 font-headingFont leading-tight mb-8">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-neutral-500 border-y border-neutral-200 py-4 mb-10">
              {blog.createdAt && (
                <span className="flex items-center gap-2">
                  <FiCalendar className="text-primary-500" size={16} />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {blog.tags && (
                <span className="flex items-center gap-2">
                  <FiTag className="text-primary-500" size={16} />
                  {blog.tags}
                </span>
              )}
            </div>
          </header>

          {/* Hero Image */}
          {blog.image?.url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl mb-14 border border-neutral-100"
            >
              <img
                src={blog.image.url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-neutral-100"
          >
            {/* Description (Intro) */}
            {blog.description && (
              <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed mb-10 pb-10 border-b border-neutral-100 italic">
                {blog.description}
              </p>
            )}

            {/* Main Content Body */}
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-700 leading-loose font-medium">
              {blog.content?.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : null
              ))}
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default SingleBlogPage;
