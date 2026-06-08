import mongoose from "mongoose";

const galleryImageSchema=new mongoose.Schema({
    image:{
        public_id:{
            type:String,
        },
        url:{
        type:String,
        },
    },
    description:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true,

    },
    tags:{
        type:String,
        required:true,
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        type: String,
        // required: true,
    }
},{timestamps:true})

const GalleryImage= mongoose.model("",galleryImageSchema);

export default GalleryImage;