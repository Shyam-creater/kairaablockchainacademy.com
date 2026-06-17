
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { redis } from "../utils/redis.js";
import  {User} from "../models/userModel.js"
import Registration from "../models/registrationModel.js";


// get user by Id
export const getUserById=async(id,res)=>{
    try {
        console.log("getUserById called for id:", id);
        const userJson= await redis.get(id);
        
        if(userJson){
            console.log("User found in redis");
            const user=JSON.parse(userJson);
            res.status(201).json({
                success:true,
                user
            });
        } else {
            console.log("User not in redis, querying DB for id:", id);
            const user = await User.findById(id);
            if (user) {
                console.log("User found in DB, sending response");
                res.status(201).json({
                    success: true,
                    user
                });
                console.log("Response sent from getUserById");
            } else {
                console.log("User not found in DB");
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        }
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ success: false, message: error.message });
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
