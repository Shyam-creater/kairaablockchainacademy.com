import mongoose from "mongoose";

const StudentSuccessScoreSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  healthStatus: { type: String, enum: ["Healthy", "Warning", "Critical"], default: "Healthy" },
  lastCalculated: { type: Date, default: Date.now }
});

const StudentRoadmapSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  currentNode: { type: String, default: "Basics" },
  completedNodes: [{ type: String }],
  progressPercentage: { type: Number, default: 0 }
});

const StudentAchievementsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  badges: [{
    title: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now }
  }]
});

const StudentSkillTreeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [{
    name: String, // e.g., "Solidity", "React", "Web3"
    level: { type: Number, default: 0, max: 100 }
  }]
});

const StudentPlacementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Learning", "Preparing", "Interview Ready", "Interview Scheduled", "Placed"], default: "Learning" },
  readinessScore: { type: Number, default: 0 },
  nextStep: { type: String, default: "Complete Capstone Project" },
  company: String,
  package: String
});

const StudentXPSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalXP: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  missedDays: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  lastActive: { type: Date }
});

const StudentHeatmapSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: [{
    date: { type: String }, // YYYY-MM-DD
    count: { type: Number, default: 1 }
  }]
});

const StudentDigitalTwinSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  strengths: [{ type: String }],
  weakAreas: [{ type: String }],
  attendancePattern: { type: String, default: "Regular" },
  learningPattern: { type: String, default: "Visual Learner" },
  bestStudyTime: { type: String, default: "Evening" },
  courseRiskScore: { type: Number, default: 0, min: 0, max: 100 }
});

const StudentActivityFeedSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  events: [{
    title: String,
    message: String,
    type: { type: String, enum: ["Assignment", "Mentor", "Certificate", "Batch", "System"], default: "System" },
    createdAt: { type: Date, default: Date.now }
  }]
});

export const StudentSuccessScore = mongoose.model("StudentSuccessScore", StudentSuccessScoreSchema);
export const StudentRoadmap = mongoose.model("StudentRoadmap", StudentRoadmapSchema);
export const StudentAchievements = mongoose.model("StudentAchievements", StudentAchievementsSchema);
export const StudentSkillTree = mongoose.model("StudentSkillTree", StudentSkillTreeSchema);
export const StudentPlacement = mongoose.model("StudentPlacement", StudentPlacementSchema);
export const StudentXP = mongoose.model("StudentXP", StudentXPSchema);
export const StudentHeatmap = mongoose.model("StudentHeatmap", StudentHeatmapSchema);
export const StudentActivityFeed = mongoose.model("StudentActivityFeed", StudentActivityFeedSchema);
export const StudentDigitalTwin = mongoose.model("StudentDigitalTwin", StudentDigitalTwinSchema);
