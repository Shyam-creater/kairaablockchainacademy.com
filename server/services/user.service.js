
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { redis } from "../utils/redis.js";
import  {User} from "../models/userModel.js"
import Registration from "../models/registrationModel.js";


// get user by Id
export const getUserById=async(id,res)=>{
const userJson= await redis.get(id)

if(userJson){
    const user=JSON.parse(userJson);
    res.status(201).json({
        success:true,
        user
    })
}

}


// get all users
export const getAllUsersService= async(res)=>{
    const users= await User.find().sort({createdAt:-1});
    res.status(201).json({
        success:true,
        users,
    })
}


// get all registrations
export const getAllRegistrationsService= async(res)=>{
    const registrations= await Registration.find().sort({createdAt:-1});
    res.status(201).json({
        success:true,
        registrations,
    })
}

// update user role
export const updateUserRoleService= async(res, id, role)=>{
    const user= await User.findByIdAndUpdate(id, {role}, {new:true});

res.status(201).json({
    success:true,
    user,
})
}
