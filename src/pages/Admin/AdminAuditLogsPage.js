import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useGetAuditLogsQuery } from "../../redux/features/admin/adminApi";
import Loader from "../../components/Loader/Loader";
import { format } from "timeago.js";
import { FiRefreshCw, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

const ACTION_COLORS = {
  DELETE_USER: "bg-red-50 text-red-600 border-red-100",
  SUSPEND_USER: "bg-amber-50 text-amber-600 border-amber-100",
  REACTIVATE_USER: "bg-emerald-50 text-emerald-600 border-emerald-100",
  UPDATE_USER_ROLE: "bg-blue-50 text-blue-600 border-blue-100",
  DELETE_COURSE: "bg-red-50 text-red-600 border-red-100",
  CREATE_COURSE: "bg-emerald-50 text-emerald-600 border-emerald-100",
  UPDATE_COURSE: "bg-blue-50 text-blue-600 border-blue-100",
  DELETE_BLOG: "bg-red-50 text-red-600 border-red-100",
  CREATE_BLOG: "bg-emerald-50 text-emerald-600 border-emerald-100",
  OTHER: "bg-gray-50 text-gray-600 border-gray-200",
};

const ACTION_TYPES = [
  "",
  "DELETE_USER",
  "SUSPEND_USER",
  "REACTIVATE_USER",
  "UPDATE_USER_ROLE",
  "DELETE_COURSE",
  "CREATE_COURSE",
  "UPDATE_COURSE",
  "DELETE_BLOG",
  "CREATE_BLOG",
  "UPLOAD_GALLERY",
  "DELETE_GALLERY",
  "OTHER",
];

const AdminAuditLogsPage = () => {
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const pageSize = 20;

  const { data, isLoading, refetch } = useGetAuditLogsQuery(
    { page: page + 1, limit: pageSize, action: actionFilter },
    { refetchOnMountOrArgChange: true }
  );

  const logs = data?.logs || [];
  const total = data?.total || 0;

  const columns = [
    {
      field: "action",
      headerName: "Action",
      flex: 0.9,
      minWidth: 160,
      renderCell: (params) => {
        const cls = ACTION_COLORS[params.value] || "bg-gray-50 text-gray-600 border-gray-100";
        return (
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${cls}`}>
            {params.value}
          </span>
        );
      },
    },
    { field: "actor", headerName: "Admin", flex: 0.7, minWidth: 140 },
    { field: "target", headerName: "Target", flex: 0.8, minWidth: 150 },
    { field: "ip", headerName: "IP Address", flex: 0.5, minWidth: 120 },
    { field: "created_at", headerName: "Time", flex: 0.6, minWidth: 130 },
  ];

  const rows = logs.map((log, i) => ({
    id: log._id || i,
    action: log.action,
    actor: log.actor?.name || log.actor?.email || "—",
    target: log.target || "—",
    ip: log.ip || "—",
    created_at: log.createdAt ? format(new Date(log.createdAt)) : "—",
  }));

  return (
    <AdminLayout
      title="Audit Logs"
      subtitle="Track all administrator actions across the platform"
      action={
        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            className="text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm"
          >
            {ACTION_TYPES.map((a) => (
              <option key={a} value={a}>
                {a || "All Actions"}
              </option>
            ))}
          </select>
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
          >
            <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-4"
        >
          <div className="bg-white rounded-none border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <FiShield className="text-gray-400" size={16} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block leading-none mb-1">Total Logs</span>
              <span className="text-lg font-bold text-gray-800 leading-none block">{total.toLocaleString()}</span>
            </div>
          </div>
          {actionFilter && (
            <div className="bg-primary/5 rounded-xl border border-primary/20 px-5 py-3 flex items-center gap-2">
              <span className="text-[13px] font-medium text-primary">Filtered by:</span>
              <span className="text-[13px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{actionFilter}</span>
              <button
                onClick={() => setActionFilter("")}
                className="text-primary/50 hover:text-primary ml-2 p-1 rounded-full hover:bg-primary/10 transition-colors"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </motion.div>

        {/* Logs Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full mt-4"
        >
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader /></div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 gap-4 bg-white border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <FiShield className="text-gray-300" size={32} />
              </div>
              <div className="text-center">
                <p className="text-gray-500 font-medium">No audit logs found</p>
                <p className="text-gray-400 text-sm mt-1">Admin actions will appear here</p>
              </div>
            </div>
          ) : (
            <Box m="0" className="w-full h-[65vh] bg-white border border-gray-100 shadow-sm rounded-none">
              <DataGrid
                columns={columns}
                rows={rows}
                rowCount={total}
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(m) => setPage(m.page)}
                pageSizeOptions={[20]}
                disableRowSelectionOnClick
                rowHeight={64}
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
    </AdminLayout>
  );
};

export default AdminAuditLogsPage;
