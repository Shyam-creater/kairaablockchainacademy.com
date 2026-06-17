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
        toast.error(error.data.message);
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
    <div className="800px:w-[80%] w-[90%] mx-auto my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <FiFileText className="text-primary-600" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Create New Blog</h2>
          <p className="text-sm text-neutral-500">Fill in the details to publish a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="blog-title" className={`${styles.label}`}>
            Blog Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="blog-title"
            required
            placeholder="Enter blog title"
            value={blogInfo.title}
            className={`${styles.input} !rounded-lg`}
            onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })}
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="blog-category" className={`${styles.label}`}>
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="blog-category"
              required
              placeholder="e.g. Blockchain, DeFi, NFTs"
              value={blogInfo.category}
              className={`${styles.input} !rounded-lg`}
              onChange={(e) => setBlogInfo({ ...blogInfo, category: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="blog-tags" className={`${styles.label}`}>
              Tags
            </label>
            <input
              type="text"
              id="blog-tags"
              placeholder="e.g. Web3, Crypto, Smart Contracts"
              value={blogInfo.tags}
              className={`${styles.input} !rounded-lg`}
              onChange={(e) => setBlogInfo({ ...blogInfo, tags: e.target.value })}
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="blog-description" className={`${styles.label}`}>
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="blog-description"
            required
            rows={3}
            placeholder="Brief summary shown on the blog card (max 200 chars)"
            value={blogInfo.description}
            className={`${styles.input} !h-auto py-3 !rounded-lg resize-none`}
            onChange={(e) => setBlogInfo({ ...blogInfo, description: e.target.value })}
          />
        </div>

        {/* Full Content */}
        <div>
          <label htmlFor="blog-content" className={`${styles.label}`}>
            Full Blog Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="blog-content"
            required
            rows={10}
            placeholder="Write the full blog post content here..."
            value={blogInfo.content}
            className={`${styles.input} !h-auto py-3 !rounded-lg resize-none`}
            onChange={(e) => setBlogInfo({ ...blogInfo, content: e.target.value })}
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className={`${styles.label}`}>
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
            className={`mt-2 w-full min-h-[180px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              dragging
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {blogInfo.image ? (
              <div className="relative w-full h-[200px]">
                <img
                  src={blogInfo.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setBlogInfo({ ...blogInfo, image: "" }); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center p-8">
                <FiUploadCloud className="mx-auto text-neutral-400 mb-3" size={36} />
                <p className="text-sm font-semibold text-neutral-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Blog"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/manage-blogs")}
            className="px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
