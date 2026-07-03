import Order from "../models/orderModel.js";

export const getAuthorizedStaffStudents = async (staffId, courseId = null) => {
  const query = { assignedStaffId: staffId };
  if (courseId) {
    query.courseId = courseId;
  }
  const orders = await Order.find(query).lean();
  return orders.map(o => o.userId).filter(Boolean);
};
