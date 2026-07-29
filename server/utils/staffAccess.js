import Order from "../models/orderModel.js";

export const getAuthorizedStaffStudents = async (staffId) => {
  try {
    const orders = await Order.find({ assignedStaffId: staffId });
    // Extract unique userIds
    const studentIds = [...new Set(orders.map(order => order.userId))];
    return studentIds;
  } catch (error) {
    console.error("Error fetching authorized staff students:", error);
    return [];
  }
};
