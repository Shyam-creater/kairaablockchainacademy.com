import React from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import KPIGrid from "../../components/Admin/Dashboard/KPIGrid";
import TrendsChart from "../../components/Admin/Dashboard/TrendsChart";
import TopCoursesChart from "../../components/Admin/Dashboard/TopCoursesChart";
import ActivityFeed from "../../components/Admin/Dashboard/ActivityFeed";
import AdminCalendar from "../../components/Admin/Dashboard/AdminCalendar";
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
          className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 border border-white/20 hover:border-primary/50 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] backdrop-blur-md"
        >
          <FiRefreshCw size={14} className={summaryLoading ? "animate-spin" : ""} />
          Sync Data
        </button>
      }
    >
      <div className="space-y-6 pb-10">
        
        {/* KPI Grid Section */}
        <section>
          <KPIGrid summary={summary} loading={summaryLoading} />
        </section>

        {/* Charts & Calendar Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="h-[400px] w-full"
            >
              <TrendsChart trends={trends} loading={trendsLoading} />
            </motion.div>
          </div>

          {/* Calendar */}
          <div className="xl:col-span-1 h-[400px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="h-full"
            >
              <AdminCalendar />
            </motion.div>
          </div>
        </section>

        {/* Activity Feed Full Width */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="w-full"
          >
            <ActivityFeed orders={summary?.recentOrders || []} registrations={summary?.recentRegistrations || []} logs={logs} loading={summaryLoading} />
          </motion.div>
        </section>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
