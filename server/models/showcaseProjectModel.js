import mongoose from "mongoose";

const showcaseProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tech: [
      {
        type: String,
      }
    ],
    imgUrl: {
      public_id: { type: String, default: "" },
      url: { type: String, required: true },
    },
    githubUrl: {
      type: String,
      default: "",
    },
    demoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ShowcaseProject = mongoose.model("ShowcaseProject", showcaseProjectSchema);

export default ShowcaseProject;
