import mongoose from "mongoose";


const notificationSchema= new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},
type: {
    type: String,
    enum: ["doubt", "assignment", "meeting", "system", "general"],
    default: "general"
},
title:{
    type:String,
    required:true
},
message:{
    type:String,
    required:true
},
status:{
    type:String,
    required:true,
    default:"unread"
},
},{timestamps:true})


const Notification= mongoose.model("Notification", notificationSchema);

export default Notification;