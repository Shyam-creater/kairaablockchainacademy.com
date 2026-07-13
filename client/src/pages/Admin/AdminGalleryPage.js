
import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import Heading from "../../components/Heading.js";
import AllGalleryImage from "../../components/Gallery/AllGalleryImage.js";
import CreateGalleryImage from "../../components/Gallery/createGalleryImage.js";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

const AdminGalleryPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Heading
        title="Manage Gallery | Admin Portal"
        description="Manage academy gallery images"
        keywords="admin, manage gallery"
      />
      <AdminLayout
        title="Manage Gallery"
        subtitle={isCreating ? "Upload new image" : "View and manage gallery"}
        action={
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-glass ${
              isCreating 
                ? "bg-white/5 border border-slate-600 text-white hover:bg-white/10" 
                : "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:bg-primary hover:text-slate-900"
            }`}
          >
            {isCreating ? (
              <>
                <FiArrowLeft size={16} /> Back to Gallery
              </>
            ) : (
              <>
                <FiPlus size={16} /> Upload Image
              </>
            )}
          </button>
        }
      >
        <div className="w-full mt-4">
          {isCreating ? <CreateGalleryImage /> : <AllGalleryImage />}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminGalleryPage;

