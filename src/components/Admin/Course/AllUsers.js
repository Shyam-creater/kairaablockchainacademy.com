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
import { useTheme } from "next-themes";
import { MdOutlineEmail } from "react-icons/md";
import { FiUsers, FiPlus, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { useGetAdminUsersQuery, useSuspendUserMutation } from "../../../redux/features/admin/adminApi.js";
import {
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../../../redux/features/user/userApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "../../../styles/style.js";
import { Modal } from "@mui/material";
import { toast } from "react-hot-toast";

const AllUsers = ({ isTeam }) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [pendingRoles, setPendingRoles] = useState({});
  const [updateUserRole, { isSuccess, error: updateError }] =
    useUpdateUserRoleMutation({});
  const [deleteUser, { isSuccess: deleteUserSuccess, error: deleteUserError }] =
    useDeleteUserMutation({});
  const [suspendUser, { isSuccess: suspendSuccess, error: suspendError }] =
    useSuspendUserMutation();

  // const { theme } = useTheme();

  const { isLoading, data, refetch, isError, error } = useGetAdminUsersQuery(
    { limit: 100 }, // fetch up to 100 for now to keep DataGrid working without full server-side pagination implementation
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
      setPendingRoles({});
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
    if (suspendSuccess) {
      refetch();
      toast.success("User status updated!");
    }
    if (suspendError) {
      if ("data" in suspendError) {
        toast.error(suspendError.data?.message || "Failed to update user status");
      }
    }
  }, [
    updateError,
    isSuccess,
    deleteUserSuccess,
    deleteUserError,
    suspendSuccess,
    suspendError,
  ]);

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 0.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        const currentRole = pendingRoles[params.row.email] || params.row.role;
        return (
          <select
            value={currentRole}
            onChange={(e) => setPendingRoles({ ...pendingRoles, [params.row.email]: e.target.value })}
            className="w-full h-[35px] border border-gray-200 bg-white text-gray-700 text-sm outline-none px-2 focus:border-primary transition-colors cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.5, minWidth: 130 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.4, minWidth: 140 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`px-2 py-0.5 rounded-none text-xs font-semibold ${
            params.row.isSuspended
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {params.row.isSuspended ? "Suspended" : "Active"}
        </span>
      ),
    },
    { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 130 },
    {
      field: "suspend",
      headerName: "Suspend",
      flex: 0.45,
      minWidth: 120,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color={params.row.isSuspended ? "success" : "warning"}
          onClick={() => suspendUser(params.row.id)}
          sx={{ fontSize: 11, textTransform: "none", borderRadius: 0 }}
        >
          {params.row.isSuspended ? "Reactivate" : "Suspend"}
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 80,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setUserId(params.row.id);
            }}
            sx={{ borderRadius: 0 }}
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
      minWidth: 80,
      renderCell: (params) => {
        return (
          <Button sx={{ borderRadius: 0 }}>
            <a href={`mailto:${params.row.email}`}>
              <MdOutlineEmail
                className={"text-black"}
                size={20}
              />
            </a>
          </Button>
        );
      },
    },
    {
      field: "saveRole",
      headerName: "Save",
      minWidth: 90,
      renderCell: (params) => {
        const hasChanged = pendingRoles[params.row.email] && pendingRoles[params.row.email] !== params.row.role;
        return (
          <Button
            size="small"
            variant={hasChanged ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              if (hasChanged) {
                updateUserRole({ email: params.row.email, role: pendingRoles[params.row.email] });
              }
            }}
            disabled={!hasChanged}
            sx={{ fontSize: 11, textTransform: "none", borderRadius: 0, opacity: hasChanged ? 1 : 0.4 }}
          >
            Save
          </Button>
        );
      },
    },
  ];

  const rows = [];
  const userItems = data?.users || [];
  const userCount = userItems.length;

  const listItems = isTeam
    ? userItems.filter((item) => item.role === "admin")
    : userItems;

  listItems.forEach((item, index) => {
    rows.push({
      id: item._id || index.toString(),
      name: item.name || "—",
      email: item.email || "—",
      role: item.role || "user",
      phoneNumber: item.phoneNumber || "—",
      courses: item.courses?.length || 0,
      isSuspended: item.isSuspended || false,
      created_at: format(item.createdAt),
    });
  });

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
              <div className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center">
                <FiUsers className="text-gray-400" size={16} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Users</span>
                <span className="text-lg font-bold text-gray-800 leading-none block">{userCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refetch}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
              >
                <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Table Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {userCount === 0 ? (
              <div className="text-center text-gray-500 font-medium py-10 flex-1">
                No users found yet. Please refresh or verify the admin API endpoint.
              </div>
            ) : (
              <Box className="w-full h-[calc(100vh-280px)] min-h-[400px]">
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
            )}
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
                  Are you sure you want to delete this user?
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

export default AllUsers;
