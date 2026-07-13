import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Layout } from "../models/layout.model.js";
import cloudinary from "cloudinary";

// create layout
export const createLayout = CatchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.body;

    // if layout type already exists
    const isTypeExist = await Layout.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exist`, 400));
    }

    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        foler: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await Layout.create(banner);
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await Layout.create({ type: "FAQ", faq: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;

      const categoriesItem = await Promise.all(
        categories.map(async (item) => {
          return {
            title: item.title,
          };
        })
      );

      await Layout.create({ type: "Categories", categories: categoriesItem });
    }

    res.status(200).json({
      success: true,
      message: "Layout created successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// edit layout

export const editLayout = CatchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type === "Banner") {
      const bannerData = await Layout.findOne({ type: "Banner" });
      const { image, title, subTitle } = req.body;

      if (bannerData) {
        await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(image, {
        foler: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await Layout.findByIdAndUpdate(bannerData._id, { banner });
    }

    if (type === "FAQ") {
      const { faq } = req.body;

      const faqItem = await Layout.findOne({ type: "FAQ" });
      const faqItems = await Promise.all(
        faq.map(async (item) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await Layout.findByIdAndUpdate(faqItem?._id, {
        type: "FAQ",
        faq: faqItems,
      });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryItem = await Layout.findOne({ type: "Categories" });
      const categoriesItem = await Promise.all(
        categories.map(async (item) => {
          return {
            title: item.title,
          };
        })
      );

      await Layout.findByIdAndUpdate(categoryItem?._id,{ type: "Categories", categories: categoriesItem });
    }

    res.status(200).json({
      success: true,
      message: "Layout updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// get layout by type

export const getLayoutByType= CatchAsyncError(async(req,res,next)=>{
    try{
        const {type}=req.body;
const layout= await Layout.findOne({type});
res.status(201).json({
    success:true,
    layout
})
    }catch(error){
        return next(new ErrorHandler(error.message,500))
    }
})