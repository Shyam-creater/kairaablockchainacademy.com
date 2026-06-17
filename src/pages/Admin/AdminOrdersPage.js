import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useGetAdminOrdersSummaryQuery, useGetAdminOrdersQuery } from "../../redux/features/admin/adminApi";
import Loader from "../../components/Loader/Loader";
import { format } from "timeago.js";
import { FiShoppingCart, FiDollarSign, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

const StatCard = ({ label, value, sub, Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-[13px] font-medium text-gray-400 mt-2">{sub}</p>}
    </div>
  </motion.div>
);

const AdminOrdersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useGetAdminOrdersSummaryQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetAdminOrdersQuery({ page: page + 1, limit: pageSize }, { refetchOnMountOrArgChange: true });

  const summary = summaryData?.summary;
  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.6, minWidth: 120 },
    { field: "courseId", headerName: "Course ID", flex: 0.7, minWidth: 130 },
    { field: "userId", headerName: "User ID", flex: 0.7, minWidth: 130 },
    {
      field: "amount",
      headerName: "Amount (₹)",
      flex: 0.5,
      minWidth: 110,
      renderCell: (params) => (
        <span className="font-semibold text-success">
          ₹{params.value?.toLocaleString("en-IN") ?? "—"}
        </span>
      ),
    },
    { field: "paymentId", headerName: "Payment ID", flex: 0.7, minWidth: 130 },
    { field: "created_at", headerName: "Date", flex: 0.6, minWidth: 120 },
  ];

  const rows = orders.map((o) => ({
    id: o._id,
    courseId: o.courseId ? o.courseId.slice(-8) : "—",
    userId: o.userId ? o.userId.slice(-8) : "—",
    amount: o.payment_info?.amount ? o.payment_info.amount / 100 : null,
    paymentId: o.payment_info?.id || o.payment_info?.razorpay_payment_id || "—",
    created_at: o.createdAt ? format(new Date(o.createdAt)) : "—",
  }));

  const handleRefresh = () => {
    refetchSummary();
    refetchOrders();
  };

  return (
    <AdminLayout
      title="Course Purchases"
      subtitle="View and manage all purchase transactions"
      action={
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
        >
          <FiRefreshCw size={14} className={summaryLoading || ordersLoading ? "animate-spin" : ""} />
          Sync Data
        </button>
      }
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[120px] bg-gray-50 rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Purchases"
              value={summary?.total?.toLocaleString() ?? "0"}
              sub="All time transactions"
              Icon={FiShoppingCart}
              color="bg-primary-50 text-primary border border-primary/10"
              delay={0.1}
            />
            <StatCard
              label="Total Revenue"
              value={`₹${(summary?.revenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              sub={`₹${(summary?.last30Days?.revenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} last 30 days`}
              Icon={FiDollarSign}
              color="bg-success-50 text-success border border-success/10"
              delay={0.2}
            />
            <StatCard
              label="Avg. Purchase Value"
              value={`₹${(summary?.avgOrderValue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              sub={`${summary?.last30Days?.count ?? 0} purchases last 30 days`}
              Icon={FiTrendingUp}
              color="bg-accent-50 text-accent border border-accent/10"
              delay={0.3}
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
            <Box m="0" className="w-full h-[60vh] bg-white border border-gray-100 shadow-sm rounded-none">
              <DataGrid
                columns={columns}
                rows={rows}
                rowCount={totalOrders}
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(m) => setPage(m.page)}
                pageSizeOptions={[15]}
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

export default AdminOrdersPage;
