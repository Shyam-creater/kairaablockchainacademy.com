import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { MdOutlineEmail } from "react-icons/md";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../../../redux/features/user/userApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "../../../styles/style.js";
import { Modal } from "@mui/material";
import { toast } from "react-hot-toast";

const AllUsers = ({ isTeam }) => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { isSuccess, error: updateError }] =
    useUpdateUserRoleMutation({});
  const [deleteUser, { isSuccess: deleteUserSuccess, error: deleteUserError }] =
    useDeleteUserMutation({});

  // const { theme } = useTheme();

  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully!");
      setActive(false);
    }
    if (deleteUserSuccess) {
      refetch();
     
      toast.success("User deleted successfully!");
      setOpen(!open);
    }
    if (deleteUserError) {
      if ("data" in deleteUserError) {
        const errorMessage = deleteUserError;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    updateError,
    isSuccess,
    deleteUserSuccess,
    deleteUserError,
   
  ]);

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

 
  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.5 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setUserId(params.row.id);
            }}
          >
            <AiOutlineDelete
              className={"text-black"}
              size={20}
            />
          </Button>
        );
      },
    },
    {
      field: "  ",
      headerName: "Email",
      renderCell: (params) => {
        return (
          <Button>
            <a href={`mailto:${params.row.email}`}>
              <MdOutlineEmail
                className={
                  // theme === "dark" ? "text-white" : 
                  "text-black"}
                size={20}
              />
            </a>
          </Button>
        );
      },
    },
  ];

  const rows = [];

  if (isTeam) {
    const newData = data && data.users.filter((item) => item.role === "admin");

    newData &&
      newData.forEach((item) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          phoneNumber: item.phoneNumber,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          phoneNumber: item.phoneNumber,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }

  return (
    <div className="">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {/* add member button only for manage team page */}
          {isTeam && (
            <div className="w-full flex justify-start">
              <div
                className={`${styles.button} !w-[250px] bg-[#5AB2FF] `}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
          )}

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
                // theme === "dark" ? "#fff" : 
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
                // theme === "dark" ? "#fff" :
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
                //  theme === "dark" ? "#3e4396" :
                  "#5AB2FF",
                borderBottom: "none",
              },
            }}
          >
            <DataGrid checkboxSelection columns={columns} rows={rows} />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px]  bg-white rounded-[8px] shadow p-4">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />

                  <select
                    name="role"
                    id="role"
                    className={`${styles.input} !mt-6 bg-gray-100  text-gray-900 `}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user" className="text-black ">
                      User
                    </option>
                    <option
                      value="admin"
                      className="text-black"
                    >
                      Admin
                    </option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]]`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px]  bg-white rounded-[8px] shadow p-4">
                <h1 className={`${styles.title}`}>
                  Add you sure you want to delete this user?
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

export default AllUsers;
