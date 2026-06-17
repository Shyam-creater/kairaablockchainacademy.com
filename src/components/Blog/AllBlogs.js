import React, { useEffect, useState } from "react";
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2, FiFileText, FiRefreshCw } from "react-icons/fi";
import Loader from "../Loader/Loader.js"
import { format } from "timeago.js";
import { styles } from "../../styles/style.js"
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from "../../redux/features/blog/blogApi.js";

const AllBlogs = () => {
  const [blogId, setBlogId] = useState("");
  const [open, setOpen] = useState(false);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const { data, isLoading, refetch } = useGetAllBlogsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [
    deleteBlog,
    {
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      isError: deleteError,
    },
  ] = useDeleteBlogMutation({});

  const handleDelete = async () => {
    const id = blogId;
    await deleteBlog(id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 150 },
    { field: "title", headerName: "Blog Title", flex: 0.8, minWidth: 200 },
    { field: "category", headerName: "Category", flex: 0.5, minWidth: 120 },
    {
      field: "image",
      headerName: "Image",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center h-full">
            {params.row.image ? (
              <img 
                src={params.row.image} 
                alt={params.row.title} 
                className="w-16 h-12 object-cover rounded shadow-sm border border-gray-200" 
              />
            ) : (
              <div className="w-16 h-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200 text-xs text-gray-400">
                No Img
              </div>
            )}
          </div>
        );
      },
    },
    { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 130 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <Button sx={{ minWidth: '40px', width: '40px' }}>
            <Link to={`/admin/edit-blog/${params.row.id}`}>
              <FiEdit2 className={"text-gray-600 hover:text-blue-600 transition-colors"} size={18} />
            </Link>
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <Button
            sx={{ minWidth: '40px', width: '40px' }}
            onClick={() => {
              setOpen(true);
              setBlogId(params.row.id);
            }}
          >
            <AiOutlineDelete className={"text-gray-600 hover:text-red-600 transition-colors"} size={20} />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpen(false);
      toast.success("Blog deleted successfully!");
    }

    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError;
        toast.error(errorMessage.data.message);
      } else {
        toast.error("Failed to delete blog.");
      }
    }
  }, [deleteSuccess, deleteError, deleteLoading, refetch]);

  const rows = [];
  if (data && data.blogs) {
    data.blogs.forEach((item) => {
      rows.push({
        id: item._id,
        title: item.title,
        category: item.category,
        image: item?.image?.url,
        created_at: format(item.createdAt),
      });
    });
  }

  const total = rows.length;

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderBottom: '1px solid #f3f4f6' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <GridToolbarColumnsButton sx={{ color: '#374151' }} />
          <GridToolbarFilterButton sx={{ color: '#374151' }} />
          <GridToolbarDensitySelector sx={{ color: '#374151' }} />
          <GridToolbarExport sx={{ color: '#374151' }} />
        </Box>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={() => setFilterModel({ items: [] })}
          sx={{ borderRadius: 0, textTransform: 'none', borderColor: '#e5e7eb', color: '#dc2626', '&:hover': { backgroundColor: '#fee2e2', borderColor: '#ef4444' } }}
        >
          Clear Filters
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Stats bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="bg-white rounded-none border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center">
            <FiFileText className="text-gray-400" size={16} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Blogs</span>
            <span className="text-lg font-bold text-gray-800 leading-none block">{total.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Refresh Action */}
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
        >
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="py-20 flex justify-center flex-1"><Loader /></div>
        ) : (
          <>
            <Box className="w-full h-[calc(100vh-280px)] min-h-[400px] bg-white border border-gray-100 shadow-sm rounded-none">
              <DataGrid 
                checkboxSelection 
                columns={columns} 
                rows={rows} 
                disableRowSelectionOnClick
                rowHeight={80}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slots={{ toolbar: CustomToolbar }}
                sx={{
                  border: 'none',
                  borderRadius: 0,
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid #f3f4f6',
                    borderRadius: 0,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #f3f4f6',
                    borderRadius: 0,
                  }
                }}
              />
            </Box>
            {open && (
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] bg-white rounded-none shadow-2xl p-6">
                  <h1 className={`${styles.title}`}>
                    Are you sure you want to delete this Blog?
                  </h1>
                  <div className="flex w-full items-center justify-evenly mb-2 mt-6 gap-4">
                    <div
                      className={`${styles.button} bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-none`}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </div>
                    <div
                      className={`${styles.button} bg-red-500 text-white hover:bg-red-600 rounded-none`}
                      onClick={handleDelete}
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AllBlogs;
