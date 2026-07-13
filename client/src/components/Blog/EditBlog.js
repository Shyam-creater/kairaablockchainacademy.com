import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useEditBlogMutation, useGetAllBlogsQuery } from "../../redux/features/blog/blogApi.js";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import Loader from "../Loader/Loader.js";

const EditBlog = () => {
  const { id } = useParams();
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const { data: blogData, isLoading: isFetching } = useGetAllBlogsQuery({}, { refetchOnMountOrArgChange: true });
  
  const [editBlog, { isSuccess, error, isLoading }] = useEditBlogMutation();
  
  const [blogInfo, setBlogInfo] = useState({
    title: "",
    category: "",
    tags: "",
    description: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (blogData && blogData.blogs) {
      const currentBlog = blogData.blogs.find((b) => b._id === id);
      if (currentBlog) {
        setBlogInfo({
          title: currentBlog.title || "",
          category: currentBlog.category || "",
          tags: currentBlog.tags || "",
          description: currentBlog.description || "",
          content: currentBlog.content || "",
          image: currentBlog.image?.url || "",
        });
      }
    }
  }, [blogData, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = blogInfo;
    await editBlog({ id, data });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog updated successfully!");
      navigate("/admin/manage-blogs");
    }

    if (error) {
      if ("data" in error) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to update blog");
      }
    }
  }, [isSuccess, error, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file.size > maxSize) {
      toast.error("File size exceeds 10 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBlogInfo({ ...blogInfo, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 10 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBlogInfo({ ...blogInfo, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto my-auto"
    >
      <h2 className="font-bold py-4 text-2xl text-gray-800">Edit Blog Post</h2>
      <p className="text-gray-500 mb-6 text-sm">Update the details or replace the cover image for this blog post.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="e.g., The Future of Blockchain"
            value={blogInfo.title}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            onChange={(e) =>
              setBlogInfo({ ...blogInfo, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              required
              placeholder="e.g., Technology"
              value={blogInfo.category}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              onChange={(e) =>
                setBlogInfo({ ...blogInfo, category: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              placeholder="e.g., Web3, Crypto"
              value={blogInfo.tags}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              onChange={(e) =>
                setBlogInfo({ ...blogInfo, tags: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            placeholder="Provide a brief summary..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
            value={blogInfo.description}
            onChange={(e) =>
              setBlogInfo({ ...blogInfo, description: e.target.value })
            }
          ></textarea>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Full Content
          </label>
          <textarea
            id="content"
            required
            rows={8}
            placeholder="Write the full blog post content here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
            value={blogInfo.content}
            onChange={(e) =>
              setBlogInfo({ ...blogInfo, content: e.target.value })
            }
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Update Cover Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[200px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {blogInfo.image ? (
              <img
                src={blogInfo.image}
                alt="Preview"
                className="max-h-[250px] w-full object-contain p-2 rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                <FiUploadCloud size={40} className="mb-3 text-gray-400" />
                <span className="font-medium text-sm">Click to upload or drag and drop new media</span>
                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</span>
              </div>
            )}
          </label>
        </div>

        <div className="w-full flex items-center justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-blogs")}
            className="px-6 py-2.5 font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-2.5 font-bold text-white rounded-md transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
            }`}
          >
            {isLoading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditBlog;
