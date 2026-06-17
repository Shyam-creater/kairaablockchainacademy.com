import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    tags: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
