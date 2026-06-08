import mongoose from "mongoose";


const registrationSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
    },
lastName:{
        type:String,
        
    },
    email:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    course:{
        type:String,
        required:true,
    }
},{timestamps:true})


const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;