import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";

import { FiEdit2 } from "react-icons/fi";
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
  // const { theme } = useTheme();
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
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => {
        return (
          <Button>
            <Link to={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2
              className={
                // theme === "dark" ? "text-white" :
                 "text-black"}
              size={20}
            />
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
              setCourseId(params.row.id);
            }}
          >
            <AiOutlineDelete
              className={
                // theme === "dark" ? "text-white" :
                 "text-black"}
              size={20}
            />
          </Button>
        );
      },
    },
  ];

  const rows = [];

  {
    data &&
      data.courses.forEach((item) => {
        rows.push({
          id: item._id,
          title: item.name,
          ratings: item.ratings,
          
          purchased: item.purchased,
          created_at: format(item.createdAt),
          // created_at: item.createdAt
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
    <div className="">
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
                color: 
                // theme === "dark" ? "#fff" :
                 "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color:
                //  theme === "dark" ? "#fff" : 
                 "#000",
              },
              "& .MuiDataGrid-row": {
                color: 
                // theme === "dark" ? "#fff" : 
                "#000",
                borderBottom:
                  // theme === "dark"? "1px solid #ffffff30 !important":
                     "1px solid #ccc !important",
              },
              "& .MuiTablePagination-root": {
                color: 
                // theme === "dark" ? "#fff" :
                 "#000",
              },
              "& .MuiIconButton-colorInherit": {
                color: 
                // theme === "dark" ? "#fff" :
                 "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color:
                //  theme === "dark" ? "#fff" : 
                 "#000",
              },

              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: 
                // theme === "dark" ? "#1F2A40" :
                 "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: 
                // theme === "dark" ? "#fff" :
                 "#000",
                borderTop: "none",
                backgroundColor: 
                // theme === "dark" ? "#3e4396" :
                 "#5AB2FF",
              },
              "& .MuiCheckbox-root": {
                color:
                  // theme === "dark" ? `#b7ebde !important` : 
                  `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
              "& .MuiDataGrid-columnHeader": {
                color: 
                // theme === "dark" ? "#fff" :
                 "#000",
                background: 
                // theme === "dark" ? "#3e4396" :
                 "#5AB2FF",
                borderBottom: "none",
              },
            }}
          >
            <DataGrid checkboxSelection columns={columns} rows={rows} />
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
                  Add you sure you want to delete this Course?
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

export default AllCourses;
