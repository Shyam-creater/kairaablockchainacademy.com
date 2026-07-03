// import express from "express";
// import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
// import { createOrder, getAllOrders, verifyorder} from "../controllers/order.controller.js";

// const orderRouter=express.Router();
// orderRouter.post("/verifyorder", isAuthenticated,verifyorder )

// orderRouter.post("/create-order", isAuthenticated,createOrder )
// orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"),getAllOrders )

// import express from "express";
// import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
// import { createOrder, getAllOrders, verifyorder} from "../controllers/order.controller.js";

// const orderRouter=express.Router();
// orderRouter.post("/verifyorder", isAuthenticated,verifyorder )

// orderRouter.post("/create-order", isAuthenticated,createOrder )
// orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"),getAllOrders )



// export default orderRouter;

import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { createorder, getAllOrders, verifyorder, createManualOrder, updateOrderStatus, sendRazorpayKey, simulatePayment} from "../controllers/order.controller.js";
// import { createOrder, createRazorpayOrder, getAllOrders,verifyOrder} from "../controllers/order.controller.js";

const orderRouter=express.Router();

// orderRouter.post("/create-order", isAuthenticated,createOrder )
orderRouter.post("/verifyorder", isAuthenticated,verifyorder )
orderRouter.post("/createorder", isAuthenticated,createorder )
orderRouter.post("/simulate-payment", isAuthenticated, simulatePayment);
orderRouter.post("/create-manual-order", isAuthenticated, createManualOrder)
orderRouter.put("/update-order-status", isAuthenticated, authorizeRoles("admin"), updateOrderStatus)
orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"),getAllOrders )
// orderRouter.post("/payment/razorpay", isAuthenticated,verifyOrder )
orderRouter.get("/payment/razorpaypublishablekey", isAuthenticated, sendRazorpayKey);
// orderRouter.post("create-razorpay-order", isAuthenticated,createRazorpayOrder)


export default orderRouter;
