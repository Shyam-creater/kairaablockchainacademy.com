import React, { useEffect, useState } from "react";
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2, FiBookOpen, FiRefreshCw, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
} from "../../../redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { Modal } from "@mui/material";
import { styles } from "../../../styles/style";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AllCourses = () => {
  const [courseId, setCourseId] = useState("");
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },

    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "view",
      headerName: "View",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Link to={`/courses/${params.row.id}`} target="_blank" rel="noopener noreferrer">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-500 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer">
                <FiEye size={16} />
              </div>
            </Link>
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Link to={`/admin/edit-course/${params.row.id}`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-500 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer">
                <FiEdit2 size={16} />
              </div>
            </Link>
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div 
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.id);
              }}
              className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-500 transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
            >
              <AiOutlineDelete size={16} />
            </div>
          </div>
        );
      },
    },
  ];

  const rows = [];

  if (data && data.courses) {
      data.courses.forEach((item) => {
        rows.push({
          id: item._id,
          title: item.name,
          ratings: item.ratings || 0,
          purchased: item.purchased || 0,
          created_at: format(item.createdAt),
        });
      });
  }

  const [filterModel, setFilterModel] = useState({ items: [] });

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <GridToolbarColumnsButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarFilterButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarDensitySelector sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarExport sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
        </Box>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={() => setFilterModel({ items: [] })}
          sx={{ borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.1)', color: '#94A3B8', '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#E2E8F0', color: '#E2E8F0' } }}
        >
          Clear Filters
        </Button>
      </GridToolbarContainer>
    );
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setOpen(!open)
      toast.success("Course deleted successfully!");
    }

    if (error) {
      if ("data" in error) {
        const errorMessage = error;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error,setOpen]);

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Stats bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="glass-panel px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <FiBookOpen className="text-primary" size={18} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">Total Courses</span>
                <span className="text-xl font-extrabold text-white leading-none block drop-shadow-md">{rows.length.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={refetch}
              className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </motion.div>

          {/* Table Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box className="w-full h-[65vh] min-h-[400px] glass-panel rounded-xl overflow-hidden mt-6">
              <DataGrid 
                checkboxSelection 
                columns={columns} 
                rows={rows} 
                disableRowSelectionOnClick
                rowHeight={64}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slots={{ toolbar: CustomToolbar }}
                sx={{
                  border: 'none',
                  color: '#e2e8f0',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                  },
                  '& .MuiTablePagination-root': {
                    color: '#e2e8f0',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#94a3b8',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }
                }}
              />
            </Box>
          </motion.div>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] bg-surface border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6">
                <h1 className={`${styles.title} text-gray-900 dark:text-white`}>
                  Are you sure you want to delete this Course?
                </h1>
                <div className="flex w-full items-center justify-evenly mb-2 mt-6 gap-4">
                  <div
                    className={`${styles.button} bg-white/10 text-gray-900 dark:text-white hover:bg-white/20 rounded-full border border-gray-200 dark:border-gray-800`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} bg-danger/20 text-danger border border-danger/50 shadow-[0_0_10px_rgba(255,23,68,0.2)] hover:bg-danger hover:text-gray-900 dark:text-white rounded-full`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default AllCourses;
