import express from "express";
import { deleteGalleryImage, getAllGalleryImages, uploadGalleryImage } from "../controllers/gallery.Controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";


const galleryRoute = express.Router();

galleryRoute.post("/upload-image",isAuthenticated,authorizeRoles("admin"),uploadGalleryImage);
galleryRoute.post("/delete-image/:id",isAuthenticated,authorizeRoles("admin"),deleteGalleryImage);
galleryRoute.get("/get-all-images",getAllGalleryImages);

export default galleryRoute;

