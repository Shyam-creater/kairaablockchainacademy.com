import express from "express";
import { deleteGalleryImage, getAllGalleryImages, uploadGalleryImage, editGalleryImage, getGalleryAlbums, updateGalleryFeatured } from "../controllers/gallery.Controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";


const galleryRoute = express.Router();

galleryRoute.post("/upload-image",isAuthenticated,authorizeRoles("admin"),uploadGalleryImage);
galleryRoute.post("/delete-image/:id",isAuthenticated,authorizeRoles("admin"),deleteGalleryImage);
galleryRoute.put("/edit-image/:id",isAuthenticated,authorizeRoles("admin"),editGalleryImage);
galleryRoute.get("/get-all-images",getAllGalleryImages);

// Albums
galleryRoute.get("/get-albums", getGalleryAlbums);

// Featured Toggle
galleryRoute.patch("/feature-image/:id", isAuthenticated, authorizeRoles("admin"), updateGalleryFeatured);

export default galleryRoute;
