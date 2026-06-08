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
import { createorder, getAllOrders,verifyorder} from "../controllers/order.controller.js";
// import { createOrder, createRazorpayOrder, getAllOrders,sendRazorpayKey,verifyOrder} from "../controllers/order.controller.js";

const orderRouter=express.Router();

// orderRouter.post("/create-order", isAuthenticated,createOrder )
orderRouter.post("/verifyorder", isAuthenticated,verifyorder )
orderRouter.post("/createorder", isAuthenticated,createorder )
orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"),getAllOrders )
// orderRouter.post("/payment/razorpay", isAuthenticated,verifyOrder )
// orderRouter.get("payment/razorpaypublishablekey",isAuthenticated,sendRazorpayKey);
// orderRouter.post("create-razorpay-order", isAuthenticated,createRazorpayOrder)


export default orderRouter;
