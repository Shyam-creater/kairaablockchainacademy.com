import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import GalleryImage from "../models/galleryModel.js";
import cloudinary from "cloudinary";


// upload gallery image
export const uploadGalleryImage = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;

    if (image) {
      console.log("Uploading thumbnail to Cloudinary");
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "gallery",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      console.log("Thumbnail uploaded:", data.image);
    }

    const galleryImage = await GalleryImage.create(data);

    console.log(galleryImage);
    res.status(200).json({
      success: true,
      galleryImage,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});



// get all gallery images
export const getAllGalleryImages = CatchAsyncError(async (req, res, next) => {
  try {
    const images = await GalleryImage.find({}).sort({ _id: -1 });;
    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


export const deleteGalleryImage=CatchAsyncError(async(req,res,next)=>{
try{
    const {id}= req.params;
    const image= await GalleryImage.findById(id);
    if(!image){
      return next(new ErrorHandler("Image not found",404))
    }
    
    await image.deleteOne({id});
    
    res.status(200).json({
      success:true,
      message:"Image deleted successfully"
    })
}catch(error){
    return next(new ErrorHandler(error.message, 500));
}
})

// edit gallery image
export const editGalleryImage = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;
    const galleryImageId = req.params.id;

    const galleryImage = await GalleryImage.findById(galleryImageId);

    if (!galleryImage) {
      return next(new ErrorHandler("Image not found", 404));
    }

    if (image && typeof image === "string" && image.startsWith("data:")) {
      // User uploaded a new image, delete old and upload new
      if (galleryImage.image && galleryImage.image.public_id) {
        await cloudinary.v2.uploader.destroy(galleryImage.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "gallery",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      // Keep existing image
      data.image = galleryImage.image;
    }

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      galleryImageId,
      {
        $set: data,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedImage,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

