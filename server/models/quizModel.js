import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  explanation: {
    type: String,
  },
  image: {
    type: String,
  },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for backward compatibility, but set for new staff quizzes
    },
    sectionName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published", // default to published for backward compatibility
    },
    instructions: {
      type: String,
    },
    availableFrom: {
      type: Date,
    },
    availableUntil: {
      type: Date,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    deductionPerWrongAnswer: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    passMark: {
      type: Number,
      default: 70, // percentage
    },
    timeLimit: {
      type: Number, // in minutes, optional
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isRequiredForCert: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
