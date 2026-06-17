import { User } from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Course from "../models/courseModel.js";
import Registration from "../models/registrationModel.js";
import AdminLog from "../models/adminLogModel.js";

/**
 * Get aggregated KPI summary for admin dashboard
 */
export const getDashboardSummaryService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

  const [
    totalUsers,
    newUsersToday,
    activeUsers30d,
    activeUsers7d,
    totalCourses,
    totalOrders,
    totalRegistrations,
    revenueAgg,
    revenueThisMonth,
    topCourses,
    recentOrders,
    recentRegistrations,
  ] = await Promise.all([
    // Total users
    User.countDocuments(),

    // New signups today
    User.countDocuments({ createdAt: { $gte: startOfToday } }),

    // Active users in last 30 days (users created or updated in 30 days as proxy)
    User.countDocuments({ updatedAt: { $gte: thirtyDaysAgo } }),

    // Active users in last 7 days
    User.countDocuments({ updatedAt: { $gte: sevenDaysAgo } }),

    // Total courses
    Course.countDocuments(),

    // Total orders
    Order.countDocuments(),

    // Total registrations (course interest forms)
    Registration.countDocuments(),

    // Total revenue from orders
    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
    ]),

    // Revenue this month
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
    ]),

    // Top 5 courses by purchase count
    Course.find({}, { name: 1, purchased: 1, price: 1, thumbnail: 1 })
      .sort({ purchased: -1 })
      .limit(5),

    // Recent 5 orders for activity feed
    Order.find().sort({ createdAt: -1 }).limit(5),

    // Recent 5 registrations for activity feed
    Registration.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const monthlyRevenue = revenueThisMonth[0]?.total || 0;

  return {
    users: {
      total: totalUsers,
      newToday: newUsersToday,
      active30d: activeUsers30d,
      active7d: activeUsers7d,
    },
    courses: {
      total: totalCourses,
      topCourses: topCourses.map((c) => ({
        id: c._id,
        name: c.name,
        purchased: c.purchased,
        price: c.price,
        thumbnail: c.thumbnail?.url || null,
      })),
    },
    orders: {
      total: totalOrders,
      totalRevenue: totalRevenue / 100, // Razorpay stores in paise
      monthlyRevenue: monthlyRevenue / 100,
    },
    registrations: {
      total: totalRegistrations,
    },
    recentOrders,
    recentRegistrations,
  };
};

/**
 * Get time-series trends data (signups + orders per day for last N days)
 */
export const getDashboardTrendsService = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const [signupTrends, orderTrends] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Build a complete date array for consistent chart data
  const dateMap = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    dateMap[key] = { date: key, signups: 0, orders: 0, revenue: 0 };
  }

  signupTrends.forEach((s) => {
    if (dateMap[s._id]) dateMap[s._id].signups = s.count;
  });

  orderTrends.forEach((o) => {
    if (dateMap[o._id]) {
      dateMap[o._id].orders = o.count;
      dateMap[o._id].revenue = (o.revenue || 0) / 100;
    }
  });

  return Object.values(dateMap);
};

/**
 * Get paginated user list with search/filter
 */
export const getPaginatedUsersService = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  suspended = "",
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) query.role = role;
  if (suspended === "true") query.isSuspended = true;
  if (suspended === "false") query.isSuspended = false;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return { users, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Toggle user suspended status
 */
export const toggleUserSuspendService = async (userId, actorUser, ip) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.isSuspended = !user.isSuspended;
  await user.save();

  // Write audit log
  await AdminLog.create({
    actor: {
      id: actorUser._id,
      name: actorUser.name,
      email: actorUser.email,
    },
    action: user.isSuspended ? "SUSPEND_USER" : "REACTIVATE_USER",
    target: user.email,
    details: { userId: user._id, name: user.name },
    ip,
  });

  return user;
};

/**
 * Get order analytics summary
 */
export const getOrdersSummaryService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [totalAgg, recentAgg, topCourseOrders] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
    ]),

    Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
    ]),

    // Top courses by order count
    Order.aggregate([
      {
        $group: {
          _id: "$courseId",
          orderCount: { $sum: 1 },
          revenue: { $sum: { $toDouble: "$payment_info.amount" } },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const totalRevenue = (totalAgg[0]?.revenue || 0) / 100;
  const totalOrders = totalAgg[0]?.total || 0;

  return {
    total: totalOrders,
    revenue: totalRevenue,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    last30Days: {
      count: recentAgg[0]?.count || 0,
      revenue: (recentAgg[0]?.revenue || 0) / 100,
    },
    topCourseOrders,
  };
};

/**
 * Get paginated orders
 */
export const getPaginatedOrdersService = async ({ page = 1, limit = 15 }) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(),
  ]);
  return { orders, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Get paginated audit logs
 */
export const getAuditLogsService = async ({
  page = 1,
  limit = 20,
  action = "",
}) => {
  const query = {};
  if (action) query.action = action;

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AdminLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AdminLog.countDocuments(query),
  ]);

  return { logs, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Write an audit log entry (callable from other controllers)
 */
export const writeAuditLog = async ({ actor, action, target, details, ip }) => {
  try {
    await AdminLog.create({
      actor: {
        id: actor._id,
        name: actor.name,
        email: actor.email,
      },
      action,
      target: target || "",
      details: details || {},
      ip: ip || "",
    });
  } catch (err) {
    // Non-blocking – audit log failure should not break main operations
    console.error("Audit log write failed:", err.message);
  }
};
