import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { FiEdit2, FiFileText, FiRefreshCw, FiCheckCircle, FiClock, FiArchive, FiImage } from "react-icons/fi";
import Loader from "../Loader/Loader.js";
import { format } from "timeago.js";
import { styles } from "../../styles/style.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
  useGetBlogAnalyticsQuery,
  useUpdateBlogStatusMutation
} from "../../redux/features/blog/blogApi.js";

const AllBlogs = () => {
  const [blogId, setBlogId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const { data, isLoading, refetch } = useGetAllBlogsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: analyticsData, refetch: refetchAnalytics } = useGetBlogAnalyticsQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteBlog, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteError }] = useDeleteBlogMutation();
  const [updateBlogStatus] = useUpdateBlogStatusMutation();

  const handleDelete = async () => {
    await deleteBlog(blogId);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await updateBlogStatus({ id, status: newStatus }).unwrap();
      toast.success(`Blog marked as ${newStatus}`);
      refetch();
      refetchAnalytics();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      refetchAnalytics();
      setOpenDelete(false);
      toast.success("Blog deleted successfully!");
    }
    if (deleteError) {
      toast.error(typeof (deleteError?.data?.message || "Delete failed") === "string" ? (deleteError?.data?.message || "Delete failed") : JSON.stringify(deleteError?.data?.message || "Delete failed") || "An error occurred");
    }
  }, [deleteSuccess, deleteError, deleteLoading, refetch, refetchAnalytics]);

  const blogs = data?.blogs || [];
  const filteredBlogs = activeTab === "All" ? blogs : blogs.filter(b => (b.status || "Draft") === activeTab);

  const getStatusIcon = (status) => {
    if (status === "Published") return <FiCheckCircle className="text-success" />;
    if (status === "Archived") return <FiArchive className="text-slate-400" />;
    return <FiClock className="text-warning" />;
  };

  const getStatusColor = (status) => {
    if (status === "Published") return "bg-success/20 text-success border-success/30 shadow-[0_0_10px_rgba(76,175,80,0.3)]";
    if (status === "Archived") return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    return "bg-warning/20 text-warning border-warning/30 shadow-[0_0_10px_rgba(255,193,7,0.3)]";
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* KPI Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-panel px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <FiFileText className="text-primary" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Blogs</span>
            <span className="text-2xl font-extrabold text-white leading-none block drop-shadow-md">{analyticsData?.analytics?.totalBlogs || 0}</span>
          </div>
        </div>

        <div className="glass-panel px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center border border-success/30 shadow-[0_0_15px_rgba(76,175,80,0.3)]">
            <FiCheckCircle className="text-success" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Published</span>
            <span className="text-2xl font-extrabold text-white leading-none block drop-shadow-md">{analyticsData?.analytics?.publishedBlogs || 0}</span>
          </div>
        </div>

        <div className="glass-panel px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center border border-warning/30 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
            <AiOutlineEye className="text-warning" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Views</span>
            <span className="text-2xl font-extrabold text-white leading-none block drop-shadow-md">{analyticsData?.analytics?.totalViews || 0}</span>
          </div>
        </div>

        <div className="glass-panel px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center border border-danger/30 shadow-[0_0_15px_rgba(255,23,68,0.3)]">
            <AiOutlineHeart className="text-danger" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Likes</span>
            <span className="text-2xl font-extrabold text-white leading-none block drop-shadow-md">{analyticsData?.analytics?.totalLikes || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs and Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-max">
          {["All", "Published", "Draft", "Archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? "bg-primary text-slate-900 shadow-[0_0_10px_rgba(0,242,254,0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => { refetch(); refetchAnalytics(); }}
          className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
        >
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {/* Blog Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-white/5 rounded-xl border border-white/10">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBlogs.map((blog) => {
                const status = blog.status || "Draft";
                return (
                  <motion.div
                    key={blog._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel border border-white/10 rounded-2xl overflow-hidden group flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="h-48 relative overflow-hidden bg-slate-800">
                      {blog.image?.url ? (
                        <img 
                          src={blog.image.url} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 border-b border-white/5">
                          <FiImage size={40} className="opacity-50" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        {status}
                      </div>

                      {/* Category Badge */}
                      {blog.category && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold border border-white/20 uppercase tracking-wider">
                          {blog.category}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                        {blog.description}
                      </p>

                      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mt-auto pt-4 border-t border-white/5">
                        <span>{format(blog.createdAt)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><AiOutlineEye size={14} className="text-warning"/> {blog.views || 0}</span>
                          <span className="flex items-center gap-1"><AiOutlineHeart size={14} className="text-danger"/> {blog.likes || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Actions Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleStatusToggle(blog._id, status)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                          status === "Published" 
                            ? "bg-warning/20 text-warning border-warning/30 hover:bg-warning hover:text-slate-900" 
                            : "bg-success/20 text-success border-success/30 hover:bg-success hover:text-slate-900"
                        }`}
                      >
                        {status === "Published" ? "Unpublish" : "Publish"}
                      </button>

                      <Link 
                        to={`/admin/edit-blog/${blog._id}`}
                        className="w-8 h-8 rounded bg-primary/20 hover:bg-primary text-primary hover:text-slate-900 flex items-center justify-center transition-all border border-primary/30"
                        title="Edit Blog"
                      >
                        <FiEdit2 size={14} />
                      </Link>

                      <button 
                        onClick={() => {
                          setBlogId(blog._id);
                          setOpenDelete(true);
                        }}
                        className="w-8 h-8 rounded bg-danger/20 hover:bg-danger text-danger hover:text-white flex items-center justify-center transition-all border border-danger/30"
                        title="Delete Blog"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      {openDelete && (
        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
          <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] bg-surface border border-slate-600 rounded-2xl shadow-2xl p-6">
            <h1 className={`${styles.title} text-white`}>
              Delete Blog?
            </h1>
            <p className="text-slate-400 text-center mt-2">This action cannot be undone.</p>
            <div className="flex w-full items-center justify-evenly mb-2 mt-6 gap-4">
              <div
                className={`${styles.button} bg-white/10 text-white hover:bg-white/20 rounded-full border border-slate-600`}
                onClick={() => setOpenDelete(false)}
              >
                Cancel
              </div>
              <div
                className={`${styles.button} bg-danger/20 text-danger border border-danger/50 shadow-[0_0_10px_rgba(255,23,68,0.2)] hover:bg-danger hover:text-white rounded-full`}
                onClick={handleDelete}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AllBlogs;
