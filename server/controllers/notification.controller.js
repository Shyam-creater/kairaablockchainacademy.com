import Notification from "../models/notificationModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import cron from "node-cron";

export const getNotifications = CatchAsyncError(async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update notifications

export const updatedNotifications = CatchAsyncError(async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    } else {
      notification.status = "read";
    }
    await notification.save();
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete notification
cron.schedule("0 0 0 * * *", async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30*24 *60*60*1000);
    await Notification.deleteMany({status: "read", createdAt:{$lt: thirtyDaysAgo}})
})

