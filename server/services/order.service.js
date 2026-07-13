import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import Order from "../models/orderModel.js";


import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import mongoose from "mongoose";

export const newOrder=CatchAsyncError(async(data,res, next)=>{
    const order= await Order.create(data);
    res.status(201).json({
        success:true,
        order,
      })
    
})

// get all orders

export const getAllOrdersService = async (res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  // Resolve user and course information for each order
  const resolvedOrders = await Promise.all(
    orders.map(async (order) => {
      let userName = "N/A";
      let userEmail = "N/A";
      let courseName = "N/A";
      let coursePrice = 0;

      try {
        if (order.userId && mongoose.Types.ObjectId.isValid(order.userId)) {
          const user = await User.findById(order.userId).select("name email");
          if (user) {
            userName = user.name;
            userEmail = user.email;
          }
        }
      } catch (err) {
        console.error("Error finding user for order:", err);
      }

      try {
        if (order.courseId && mongoose.Types.ObjectId.isValid(order.courseId)) {
          const course = await Course.findById(order.courseId).select("name price");
          if (course) {
            courseName = course.name;
            coursePrice = course.price;
          }
        }
      } catch (err) {
        console.error("Error finding course for order:", err);
      }

      return {
        ...order.toObject(),
        userName,
        userEmail,
        courseName,
        coursePrice,
      };
    })
  );

  res.status(201).json({
    success: true,
    orders: resolvedOrders,
  });
};