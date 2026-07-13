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
import User360Drawer from "../User360Drawer";
import { useBulkActionUsersMutation } from "../../../redux/features/admin/adminApi.js";

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
  const [bulkActionUsers, { isLoading: isBulkLoading }] = useBulkActionUsersMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

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
    { field: "id", headerName: "ID", flex: 0.3, minWidth: 100 },
    { field: "name", headerName: "Name", flex: 0.5, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 100,
    },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.5, minWidth: 110 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.4, minWidth: 130 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      minWidth: 90,
      renderCell: (params) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
            params.row.isSuspended
              ? "bg-danger/20 text-danger border-danger/30 shadow-[0_0_8px_rgba(255,23,68,0.3)]"
              : "bg-success/20 text-success border-success/30 shadow-[0_0_8px_rgba(0,230,118,0.3)]"
          }`}
        >
          {params.row.isSuspended ? "Suspended" : "Active"}
        </span>
      ),
    },
    { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 110 },
    {
      field: "suspend",
      headerName: "Suspend",
      flex: 0.45,
      minWidth: 100,
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
      minWidth: 70,
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
              className={"text-danger hover:text-danger/80 hover:drop-shadow-[0_0_8px_rgba(255,23,68,0.8)] transition-all"}
              size={20}
            />
          </Button>
        );
      },
    },
    {
      field: "  ",
      headerName: "Email",
      minWidth: 70,
      renderCell: (params) => {
        return (
          <Button sx={{ borderRadius: 0 }}>
            <a href={`mailto:${params.row.email}`}>
              <MdOutlineEmail
                className={"text-info hover:text-info/80 hover:drop-shadow-[0_0_8px_rgba(41,121,255,0.8)] transition-all"}
                size={20}
              />
            </a>
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

  const handleBulkAction = async (action) => {
    if (rowSelectionModel.length === 0) return toast.error("No users selected");
    try {
      await bulkActionUsers({ userIds: rowSelectionModel, action }).unwrap();
      toast.success(`Bulk ${action} successful`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || `Bulk ${action} failed`);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <GridToolbarColumnsButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarFilterButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarDensitySelector sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
          <GridToolbarExport sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {rowSelectionModel.length > 0 && (
            <>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleBulkAction('suspend')}
                disabled={isBulkLoading}
                sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}
              >
                Suspend Selected
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleBulkAction('activate')}
                disabled={isBulkLoading}
                sx={{ borderColor: '#22c55e', color: '#22c55e', '&:hover': { backgroundColor: 'rgba(34,197,94,0.1)' } }}
              >
                Activate Selected
              </Button>
            </>
          )}
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => setFilterModel({ items: [] })}
            sx={{ borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.1)', color: '#94A3B8', '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#E2E8F0', color: '#E2E8F0' } }}
          >
            Clear Filters
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  };

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
                <FiUsers className="text-primary" size={18} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">Total Users</span>
                <span className="text-xl font-extrabold text-white leading-none block drop-shadow-md">{userCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refetch}
                className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
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
              <Box className="w-full h-[calc(100vh-280px)] min-h-[400px] glass-panel rounded-xl overflow-hidden mt-6">
                <DataGrid 
                  checkboxSelection 
                  columns={columns} 
                  rows={rows} 
                  rowHeight={64}
                  filterModel={filterModel}
                  onFilterModelChange={(newModel) => setFilterModel(newModel)}
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  onRowClick={(params, event) => {
                    // Ignore clicks on buttons/selects
                    if (event.target.closest('button') || event.target.closest('select')) return;
                    setSelectedUserId(params.row.id);
                    setDrawerOpen(true);
                  }}
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
            )}
          </motion.div>

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 outline-none w-[450px] glass-panel shadow-[0_0_30px_rgba(0,242,254,0.2)] p-6">
                <h1 className={`${styles.title} text-white`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-evenly mb-2 mt-6 gap-4">
                  <div
                    className={`${styles.button} bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} bg-gradient-to-r from-danger to-secondary hover:from-danger/80 hover:to-secondary/80 text-white rounded-xl shadow-[0_0_15px_rgba(255,23,68,0.5)] transition-all cursor-pointer`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {/* User 360 Drawer */}
          <User360Drawer 
            isOpen={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            userId={selectedUserId} 
            onUpdateRole={updateUserRole}
          />
        </>
      )}
    </div>
  );
};

export default AllUsers;
