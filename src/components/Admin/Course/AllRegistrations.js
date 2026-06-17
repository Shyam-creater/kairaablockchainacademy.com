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
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Registrations</span>
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
    </div>
  );
};

export default AllRegistrations;
