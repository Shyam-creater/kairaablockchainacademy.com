import NeetPurchase from "../models/neetPurchaseModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";


// Create NEET Purchase
export const createNeetPurchase = CatchAsyncError(async (req, res, next) => {
  const { yearId, year, fileId, fileTitle, subject, amount, paymentId } = req.body;
  
  if (!yearId || !year || !fileId || !fileTitle || !subject || !amount || !paymentId) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const purchase = await NeetPurchase.create({
    userId: req.user._id,
    yearId,
    year,
    fileId,
    fileTitle,
    subject,
    amount,
    paymentId,
  });

  res.status(201).json({
    success: true,
    purchase,
  });
});

// Get User's NEET Purchases
export const getUserNeetPurchases = CatchAsyncError(async (req, res, next) => {
  const purchases = await NeetPurchase.find({ userId: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    purchases,
  });
});

// Admin: Get all NEET Purchases with Pagination
export const getAllNeetPurchases = CatchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  const total = await NeetPurchase.countDocuments();
  const purchases = await NeetPurchase.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    purchases,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// Admin: Get NEET Purchases Summary
export const getNeetPurchasesSummary = CatchAsyncError(async (req, res, next) => {
  const total = await NeetPurchase.countDocuments();
  
  const revenueAgg = await NeetPurchase.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
  ]);
  const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const last30DaysCount = await NeetPurchase.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  
  const last30DaysRevAgg = await NeetPurchase.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
  ]);
  const last30DaysRevenue = last30DaysRevAgg.length > 0 ? last30DaysRevAgg[0].totalRevenue : 0;

  const avgOrderValue = total > 0 ? Math.round(revenue / total) : 0;

  res.status(200).json({
    success: true,
    summary: {
      total,
      revenue,
      avgOrderValue,
      last30Days: {
        count: last30DaysCount,
        revenue: last30DaysRevenue
      }
    }
  });
});
