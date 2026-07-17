import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCreateBlogMutation } from "../../redux/features/blog/blogApi.js";
import { styles } from "../../styles/style.js";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX, FiFileText } from "react-icons/fi";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [createBlog, { isSuccess, error, isLoading }] = useCreateBlogMutation();
  const [dragging, setDragging] = useState(false);

  const [blogInfo, setBlogInfo] = useState({
    title: "",
    category: "",
    tags: "",
    description: "",
    content: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBlog(blogInfo);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog created successfully!");
      navigate("/admin/manage-blogs");
    }
    if (error) {
      if ("data" in error) {
        toast.error(typeof (error.data.message) === "string" ? (error.data.message) : JSON.stringify(error.data.message) || "An error occurred");
      }
    }
  }, [isSuccess, error]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBlogInfo((prev) => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBlogInfo((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-[90%] 800px:w-[80%] mx-auto mt-10 glass-panel p-6 800px:p-10 mb-10 block">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
          <FiFileText className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Create New Blog</h2>
          <p className="text-sm text-slate-400 mt-1">Fill in the details to publish a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="blog-title" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Blog Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="blog-title"
            required
            placeholder="Enter blog title"
            value={blogInfo.title}
            className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
            onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })}
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="blog-category" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Category <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="blog-category"
              required
              placeholder="e.g. Blockchain, DeFi, NFTs"
              value={blogInfo.category}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) => setBlogInfo({ ...blogInfo, category: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="blog-tags" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Tags
            </label>
            <input
              type="text"
              id="blog-tags"
              placeholder="e.g. Web3, Crypto, Smart Contracts"
              value={blogInfo.tags}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) => setBlogInfo({ ...blogInfo, tags: e.target.value })}
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="blog-description" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Short Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="blog-description"
            required
            rows={3}
            placeholder="Brief summary shown on the blog card (max 200 chars)"
            value={blogInfo.description}
            className="w-full bg-black/20 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 resize-y"
            onChange={(e) => setBlogInfo({ ...blogInfo, description: e.target.value })}
          />
        </div>

        {/* Full Content */}
        <div>
          <label htmlFor="blog-content" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Full Blog Content <span className="text-danger">*</span>
          </label>
          <textarea
            id="blog-content"
            required
            rows={10}
            placeholder="Write the full blog post content here..."
            value={blogInfo.content}
            className="w-full bg-black/20 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 resize-y"
            onChange={(e) => setBlogInfo({ ...blogInfo, content: e.target.value })}
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            id="blog-image"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="blog-image"
            className={`w-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging ? "border-primary bg-primary/10" : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {blogInfo.image ? (
              <div className="relative w-full h-[200px] p-2">
                <img
                  src={blogInfo.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setBlogInfo({ ...blogInfo, image: "" }); }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-danger/80 backdrop-blur text-white flex items-center justify-center hover:bg-danger transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8">
                <FiUploadCloud size={40} className="mb-3" />
                <p className="text-sm font-medium text-white mb-1">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-blogs")}
            className="h-[45px] px-8 flex items-center justify-center bg-white/5 text-white border border-slate-600 font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="h-[45px] px-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/50 font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:bg-primary hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              "Publish Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
