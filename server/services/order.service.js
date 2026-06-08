import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import Order from "../models/orderModel.js";


export const newOrder=CatchAsyncError(async(data,res, next)=>{
    const order= await Order.create(data);
    res.status(201).json({
        success:true,
        order,
      })
    
})

// get all orders

export const getAllOrdersService= async(res)=>{
  const orders= await Order.find().sort({createdAt:-1});
  res.status(201).json({
      success:true,
      orders,
  })
}