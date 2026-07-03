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
      className="w-full max-w-3xl mx-auto my-auto glass-panel p-6 800px:p-10 mb-10 mt-10 block"
    >
      <h2 className="font-bold pb-2 text-2xl text-white tracking-wide">Upload Gallery Image</h2>
      <p className="text-slate-400 mb-8 text-sm">Add a new image to your academy's gallery to showcase events, courses, or facilities.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Image Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="e.g., Annual Blockchain Seminar 2024"
            value={ImageInfo.name}
            className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, name: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="desc" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Image Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="desc"
            required
            rows={4}
            placeholder="Provide a brief description of the image content..."
            className="w-full bg-black/20 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 resize-y"
            value={ImageInfo.description}
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, description: e.target.value })
            }
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Image Tags <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="tags"
            required
            placeholder="e.g., Seminar, Event, Blockchain"
            value={ImageInfo.tags}
            className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, tags: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
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
            className={`w-full min-h-[200px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging ? "border-primary bg-primary/10" : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {ImageInfo.image ? (
              <img
                src={ImageInfo.image}
                alt="Preview"
                className="max-h-[250px] w-full object-contain p-2 rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                <FiUploadCloud size={40} className="mb-3" />
                <span className="font-medium text-sm text-white">Click to upload or drag and drop</span>
                <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</span>
              </div>
            )}
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-gallery")}
            className="h-[45px] px-8 flex items-center justify-center bg-white/5 text-white border border-slate-600 font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`h-[45px] px-8 flex items-center justify-center font-bold uppercase tracking-widest rounded-lg transition-all ${
              isLoading ? "bg-primary/10 text-primary/50 border border-primary/20 cursor-not-allowed" : "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:bg-primary hover:text-slate-900"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateGalleryImage;
