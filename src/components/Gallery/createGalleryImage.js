import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUploadGalleryImageMutation } from "../../redux/features/gallery/galleryApi.js";
import { styles } from "../../styles/style.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

const CreateGalleryImage = () => {
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const [UploadGalleryImagePage, { isSuccess, error, isLoading }] = useUploadGalleryImageMutation();
  
  const [ImageInfo, setImageInfo] = useState({
    name: "",
    description: "",
    tags: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ImageInfo.image) {
      toast.error("Please select an image");
      return;
    }
    const data = ImageInfo;
    await UploadGalleryImagePage(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Image uploaded successfully!");
      setImageInfo({ name: "", description: "", tags: "", image: "" });
      // navigate("/admin/gallery"); // Or wherever the list is
    }

    if (error) {
      if ("data" in error) {
        const errorMessage = error;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

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
        setImageInfo({ ...ImageInfo, image: reader.result });
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
        setImageInfo({ ...ImageInfo, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto my-auto"
    >
      <h2 className="font-bold py-4 text-2xl text-gray-800">Upload Gallery Image</h2>
      <p className="text-gray-500 mb-6 text-sm">Add a new image to your academy's gallery to showcase events, courses, or facilities.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Image Name
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="e.g., Annual Blockchain Seminar 2024"
            value={ImageInfo.name}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, name: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
            Image Description
          </label>
          <textarea
            id="desc"
            required
            rows={4}
            placeholder="Provide a brief description of the image content..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
            value={ImageInfo.description}
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, description: e.target.value })
            }
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Image Tags
          </label>
          <input
            type="text"
            id="tags"
            required
            placeholder="e.g., Seminar, Event, Blockchain"
            value={ImageInfo.tags}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, tags: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Media
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
            {ImageInfo.image ? (
              <img
                src={ImageInfo.image}
                alt="Preview"
                className="max-h-[250px] w-full object-contain p-2 rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                <FiUploadCloud size={40} className="mb-3 text-gray-400" />
                <span className="font-medium text-sm">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</span>
              </div>
            )}
          </label>
        </div>

        <div className="w-full flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-2.5 font-bold text-white rounded-md transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
            }`}
          >
            {isLoading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateGalleryImage;
