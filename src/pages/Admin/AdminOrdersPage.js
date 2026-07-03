import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useGetAdminOrdersSummaryQuery, useGetAdminOrdersQuery, useGetAdminUsersQuery, useAssignStaffMutation } from "../../redux/features/admin/adminApi";
import Loader from "../../components/Loader/Loader";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiDollarSign, FiTrendingUp, FiRefreshCw, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import Order360Drawer from "../../components/Admin/Order360Drawer";

const icons = {
  purchases: { icon: FiShoppingCart, color: "text-primary", hex: "#00f2fe", glow: "hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]" },
  revenue: { icon: FiDollarSign, color: "text-success", hex: "#00e676", glow: "hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]" },
  average: { icon: FiTrendingUp, color: "text-accent", hex: "#8b5cf6", glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
};

const KPICard = ({ label, value, sub, iconKey, delay, trend }) => {
  const { icon: Icon, color, hex, glow } = icons[iconKey] || icons.purchases;
  
  const percentage = Math.min(Math.max((label.length * 10) % 100, 40), 90);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay }}
      className={`glass-panel p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${glow}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Sparkline background simulation */}
      <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
        <path d="M0,30 L10,20 L30,25 L50,10 L70,15 L90,5 L100,0 L100,30 Z" fill={hex} />
      </svg>

      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            cx="40" cy="40" r={radius} 
            stroke={hex} 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeLinecap="round" 
            style={{ filter: `drop-shadow(0 0 6px ${hex}80)` }}
          />
        </svg>
        <div className={`p-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${color} shadow-inner`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex justify-between items-center">
          {label}
          {trend && <span className="text-success tracking-normal text-[10px]">↑ {trend}%</span>}
        </span>
        <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none mb-1 drop-shadow-md">{value ?? "—"}</h3>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{sub}</p>
      </div>
    </motion.div>
  );
};

const AdminOrdersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 15;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderRow, setSelectedOrderRow] = useState(null);

  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useGetAdminOrdersSummaryQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetAdminOrdersQuery({ page: page + 1, limit: pageSize }, { refetchOnMountOrArgChange: true });

  const summary = summaryData?.summary;
  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;

  const { user } = useSelector((state) => state.auth);
  const { data: usersData } = useGetAdminUsersQuery({ limit: 100 }, { skip: user?.role !== "admin" });
  const staffMembers = usersData?.users?.filter((u) => u.role === "staff") || [];
  
  const [assignStaff, { isLoading: assignLoading }] = useAssignStaffMutation();

  const handleStaffChange = async (orderId, staffId) => {
    try {
      await assignStaff({ id: orderId, type: "order", staffId }).unwrap();
      toast.success("Staff assigned successfully!");
      refetchOrders();
      setDrawerOpen(false); // Close drawer to reflect change
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign staff");
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.5, minWidth: 100, renderCell: (params) => <span className="font-mono text-slate-400 text-xs">{params.value.slice(-8)}</span> },
    { 
      field: "user", 
      headerName: "User Details", 
      flex: 0.8, 
      minWidth: 160,
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full">
          <span className="font-bold text-white leading-tight">{params.row.userName}</span>
          <span className="text-xs text-slate-400 truncate w-full">{params.row.userEmail}</span>
        </div>
      )
    },
    { 
      field: "course", 
      headerName: "Course", 
      flex: 0.8, 
      minWidth: 160,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <span className="text-sm text-slate-300 truncate w-full">{params.row.courseName}</span>
        </div>
      )
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      minWidth: 110,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <span className="px-2.5 py-1 bg-success/20 text-success border border-success/30 rounded text-xs font-bold shadow-[0_0_10px_rgba(0,230,118,0.2)]">
            ₹{params.value?.toLocaleString("en-IN") ?? "—"}
          </span>
        </div>
      ),
    },
    { field: "paymentId", headerName: "Payment ID", flex: 0.7, minWidth: 140, renderCell: (params) => <span className="font-mono text-primary text-xs truncate max-w-[120px]">{params.value}</span> },
    {
      field: "assignedStaffId",
      headerName: "Staff",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        const staff = params.row.assignedStaffId?.name;
        return (
          <div className="flex items-center h-full w-full">
            {staff ? (
              <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-1 rounded border border-accent/20">{staff}</span>
            ) : (
              <span className="text-xs text-slate-500 italic">Unassigned</span>
            )}
          </div>
        );
      },
    },
    { field: "created_at", headerName: "Date", flex: 0.5, minWidth: 100, renderCell: (params) => <span className="text-xs text-slate-400">{params.value}</span> },
    {
      field: "action",
      headerName: "View",
      flex: 0.3,
      minWidth: 70,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex items-center h-full w-full justify-center">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedOrderRow(params.row);
                setDrawerOpen(true);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <FiEye size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  const rows = orders.map((o) => ({
    id: o._id,
    courseId: o.courseId,
    userId: o.userId,
    userName: o.userName || "Unknown",
    userEmail: o.userEmail || o.userId,
    userAvatar: o.userAvatar || "",
    courseName: o.courseName || o.courseId,
    coursePrice: o.coursePrice || 0,
    amount: o.payment_info?.amount ? o.payment_info.amount / 100 : null,
    paymentId: o.payment_info?.id || o.payment_info?.razorpay_payment_id || "—",
    assignedStaffId: o.assignedStaffId,
    created_at: o.createdAt ? format(new Date(o.createdAt)) : "—",
  }));

  const handleRefresh = () => {
    refetchSummary();
    refetchOrders();
  };

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
    <AdminLayout
      title="Financial Command Center"
      subtitle="View purchases, generate invoices, and assign staff"
      action={
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-glass hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
        >
          <FiRefreshCw size={14} className={summaryLoading || ordersLoading ? "animate-spin" : ""} />
          Sync Transactions
        </button>
      }
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[120px] bg-gray-50/10 rounded-2xl border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              label="Total Purchases"
              value={summary?.total?.toLocaleString() ?? "0"}
              sub="All time transactions"
              iconKey="purchases"
              delay={0.1}
              trend={12}
            />
            <KPICard
              label="Total Revenue"
              value={`₹${(summary?.revenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              sub={`₹${(summary?.last30Days?.revenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} last 30 days`}
              iconKey="revenue"
              delay={0.2}
              trend={8}
            />
            <KPICard
              label="Avg. Purchase Value"
              value={`₹${(summary?.avgOrderValue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              sub={`${summary?.last30Days?.count ?? 0} purchases last 30 days`}
              iconKey="average"
              delay={0.3}
              trend={5}
            />
          </div>
        )}

        {/* Orders Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-4"
        >
          {ordersLoading ? (
            <div className="py-20 flex justify-center"><Loader /></div>
          ) : (
            <Box className="w-full h-[65vh] min-h-[400px] glass-panel rounded-xl overflow-hidden mt-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <DataGrid
                columns={columns}
                rows={rows}
                rowCount={totalOrders}
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(m) => setPage(m.page)}
                pageSizeOptions={[15]}
                disableRowSelectionOnClick
                rowHeight={70}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slots={{ toolbar: CustomToolbar }}
                onRowClick={(params) => {
                  setSelectedOrderRow(params.row);
                  setDrawerOpen(true);
                }}
                sx={{
                  border: 'none',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
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
                    backgroundColor: 'rgba(0, 242, 254, 0.05)',
                  }
                }}
              />
            </Box>
          )}
        </motion.div>
      </div>

      <Order360Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        order={selectedOrderRow}
        staffMembers={staffMembers}
        userRole={user?.role}
        onAssignStaff={handleStaffChange}
        assignLoading={assignLoading}
      />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
