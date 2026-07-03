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
import { useGetAllRegistrationsQuery } from "../../../redux/features/user/userApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { motion } from "framer-motion";
import { FiFileText, FiRefreshCw } from "react-icons/fi";

const AllRegistrations = () => {
  const { isLoading, data, refetch } = useGetAllRegistrationsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [filterModel, setFilterModel] = useState({ items: [] });

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3, minWidth: 150 },
    { field: "firstName", headerName: "First Name", flex: 0.5, minWidth: 150 },
    { field: "lastName", headerName: "Last Name", flex: 0.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.5, minWidth: 130 },
    { field: "course", headerName: "Course Name", flex: 0.5, minWidth: 150 },
    { field: "created_at", headerName: "Created At", flex: 0.3, minWidth: 130 },
  ];

  const rows = [];
  if (data && data.registrations) {
    data.registrations.forEach((item) => {
      rows.push({
        id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        course: item.course,
        created_at: format(item.createdAt),
      });
    });
  }

  const total = rows.length;

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
      {/* Stats bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="glass-panel px-5 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <FiFileText className="text-primary" size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">Total Registrations</span>
            <span className="text-xl font-extrabold text-white leading-none block drop-shadow-md">{total.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Refresh Action */}
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-slate-600 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
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
        )}
      </motion.div>
    </div>
  );
};

export default AllRegistrations;
