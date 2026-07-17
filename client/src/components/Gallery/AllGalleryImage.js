import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { AiOutlineDelete, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiEdit2, FiImage, FiRefreshCw, FiFilter, FiMaximize2 } from "react-icons/fi";
import Loader from "../Loader/Loader.js";
import { format } from "timeago.js";
import { styles } from "../../styles/style.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAllGalleryImageQuery,
  useDeleteGalleryImageMutation,
  useGetGalleryAlbumsQuery,
  useUpdateGalleryFeaturedMutation
} from "../../redux/features/gallery/galleryApi.js";

const AllGalleryImage = () => {
  const [imageId, setImageId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);

  const { data, isLoading, refetch } = useGetAllGalleryImageQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { data: albumsData } = useGetGalleryAlbumsQuery({}, { refetchOnMountOrArgChange: true });
  const albums = ["All", ...(albumsData?.albums || [])];

  const [deleteGalleryImage, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteError }] = useDeleteGalleryImageMutation();
  const [updateGalleryFeatured] = useUpdateGalleryFeaturedMutation();

  const handleDelete = async () => {
    await deleteGalleryImage(imageId);
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await updateGalleryFeatured({ id, isFeatured: !currentStatus });
      toast.success(currentStatus ? "Removed from featured" : "Marked as featured");
      refetch();
    } catch (err) {
      toast.error("Failed to update featured status");
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpenDelete(false);
      toast.success("Image deleted successfully!");
    }
    if (deleteError) {
      toast.error(typeof (deleteError?.data?.message || "Delete failed") === "string" ? (deleteError?.data?.message || "Delete failed") : JSON.stringify(deleteError?.data?.message || "Delete failed") || "An error occurred");
    }
  }, [deleteSuccess, deleteError, deleteLoading, refetch]);

  const images = data?.images || [];
  const filteredImages = activeAlbum === "All" ? images : images.filter(img => img.album === activeAlbum);

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex gap-4">
          <div className="glass-panel px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <FiImage className="text-primary" size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">Total Images</span>
              <span className="text-xl font-extrabold text-white leading-none block drop-shadow-md">{images.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Album Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2"
      >
        <FiFilter className="text-slate-500 mr-2" />
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeAlbum === album 
                ? "bg-primary text-slate-900 shadow-[0_0_15px_rgba(0,242,254,0.4)]" 
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {album}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-white/5 rounded-xl border border-white/10">
            No images found in this album.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filteredImages.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="break-inside-avoid relative group rounded-xl overflow-hidden glass-panel border border-white/10"
                >
                  <img 
                    src={item.image?.url} 
                    alt={item.name} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Featured Badge */}
                  {item.isFeatured && (
                    <div className="absolute top-2 left-2 bg-warning/90 text-slate-900 px-2 py-1 rounded text-xs font-bold shadow-[0_0_10px_rgba(255,193,7,0.8)] flex items-center gap-1">
                      <AiFillStar size={12} /> Featured
                    </div>
                  )}

                  {/* Album Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white/90 px-2 py-1 rounded text-[10px] font-bold border border-white/20 uppercase tracking-wider">
                    {item.album}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">{item.name}</h3>
                    <p className="text-slate-300 text-xs mt-1 truncate">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setLightboxImage(item.image?.url)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          title="View Fullscreen"
                        >
                          <FiMaximize2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleToggleFeatured(item._id, item.isFeatured)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-warning transition-colors"
                          title={item.isFeatured ? "Remove Featured" : "Mark Featured"}
                        >
                          {item.isFeatured ? <AiFillStar size={16} /> : <AiOutlineStar size={16} />}
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          to={`/admin/edit-gallery-image/${item._id}`}
                          className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/40 text-primary flex items-center justify-center transition-colors border border-primary/30"
                        >
                          <FiEdit2 size={14} />
                        </Link>
                        <button 
                          onClick={() => {
                            setImageId(item._id);
                            setOpenDelete(true);
                          }}
                          className="w-8 h-8 rounded-full bg-danger/20 hover:bg-danger/40 text-danger flex items-center justify-center transition-colors border border-danger/30"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      {openDelete && (
        <Modal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
        >
          <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] bg-surface border border-slate-600 rounded-2xl shadow-2xl p-6">
            <h1 className={`${styles.title} text-white`}>
              Delete Image?
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage} 
              alt="Fullscreen" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllGalleryImage;
