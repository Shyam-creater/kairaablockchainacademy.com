const fs = require('fs');

const path = 'server/controllers/student.controller.js';
let content = fs.readFileSync(path, 'utf8');

const newImports = `import ProjectTask from "../models/projectTaskModel.js";
import Project from "../models/projectModel.js";
`;

content = content.replace('import Assignment from "../models/assignmentModel.js";', 'import Assignment from "../models/assignmentModel.js";\n' + newImports);

const newFunctions = `
// ==================== PROJECT FUNCTIONS ====================
export const getCourseProjectTasks = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const projectTasks = await ProjectTask.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projectTasks,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getStudentProjects = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?._id;

    const projects = await Project.find({ studentId, courseId })
      .populate('projectTaskId')
      .populate('staffId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const submitProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, projectTaskId, submissionLink, message } = req.body;
    const studentId = req.user?._id;

    const task = await ProjectTask.findById(projectTaskId);
    if (!task) return next(new ErrorHandler("Project task not found", 404));

    let project = await Project.findOne({ studentId, projectTaskId });

    if (project) {
       project.submissionLink = submissionLink;
       project.status = 'pending';
       if(message) {
         project.replies.push({ sender: 'student', message });
       }
       await project.save();
    } else {
       project = await Project.create({
         studentId,
         courseId,
         staffId: task.staffId,
         projectTaskId,
         submissionLink,
         status: 'pending',
         replies: message ? [{ sender: 'student', message }] : [],
       });
    }

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const studentReplyProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { projectId, message, attachment } = req.body;
    const studentId = req.user?._id;

    const project = await Project.findOne({ _id: projectId, studentId });
    if (!project) return next(new ErrorHandler("Project not found", 404));

    project.replies.push({
      sender: "student",
      message,
      attachment
    });

    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
`;

fs.writeFileSync(path, content + newFunctions);
console.log('student controller updated');
