import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import Loader from "../Loader/Loader.js"
import { format } from "timeago.js";
import { Modal } from "@mui/material";
import { styles } from "../../styles/style.js"
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useGetAllGalleryImageQuery,
  useDeleteGalleryImageMutation,
} from "../../redux/features/gallery/galleryApi.js";

const AllGalleryImage = () => {
  const [imageId, setImageId] = useState("");
  const [open, setOpen] = useState(false);

  
  const { data, isLoading, isError, refetch } = useGetAllGalleryImageQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [
    deleteGalleryImage,
    {
      data: deleteData,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      isError: deleteError,
    },
  ] = useDeleteGalleryImageMutation({});

  const handleDelete=async()=>{
const id=imageId;
await deleteGalleryImage(id)
  }
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Image Title", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 0.5 },
    {
      field: "image",
      headerName: "Image",
      renderCell: (params) => {
    
        return <img src={params.row.image} />;
      },
    },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => {
        return (
          <Button>
            <Link
            // to={`/admin/edit-course/${params.row.id}`}
            >
              <FiEdit2 className={"text-black"} size={20} />
            </Link>
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setImageId(params.row.id);
            }}
          >
            <AiOutlineDelete className={"text-black"} size={20} />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpen(!open);
      toast.success("Image deleted successfully!");
    }

 

    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError;
        toast.error(errorMessage.data.message);
      }
    }
  }, [deleteSuccess, deleteError, setOpen,deleteLoading]);

  const rows = [];

  {
    data &&
      data.images.forEach((item) => {
        rows.push({
          id: item._id,
          name: item.name,
          description: item.description,
          image: item?.image?.url,

          created_at: format(item.createdAt),
        });
      });
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#000",
              },
              "& .MuiDataGrid-row": {
                color: "#000",
                borderBottom: "1px solid #ccc !important",
              },
              "& .MuiTablePagination-root": {
                color: "#000",
              },
              "& .MuiIconButton-colorInherit": {
                color: "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: "#000",
              },

              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: "#000",
                borderTop: "none",
                backgroundColor: "#5AB2FF",
              },
              "& .MuiCheckbox-root": {
                color: `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
              "& .MuiDataGrid-columnHeader": {
                color: "#000",
                background: "#5AB2FF",
                borderBottom: "none",
              },
            }}
          >
            <DataGrid  columns={columns} rows={rows} />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px]  bg-white rounded-[8px] shadow p-4">
                <h1 className={`${styles.title}`}>
                  Add you sure you want to delete this Image?
                </h1>
                <div className="flex w-full items-center justify-evenly mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-green-500`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-red-500`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllGalleryImage;
