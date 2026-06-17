import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { useGetAllGalleryImageQuery } from "../redux/features/gallery/galleryApi";
import Loader from "../components/Loader/Loader";
import { FiImage, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const GalleryPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading } = useGetAllGalleryImageQuery();
  const images = data?.images;

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden font-sans">
      <Heading
        title="Gallery | Kairaa Blockchain Academy"
        description="Explore the highlights, events, and achievements of Kairaa Blockchain Academy."
        keywords="blockchain course, gallery, events, academy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />

      {/* ── Hero Section — same pattern as Contact & Blog ── */}
      <section className="bg-white py-20 lg:py-28 border-b border-neutral-200">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <span className="inline-block bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Moments & Milestones
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 font-headingFont">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Gallery
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed max-w-2xl mx-auto">
            A glimpse into our world of blockchain mastery, professional events,
            and academic excellence.
          </p>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="container mx-auto max-w-7xl px-4 md:px-8 py-14 mb-10">
        {isLoading ? (
          <Loader />
        ) : !images || images.length === 0 ? (
          /* ── Empty / Coming Soon State ── */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-20 scale-150" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                <FiImage size={40} className="text-primary-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 font-headingFont mb-3">
              Gallery Coming Soon
            </h3>
            <p className="text-neutral-500 max-w-sm text-base leading-relaxed">
              We're curating our finest moments. Check back soon to explore
              events, workshops, and achievements from Kairaa Blockchain Academy.
            </p>
            <div className="mt-8 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-300 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : (
          /* ── Masonry Grid ── */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => setSelectedImage(item)}
                className="relative group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-neutral-100 cursor-pointer break-inside-avoid rounded-none"
              >
                {/* Image */}
                <img
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src={item?.image?.url}
                  alt={item?.tags || "Gallery Image"}
                />

                {/* Dark Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-none" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  {item.tags && (
                    <div className="bg-primary-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider w-fit mb-3 rounded-sm">
                      {item.tags}
                    </div>
                  )}
                  <h3 className="text-white font-medium font-headingFont leading-relaxed text-lg md:text-xl line-clamp-2">
                    {item.description}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <FiX size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage?.image?.url}
                alt={selectedImage?.tags || "Gallery Full View"}
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
              />
              {selectedImage?.description && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center">
                  {selectedImage?.tags && (
                    <span className="inline-block bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 mb-2 rounded-sm">
                      {selectedImage.tags}
                    </span>
                  )}
                  <h3 className="text-white font-medium text-lg md:text-xl font-headingFont">
                    {selectedImage.description}
                  </h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;

