import React from "react";
import Heading from "../components/Heading";
import AdminLayout from "../components/Admin/AdminLayout";
import KPIGrid from "../components/Admin/Dashboard/KPIGrid";
import TrendsChart from "../components/Admin/Dashboard/TrendsChart";
import TopCoursesChart from "../components/Admin/Dashboard/TopCoursesChart";
import ActivityFeed from "../components/Admin/Dashboard/ActivityFeed";
import {
  useGetDashboardSummaryQuery,
  useGetDashboardTrendsQuery,
} from "../redux/features/admin/adminApi";
import { FiRefreshCw } from "react-icons/fi";

const AdminDashboardPage = () => {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: trendsData,
    isLoading: trendsLoading,
    refetch: refetchTrends,
  } = useGetDashboardTrendsQuery(30, {
    refetchOnMountOrArgChange: true,
  });

  const summary = summaryData?.summary;
  const trends = trendsData?.trends || [];

  const handleRefresh = () => {
    refetchSummary();
    refetchTrends();
  };

  return (
    <>
      <Heading
        title="Admin Dashboard – Kairaa Blockchain Academy"
        description="Admin analytics and management dashboard"
        keywords="admin, dashboard, blockchain academy"
      />
      <AdminLayout
        title="Dashboard Overview"
        subtitle="Real-time analytics & management controls"
        action={
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition-colors font-medium"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        }
      >
        <div className="space-y-6">
            {/* KPI Cards */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Key Metrics
              </h2>
              <KPIGrid summary={summary} loading={summaryLoading} />
            </section>

            {/* Charts Row */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TrendsChart trends={trends} loading={trendsLoading} />
              </div>
              <div>
                <TopCoursesChart
                  topCourses={summary?.courses?.topCourses || []}
                  loading={summaryLoading}
                />
              </div>
            </section>

            {/* Activity Feed */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <ActivityFeed
                  orders={summary?.recentOrders || []}
                  registrations={summary?.recentRegistrations || []}
                  loading={summaryLoading}
                />
              </div>

              {/* Quick Links Panel */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Manage Users", href: "/admin/users", color: "bg-violet-50 text-violet-700 hover:bg-violet-100", emoji: "👥" },
                    { label: "All Courses", href: "/admin/courses", color: "bg-blue-50 text-blue-700 hover:bg-blue-100", emoji: "📚" },
                    { label: "Create Course", href: "/admin/create-course", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", emoji: "➕" },
                    { label: "Orders", href: "/admin/orders", color: "bg-amber-50 text-amber-700 hover:bg-amber-100", emoji: "🛒" },
                    { label: "Registrations", href: "/admin/registrations", color: "bg-pink-50 text-pink-700 hover:bg-pink-100", emoji: "📝" },
                    { label: "Manage Blogs", href: "/admin/manage-blogs", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100", emoji: "📰" },
                    { label: "Gallery", href: "/admin/edit-gallery-image", color: "bg-teal-50 text-teal-700 hover:bg-teal-100", emoji: "🖼️" },
                    { label: "Manage Team", href: "/admin/team", color: "bg-orange-50 text-orange-700 hover:bg-orange-100", emoji: "🏢" },
                    { label: "Audit Logs", href: "/admin/audit-logs", color: "bg-red-50 text-red-700 hover:bg-red-100", emoji: "🔒" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`${link.color} rounded-xl p-4 flex flex-col items-start gap-1 transition-colors duration-200`}
                    >
                      <span className="text-2xl">{link.emoji}</span>
                      <span className="text-sm font-semibold">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Summary Table */}
            <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-700 mb-4">
                Platform Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 rounded-lg">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 rounded-l-lg">Metric</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Value</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3 rounded-r-lg">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { metric: "Total Users", value: summary?.users?.total?.toLocaleString() ?? "—", detail: `${summary?.users?.newToday ?? 0} new today` },
                      { metric: "Active Users (30d)", value: summary?.users?.active30d?.toLocaleString() ?? "—", detail: `${summary?.users?.active7d ?? 0} last 7 days` },
                      { metric: "Total Courses", value: summary?.courses?.total?.toLocaleString() ?? "—", detail: "Live on platform" },
                      { metric: "Total Orders", value: summary?.orders?.total?.toLocaleString() ?? "—", detail: "All time" },
                      { metric: "Total Revenue", value: `₹${(summary?.orders?.totalRevenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, detail: `₹${(summary?.orders?.monthlyRevenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} this month` },
                      { metric: "Registrations", value: summary?.registrations?.total?.toLocaleString() ?? "—", detail: "Course interest forms" },
                    ].map((row) => (
                      <tr key={row.metric} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-700">{row.metric}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">{row.value}</td>
                        <td className="px-4 py-3 text-right text-gray-400">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
