import React from "react";
import { Modal, Box } from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
const CustomModel = ({
  // activeItem,
  open,
  setOpen,
  setRoute,
  component: Component,
}) => {
  return (
   
      <div className="">
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          style={{ overflow: 'scroll' }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // BackdropProps={{
          //   onClick: (event) => event.stopPropagation(), 
          // }}
        >
           
          <Box className="absolute   top-[50%] left-[50%]  -translate-x-1/2 -translate-y-1/2 800px:w-[450px] w-[90%]  bg-white  rounded-[8px] outline-none shadow p-4">
          {/* <IoMdCloseCircleOutline size={35} className="text-blue-500 font-bold p-0 hover:cursor-pointer absolute right-0 top-0" onClick={()=>setOpen(false)}/> */}
            <Component setOpen={setOpen} setRoute={setRoute} /> 
          </Box>
        </Modal>
      </div>
    
  );
};

export default CustomModel;
