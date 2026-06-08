import express from "express";
import { activateUser, loginUser, registrationUser,logoutUser, getUserInfo, socialAuth, updateUserInfo, updatePassword,updateProfilePicture, getAllUsers, updateUserRole, deleteUser, updateAccessToken, courseRegistration,getAllRegistrations } from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated} from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser)
userRouter.post('/register-course', courseRegistration)
userRouter.post('/login',loginUser);
userRouter.get('/logout',isAuthenticated, logoutUser);
userRouter.get('/me',isAuthenticated,getUserInfo);
userRouter.post('/social-auth',socialAuth);
userRouter.put('/update-user-info',isAuthenticated,updateUserInfo);
userRouter.put('/update-user-password', isAuthenticated, updatePassword);
userRouter.put('/update-user-avatar', isAuthenticated, updateProfilePicture);
userRouter.get('/get-all-users', isAuthenticated, authorizeRoles("admin"),getAllUsers);
userRouter.get('/get-all-registrations', isAuthenticated, authorizeRoles("admin"),getAllRegistrations);
userRouter.put('/update-user-role', isAuthenticated, authorizeRoles("admin"),updateUserRole);
userRouter.delete('/delete-user/:id', isAuthenticated, authorizeRoles("admin"),deleteUser);

export default userRouter;