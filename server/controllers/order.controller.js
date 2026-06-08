

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
        .createHmac("sha256", "LhNWI8qsCZpIUsRIMG21EYwK")
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

        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      // if(order){
        
        return res.status(200).json(order);
      }
      
    // }
  
  );
  }
  catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    })
  }
}

);
