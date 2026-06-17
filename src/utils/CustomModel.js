import React from "react";
import { Modal, Box } from "@mui/material";
import { HiX } from "react-icons/hi";

const CustomModel = ({
  open,
  setOpen,
  setRoute,
  component: Component,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center p-4 sm:p-0"
    >
      <Box className="relative w-full max-w-[850px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-neutral-200 max-h-[90vh] overflow-hidden outline-none">
        {/* Absolute Close Button */}
        <div className="absolute top-4 right-4 z-[60]">
          <button 
            onClick={() => setOpen(false)}
            className="p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
          >
            <HiX size={20} />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="w-full h-full">
          <Component setOpen={setOpen} setRoute={setRoute} /> 
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModel;
