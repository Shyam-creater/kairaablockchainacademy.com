import mongoose from "mongoose";
import Order from "./models/orderModel.js";
import { User } from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB...");

    const orders = await Order.find({ assignedStaffId: { $exists: true, $ne: null } });
    console.log(`Found ${orders.length} orders with assigned staff.`);

    let updated = 0;
    for (const order of orders) {
      if (order.courseId && order.assignedStaffId) {
        await User.findByIdAndUpdate(order.assignedStaffId, {
          $addToSet: { assignedCourses: order.courseId }
        });
        updated++;
      }
    }

    console.log(`Successfully synced ${updated} staff course assignments.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
