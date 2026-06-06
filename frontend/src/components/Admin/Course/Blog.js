import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, getAllBlogs, deleteBlog, updateBlog } from "../../../redux/features/blogSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../AdminSidebar.js";
import Heading from "../../Heading";
import { FiEdit2, FiTrash2, FiPlus, FiList } from "react-icons/fi";

const Blog = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await dispatch(deleteBlog(id));
        toast.success("Blog deleted successfully");
        dispatch(getAllBlogs());
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleEditBlog = (blog) => {
    setIsEditing(true);
    setEditingBlogId(blog._id);
    setActiveTab("create");
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setImage(file);
      try {
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
      } catch (error) {
        toast.error("Error processing image");
        setImage(null);
        setImagePreview("");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setIsEditing(false);
    setEditingBlogId(null);
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || (!image && !imagePreview)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsUploading(true);
      let blogData = {
        title,
        content: description,
      };

      if (image) {
        try {
          const compressedImage = await compressImage(image);
          blogData.image = compressedImage;
          
          if (isEditing) {
            await dispatch(updateBlog({ id: editingBlogId, data: blogData }));
            toast.success("Blog updated successfully");
          } else {
            await dispatch(createBlog(blogData));
            toast.success("Blog created successfully");
          }
          
          resetForm();
          setActiveTab("list");
          dispatch(getAllBlogs());
        } catch (error) {
          toast.error("Error uploading image. Please try again.");
        }
      } else {
        if (isEditing) {
          await dispatch(updateBlog({ id: editingBlogId, data: blogData }));
          toast.success("Blog updated successfully");
        } else {
          await dispatch(createBlog(blogData));
          toast.success("Blog created successfully");
        }
        
        resetForm();
        setActiveTab("list");
        dispatch(getAllBlogs());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const AddBlog = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null
    });
    const [errors, setErrors] = useState({});
    const [localImagePreview, setLocalImagePreview] = useState("");

    useEffect(() => {
      if (isEditing && editingBlogId) {
        const blogToEdit = blogs.find(blog => blog._id === editingBlogId);
        if (blogToEdit) {
          setFormData({
            title: blogToEdit.title,
            description: blogToEdit.content,
            image: null
          });
          setLocalImagePreview(blogToEdit.Image?.url || "");
        }
      }
    }, [isEditing, editingBlogId, blogs]);

    const validateForm = () => {
      const newErrors = {};
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }
      if (!isEditing && !formData.image) {
        newErrors.image = "Image is required";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }
        if (!file.type.startsWith('image/')) {
          toast.error("Please upload an image file");
          return;
        }
        setFormData(prev => ({
          ...prev,
          image: file
        }));
        if (errors.image) {
          setErrors(prev => ({
            ...prev,
            image: ""
          }));
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      try {
        setIsUploading(true);
        const blogData = {
          title: formData.title,
          content: formData.description,
        };

        if (formData.image) {
          try {
            const compressedImage = await compressImage(formData.image);
            blogData.image = compressedImage;
          } catch (error) {
            toast.error("Error processing image. Please try again.");
            setIsUploading(false);
            return;
          }
        }

        let response;
        if (isEditing) {
          response = await dispatch(updateBlog({ id: editingBlogId, data: blogData })).unwrap();
        } else {
          response = await dispatch(createBlog(blogData)).unwrap();
        }
        
        if (response.success) {
          toast.success(isEditing ? "Blog updated successfully" : "Blog created successfully");
          setFormData({
            title: "",
            description: "",
            image: null
          });
          setLocalImagePreview("");
          setIsEditing(false);
          setEditingBlogId(null);
          setActiveTab("list");
          dispatch(getAllBlogs());
        } else {
          toast.error(response.message || (isEditing ? "Failed to update blog" : "Failed to create blog"));
        }
      } catch (error) {
        console.error("Blog operation error:", error);
        toast.error(error.message || "Something went wrong");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FiPlus className="mr-2" /> {isEditing ? "Edit Blog" : "Add New Blog"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : ''
              }`}
              rows="6"
              placeholder="Enter blog description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image ? 'border-red-500' : ''
              }`}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
            {localImagePreview && (
              <div className="mt-4">
                <img
                  src={localImagePreview}
                  alt="Preview"
                  className="max-w-xs rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`flex-1 ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Blog" : "Create Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const BlogList = () => (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiList className="mr-2" /> All Blogs
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : blogs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found. Create your first blog!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={blog.Image?.url}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                  >
                    <FiEdit2 className="text-blue-600" size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="text-red-600" size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Heading
        title="Kairaa Blockchain Academy - Blog Management"
        description=""
        keywords="Blockchain,Blockchain Certification"
      />
      <div className="flex min-h-screen bg-gray-50">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] p-6">
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => {
                    setActiveTab("create");
                    if (!isEditing) resetForm();
                  }}
                  className={`${
                    activeTab === "create"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FiPlus className="mr-2" /> Add Blog
                </button>
                <button
                  onClick={() => setActiveTab("list")}
                  className={`${
                    activeTab === "list"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FiList className="mr-2" /> List Blogs
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "create" ? <AddBlog /> : <BlogList />}
        </div>
      </div>
    </div>
  );
};

export default Blog;
