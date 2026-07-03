

import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail.js";
import Notification from "../models/notificationModel.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";
import { fileURLToPath } from "url";
import { redis } from "../utils/redis.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLISHABLE_KEY,
  key_secret:process.env.RAZORPAY_SECRET_KEY,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// get all orders- only for admin
export const getAllOrders = CatchAsyncError(async (req, res, next) => {
  try {
    getAllOrdersService(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// send razorpay publishable key
export const sendRazorpayKey = CatchAsyncError(async (req, res) => {
  res.status(200).json({
    publishablekey: process.env.RAZORPAY_PUBLISHABLE_KEY,
  });
});



export const verifyorder = CatchAsyncError(async (req, res) => {
  

  try {
    const user = await User.findById(req?.user?._id);


      const sign = `${req.body.response.razorpay_order_id}|${req.body.response.razorpay_payment_id}`;

      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(sign)
        .digest("hex");



      const verified = req.body.response.razorpay_signature === expectedSign;
    

      ////////////////////
      if(verified){
        const course = await Course.findById(req.body.couresId);

        const mailData = {
          order: {
            _id: course?._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        };
  
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/order-confirmation.ejs"),
          { order: mailData }
        );
        try {
  
          user?.courses.push(course?._id);
          await redis.set(req.user?._id, JSON.stringify(user));
          await user?.save();
  
          course.purchased = course.purchased + 1;
  
          await course.save();
  
          if (user) {
  
            await sendMail({
              email: user.email,
              subject: "Order Confirmation",
              template: "order-confirmation.ejs",
              data: mailData,
            });
  
          }
        } catch (error) {
          return res.status(500).json(error.message);
        }
      }
      ////////////////////

    const order = await instance.orders.fetchPayments(
      req.body.response.razorpay_order_id
    );

    const data = {
      courseId: req.body.couresId,
      userId: req.user?._id,
      payment_info: order?.items[0],
    };
    const orderData = await Order.create(data);
    res.status(201).json({
      success: true,
      orderData,
    });
  } catch (error) {
    // console.log(error, "hgjh")
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export const createorder = CatchAsyncError(async (req, res) => {
 
  try {

    const user = await User.findById(req?.user?._id);

    const courseExistInUser = user?.courses?.some( 
      (course) => course._id.toString() === req.body.couresId.toString()
    );
    if (courseExistInUser) {
      return res.status(400).json("You have already purchased this course");
    }
    const course = await Course.findById(req.body.couresId);
    if (!course) {
      return res.status(400).json("Course is not defined");

    }
    instance.orders.create(req.body.data, async function (err, order) {
      if (err) {
        console.error("Razorpay Order Creation Error details:", err);
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      return res.status(200).json(order);
    });
  }
  catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    })
  }
}
);

export const simulatePayment = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req?.user?._id);

    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    const courseExistInUser = user?.courses?.some(
      (course) => course._id.toString() === courseId.toString()
    );
    if (courseExistInUser) {
      return next(new ErrorHandler("You have already purchased this course", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Add course to user
    user?.courses.push(course?._id);
    await redis.set(req.user?._id.toString(), JSON.stringify(user));
    await user?.save();

    // Increment course purchased
    course.purchased = (course.purchased || 0) + 1;
    await course.save();

    // Create a dummy order
    const data = {
      courseId: courseId,
      userId: req.user?._id,
      payment_info: {
        id: `sim_${Date.now()}`,
        status: "verified",
        method: "SIMULATION"
      },
    };
    const orderData = await Order.create(data);

    res.status(201).json({
      success: true,
      orderData,
      message: "Simulation payment successful"
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const createManualOrder = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, transactionId } = req.body;
    const userId = req.user?._id;

    if (!courseId || !transactionId) {
      return next(new ErrorHandler("Course ID and Transaction ID are required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const courseExistInUser = user?.courses?.some(
      (course) => course._id.toString() === courseId.toString()
    );
    if (courseExistInUser) {
      return next(new ErrorHandler("You have already purchased this course", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const orderData = {
      courseId,
      userId,
      payment_info: {
        method: "UPI_QR",
        transactionId,
        status: "pending",
      },
    };

    const order = await Order.create(orderData);

    // Send email to admin
    const mailData = {
      user: {
        name: user.name,
        email: user.email,
      },
      courseName: course.name,
      price: course.price,
      transactionId,
    };

    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/manual-payment-request.ejs"),
        mailData
      );

      await sendMail({
        email: "support@kairaaacademy.com",
        subject: "New Manual Course Enrollment Request",
        template: "manual-payment-request.ejs",
        data: mailData,
      });
    } catch (mailErr) {
      console.error("Failed to send manual payment email to admin:", mailErr.message);
    }

    // Add push notification for admin
    await Notification.create({
      user: userId,
      title: "New Manual Enrollment Request",
      message: `${user.name} requested manual activation for ${course.name} (UTR: ${transactionId})`,
    });

    res.status(201).json({
      success: true,
      message: "Payment verification details submitted successfully",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update order status - only for admin
export const updateOrderStatus = CatchAsyncError(async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return next(new ErrorHandler("Order ID and Status are required", 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    if (order.payment_info.status === "verified") {
      return next(new ErrorHandler("Order is already verified", 400));
    }

    if (status === "verified") {
      const user = await User.findById(order.userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const course = await Course.findById(order.courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Add course to user if not already there
      const courseExistInUser = user?.courses?.some(
        (c) => c._id.toString() === course._id.toString()
      );
      if (!courseExistInUser) {
        user?.courses.push(course?._id);
        await redis.set(user._id.toString(), JSON.stringify(user));
        await user?.save();
      }

      // Update course purchase count
      course.purchased = (course.purchased || 0) + 1;
      await course.save();

      // Update order status
      order.payment_info.status = "verified";
      order.markModified("payment_info");
      await order.save();

      // Send email to student
      const mailData = {
        user: {
          name: user.name,
          email: user.email,
        },
        course: {
          name: course.name,
          price: course.price,
        },
        utr: order.payment_info.transactionId,
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Payment Verified & Enrollment Confirmed - Kairaa Blockchain Academy",
          template: "manual-payment-verified.ejs",
          data: mailData,
        });
      } catch (mailErr) {
        console.error("Failed to send manual payment confirmation email to student:", mailErr.message);
      }
    } else {
      order.payment_info.status = status;
      order.markModified("payment_info");
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
