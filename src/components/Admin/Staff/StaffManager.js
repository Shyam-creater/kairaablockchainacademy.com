import React, { useState } from "react";
import { 
  DataGrid,
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useGetAdminUsersQuery, useGetStaffMetricsQuery } from "../../../redux/features/admin/adminApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { motion } from "framer-motion";
import { FiUsers, FiRefreshCw, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import Staff360Drawer from "./Staff360Drawer";

const StaffManager = () => {
  const { isLoading, data, refetch } = useGetAdminUsersQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: metricsData } = useGetStaffMetricsQuery(undefined, { refetchOnMountOrArgChange: true });
  const metrics = metricsData?.metrics;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
              params.row.isSuspended
                ? "bg-danger/20 text-danger border-danger/30 shadow-[0_0_8px_rgba(255,23,68,0.3)]"
                : "bg-success/20 text-success border-success/30 shadow-[0_0_8px_rgba(0,230,118,0.3)]"
            }`}
          >
            {params.row.isSuspended ? "Suspended" : "Active"}
          </span>
        </div>
      ),
    },
    { field: "created_at", headerName: "Created At", flex: 0.8 },
  ];

  const rows = [];
  const userItems = data?.users || [];
  
  // Filter for staff only
  const staffItems = userItems.filter((item) => item.role === "staff");
  const staffCount = staffItems.length;

  staffItems.forEach((item, index) => {
    rows.push({
      id: item._id || index.toString(),
      name: item.name || "—",
      email: item.email || "—",
      phoneNumber: item.phoneNumber || "—",
      isSuspended: item.isSuspended || false,
      created_at: format(item.createdAt),
    });
  });

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
            <div className="flex gap-4">
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-none">
                  <FiUsers className="text-black dark:text-gray-900 dark:text-white" size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Staff</span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white leading-none block drop-shadow-md">{metrics?.totalStaff || staffCount}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center border border-success/30 shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                  <FiCheckCircle className="text-success" size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block leading-none mb-1">Assigned Students</span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white leading-none block drop-shadow-md">{metrics?.totalAssignedOrders || 0}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_15px_rgba(197,101,249,0.3)]">
                  <FiTrendingUp className="text-secondary" size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block leading-none mb-1">Avg Caseload</span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white leading-none block drop-shadow-md">{metrics?.averageCaseload || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refetch}
                className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-none"
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
            {staffCount === 0 ? (
              <div className="text-center text-gray-500 font-medium py-10 flex-1">
                No staff members found. Admin must assign the staff role to a user first.
              </div>
            ) : (
              <Box className="w-full h-[65vh] min-h-[400px] bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-2">
                <DataGrid 
                  checkboxSelection
                  columns={columns} 
                  rows={rows} 
                  disableRowSelectionOnClick
                  rowHeight={64}
                  onRowClick={(params) => {
                    setSelectedStaffId(params.row.id);
                    setDrawerOpen(true);
                  }}
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
                    '& .MuiCheckbox-root': {
                      color: 'rgba(255,255,255,0.3)',
                    },
                    '& .MuiCheckbox-root.Mui-checked': {
                      color: '#00f2fe',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'rgba(0, 242, 254, 0.04)',
                    }
                  }}
                />
              </Box>
            )}
          </motion.div>
          
          <Staff360Drawer 
            isOpen={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            staffId={selectedStaffId} 
          />
        </>
      )}
    </div>
  );
};

export default StaffManager;
