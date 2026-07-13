import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

const liveSessionSchema = new mongoose.Schema({
  title: String,
  description: String,
  scheduledAt: Date,
  meetingUrl: String,
  maxParticipants: Number,
  recordingUrl: String,
});

const courseDataSchema = new mongoose.Schema({
  videoUrl: String,
  videoThumbnail: {
    public_id: String,
    url: String,
  },
  title: {
    type: String,
    trim: true,
  },
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: {
    type: String,
    enum: ["Cloudinary", "Vimeo", "YouTube", "AWS", "Local"],
  },
  resources: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Draft", "Review", "Published", "Hidden", "Archived"],
      default: "Draft",
    },
    courseType: {
      type: String,
      enum: ["Self Paced", "Live", "Hybrid"],
      default: "Self Paced",
    },
    visibility: {
      type: String,
      enum: ["Public", "Private", "Staff Only"],
      default: "Public",
    },
    version: {
      type: String,
      default: "1.0",
    },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newCourseBadge: { type: Boolean, default: false },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    currency: { type: String, default: "INR" },
    discountPercentage: Number,
    offerEndDate: Date,
    emiAvailable: { type: Boolean, default: false },
    refundPolicy: String,
    lifetimeAccess: { type: Boolean, default: true },
    freePreview: { type: Boolean, default: false },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    level: {
      type: String,
    },
    demoUrl: {
      type: String,
    },
    learningOutcomes: [{ title: String }],
    prerequisites: [{ title: String }],

    toolsCovered: [
      {
        name: String,
        logo: String,
      },
    ],
    careerPaths: [
      {
        title: String,
        expectedSalary: String,
      },
    ],

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: String,
      openGraphImage: String,
      canonicalUrl: String,
    },
    brochure: String,
    roadmapPdf: String,
    sampleNotes: String,
    enrollmentStart: Date,
    enrollmentEnd: Date,
    maximumStudents: Number,
    waitlistEnabled: { type: Boolean, default: false },
    modulesCount: { type: Number, default: 0 },
    lessonsCount: { type: Number, default: 0 },
    totalDuration: { type: String },
    estimatedStudyHours: { type: String },
    weeklyStudyHours: { type: String },
    projectsCount: { type: Number, default: 0 },
    assignmentCount: { type: Number, default: 0 },
    quizCount: { type: Number, default: 0 },
    downloadableResourcesCount: { type: Number, default: 0 },
    liveSessionCount: { type: Number, default: 0 },
    communityAccess: { type: Boolean, default: false },
    mobileAccess: { type: Boolean, default: true },
    desktopAccess: { type: Boolean, default: true },
    offlineAccess: { type: Boolean, default: false },

    reviews: [reviewSchema],
    courseContentData: [courseDataSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    language: {
      type: String,
      default: "English",
    },
    certificate: {
      enabled: { type: Boolean, default: true },
      type: {
        type: String,
        enum: ["Completion", "Excellence", "Industry", "NFT"],
        default: "Completion",
      },
    },
    syllabusUrl: {
      type: String,
    },
    liveSessions: [liveSessionSchema],
  },
  { timestamps: true }
);

courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ bestseller: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ level: 1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;