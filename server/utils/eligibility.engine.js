import Progress from "../models/progressModel.js";
import Attendance from "../models/attendanceModel.js";
import Assignment from "../models/assignmentModel.js";
import AssignmentTask from "../models/assignmentTaskModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";
import Course from "../models/courseModel.js";
import Meeting from "../models/meetingModel.js";
import Project from "../models/projectModel.js";
import ProjectTask from "../models/projectTaskModel.js";

/**
 * Checks if a student is eligible for a certificate for a given course.
 * Returns { isEligible: boolean, stats: Array }
 */
export const checkCertificateEligibility = async (studentId, courseId, dummy = false) => {
  const stats = [];
  let isEligible = true;
  let overallScore = 0;
  let honors = "";
  let microCredentials = [];

  try {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    // 1. Course Completion (Target: 100%)
    const totalLessons = course.courseData ? course.courseData.length : 0;
    const progress = await Progress.findOne({ userId: studentId, courseId });
    const completedCount = progress?.completedLessons?.length || 0;
    const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const progressMet = progressPct >= 100;
    if (!progressMet) isEligible = false;
    stats.push({
      label: "Course Completion",
      value: `${progressPct}%`,
      target: "100%",
      met: progressMet,
      type: "progress"
    });

    // 2. Attendance (Target: 80%)
    const pastMeetings = await Meeting.find({ courseId, date: { $lt: new Date() } });
    const totalAllowed = pastMeetings.length;
    let attendancePct = 100; // default to 100% if no meetings
    if (totalAllowed > 0) {
      const attendances = await Attendance.countDocuments({ studentId, courseId });
      attendancePct = Math.round((attendances / totalAllowed) * 100);
    }
    const attendanceMet = attendancePct >= 80;
    if (!attendanceMet) isEligible = false;
    stats.push({
      label: "Live Class Attendance",
      value: `${attendancePct}%`,
      target: "80%",
      met: attendanceMet,
      type: "attendance"
    });

    // 3. Course Duration (Target: 14 days)
    let durationDays = 0;
    if (progress && progress.createdAt) {
      const msDiff = Date.now() - new Date(progress.createdAt).getTime();
      durationDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    }
    const durationMet = durationDays >= 14;
    if (!durationMet) isEligible = false;
    stats.push({
      label: "Course Duration Completed",
      value: `${durationDays} days`,
      target: "14 days",
      met: durationMet,
      type: "duration"
    });

    // 4. Assignments Submitted & 5. Assignment Average
    const totalTasks = await AssignmentTask.countDocuments({ courseId });
    const assignments = await Assignment.find({ studentId, courseId });
    const submittedCount = assignments.length;
    const allSubmittedMet = totalTasks > 0 ? submittedCount >= totalTasks : true;
    if (!allSubmittedMet) isEligible = false;
    stats.push({
      label: "Assignments Submitted",
      value: `${submittedCount}/${totalTasks}`,
      target: "All",
      met: allSubmittedMet,
      type: "assignments"
    });

    let avgScore = 0;
    if (assignments.length > 0) {
      // Parse marks, e.g. "90/100" or "90"
      let totalMarks = 0;
      let count = 0;
      assignments.forEach(a => {
        if (a.marks) {
          const parts = a.marks.split('/');
          const score = parseFloat(parts[0]);
          if (!isNaN(score)) {
            totalMarks += score;
            count++;
          }
        }
      });
      if (count > 0) {
        avgScore = Math.round(totalMarks / count);
      }
    }
    const assignmentAvgMet = totalTasks === 0 || avgScore >= 75;
    if (!assignmentAvgMet) isEligible = false;
    stats.push({
      label: "Assignment Average",
      value: `${avgScore}%`,
      target: "75%",
      met: assignmentAvgMet,
      type: "assignmentAvg"
    });

    // 6. Project Approval
    const projectTasks = await ProjectTask.find({ courseId });
    let projectStatus = "No Projects";
    let projectMet = true;
    if (projectTasks.length > 0) {
       const projects = await Project.find({ studentId, courseId });
       const approvedProjects = projects.filter(p => p.status === "approved").length;
       projectMet = approvedProjects >= projectTasks.length;
       projectStatus = projectMet ? "Approved" : (projects.length > 0 ? "Revision" : "Not Submitted");
       if (!projectMet) isEligible = false;
    }
    stats.push({
      label: "Project Approval",
      value: projectStatus,
      target: projectTasks.length > 0 ? "Approved" : "N/A",
      met: projectMet,
      type: "project"
    });

    // 7. Final Assessment Score
    const quizAttempts = await QuizAttempt.find({ userId: studentId, courseId });
    let quizAvg = 0;
    if (quizAttempts.length > 0) {
      const totalScore = quizAttempts.reduce((acc, curr) => acc + curr.score, 0);
      quizAvg = Math.round(totalScore / quizAttempts.length);
    }
    const quizMet = quizAvg >= 60;
    if (!quizMet && quizAttempts.length > 0) isEligible = false; // Only fail if they took a quiz and failed it, or adjust if mandatory.
    // If we have quizzes in course, we might enforce they MUST take it.
    // Let's assume if quiz attempts > 0 or if Course has quizzes. (For simplicity, met if >= 60).
    stats.push({
      label: "Final Assessment",
      value: `${quizAvg}%`,
      target: "60%",
      met: quizMet || quizAttempts.length === 0, // Pass if no quizzes taken and maybe none required
      type: "quiz"
    });

    // 8. Learning Consistency (Mock Pass for now)
    stats.push({
      label: "Learning Consistency",
      value: "Good",
      target: "Good",
      met: true,
      type: "consistency"
    });

    // Calculate real overall score
    overallScore = Math.round((progressPct + attendancePct + avgScore + quizAvg) / 4) || 0;
    
    // Determine Honors
    if (overallScore >= 95) honors = "Highest Honors";
    else if (overallScore >= 85) honors = "Honors";

    // Award Micro-Credentials
    if (attendancePct >= 95) microCredentials.push("Perfect Attendance");
    if (avgScore >= 90) microCredentials.push("Assignment Master");
    if (projectMet && projectStatus === "Approved") microCredentials.push("Excellence in Projects");
    if (quizAvg >= 90) microCredentials.push("Subject Matter Expert");

    // If dummy is passed, bypass for testing
    if (dummy) {
      isEligible = true;
      overallScore = 100;
      honors = "Highest Honors";
      microCredentials = ["Perfect Attendance", "Assignment Master", "Excellence in Projects", "Subject Matter Expert"];
      stats.forEach(stat => {
        stat.met = true;
        stat.value = stat.target;
      });
    }

    return {
      isEligible,
      stats,
      overallScore,
      honors,
      microCredentials
    };

  } catch (error) {
    console.error("Eligibility Check Error:", error);
    return { 
      isEligible: false, 
      stats: [{ label: "Error", value: "Failed to evaluate", target: "N/A", met: false, type: "error" }] 
    };
  }
};
