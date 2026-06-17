import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
          <Button sx={{ minWidth: '40px', width: '40px' }}>
            <Link to={`/courses/${params.row.id}`} target="_blank" rel="noopener noreferrer">
              <FiEye
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                size={20}
              />
            </Link>
          </Button>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <Button sx={{ minWidth: '40px', width: '40px' }}>
            <Link to={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2
              className="text-gray-600 hover:text-blue-600 transition-colors"
              size={18}
            />
          </Link>
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <Button
            sx={{ minWidth: '40px', width: '40px' }}
            onClick={() => {
              setOpen(!open);
              setCourseId(params.row.id);
            }}
          >
            <AiOutlineDelete
              className="text-gray-600 hover:text-red-600 transition-colors"
              size={20}
            />
          </Button>
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
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt),
        });
      });
  }

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
    <div className="w-full h-full flex flex-col space-y-6">
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
            <div className="bg-white rounded-none border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <FiBookOpen className="text-gray-400" size={16} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Courses</span>
                <span className="text-lg font-bold text-gray-800 leading-none block">{rows.length.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={refetch}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
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
            <Box className="w-full h-[calc(100vh-280px)] min-h-[400px]">
              <DataGrid 
                checkboxSelection 
                columns={columns} 
                rows={rows} 
                disableRowSelectionOnClick
                rowHeight={64}
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
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] bg-white rounded-none shadow-2xl p-6">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this Course?
                </h1>
                <div className="flex w-full items-center justify-evenly mb-2 mt-6 gap-4">
                  <div
                    className={`${styles.button} bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-none`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} bg-red-500 hover:bg-red-600 rounded-none`}
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
