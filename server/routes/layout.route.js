import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller.js";

const layoutRouter= express.Router();

layoutRouter.post("/create-layout", isAuthenticated,authorizeRoles("admin"),createLayout)
layoutRouter.put("/update-layout", isAuthenticated,authorizeRoles("admin"),editLayout)
layoutRouter.get("/get-layout", isAuthenticated,authorizeRoles("admin"),getLayoutByType)

export default layoutRouter;