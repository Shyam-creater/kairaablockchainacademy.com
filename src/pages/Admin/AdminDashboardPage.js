import React from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import KPIGrid from "../../components/Admin/Dashboard/KPIGrid";
import TrendsChart from "../../components/Admin/Dashboard/TrendsChart";
import TopCoursesChart from "../../components/Admin/Dashboard/TopCoursesChart";
import ActivityFeed from "../../components/Admin/Dashboard/ActivityFeed";
import { useGetDashboardSummaryQuery, useGetDashboardTrendsQuery, useGetAuditLogsQuery } from "../../redux/features/admin/adminApi";
import { FiRefreshCw, FiUsers, FiBook, FiShoppingCart, FiFileText, FiImage, FiShield, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useGetDashboardSummaryQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: trendsData, isLoading: trendsLoading, refetch: refetchTrends } = useGetDashboardTrendsQuery(30, { refetchOnMountOrArgChange: true });
  const { data: logsData, refetch: refetchLogs } = useGetAuditLogsQuery({ page: 1, limit: 10 }, { refetchOnMountOrArgChange: true });

  const summary = summaryData?.summary;
  const trends = trendsData?.trends || [];
  const logs = logsData?.logs || [];

  const handleRefresh = () => {
    refetchSummary();
    refetchTrends();
    refetchLogs();
  };

  return (
    <AdminLayout
      title="Overview"
      subtitle="Your academy's performance at a glance."
      action={
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all shadow-sm"
        >
          <FiRefreshCw size={14} className={summaryLoading ? "animate-spin" : ""} />
          Sync Data
        </button>
      }
    >
      <div className="space-y-8 pb-10">
        
        {/* KPI Grid Section */}
        <section>
          <KPIGrid summary={summary} loading={summaryLoading} />
        </section>

        {/* Charts removed per user request */}

        {/* Bottom Row */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="xl:col-span-3 bg-white rounded-none border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
          >
            <ActivityFeed orders={summary?.recentOrders || []} registrations={summary?.recentRegistrations || []} logs={logs} loading={summaryLoading} />
          </motion.div>
        </section>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
