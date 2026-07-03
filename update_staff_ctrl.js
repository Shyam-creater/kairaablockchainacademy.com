const fs = require('fs');
const path = 'server/controllers/staff.controller.js';
let content = fs.readFileSync(path, 'utf8');

const newImports = `import ProjectTask from "../models/projectTaskModel.js";
import Project from "../models/projectModel.js";
`;
content = content.replace('import AssignmentTask from "../models/assignmentTaskModel.js";', 'import AssignmentTask from "../models/assignmentTaskModel.js";\n' + newImports);

const newFunctions = `
// ==================== PROJECT FUNCTIONS ====================
export const createProjectTask = CatchAsyncError(async (req, res, next) => {
  try {
    const { courseId, batchId, title, description, dueDate } = req.body;
    const staffId = req.user?._id;

    const task = await ProjectTask.create({
      staffId,
      courseId,
      batchId,
      title,
      description,
      dueDate,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getStaffProjects = CatchAsyncError(async (req, res, next) => {
  try {
    const staffId = req.user?._id;
    // Get all projects for tasks assigned by this staff
    const projects = await Project.find({ staffId })
      .populate('studentId', 'name avatar email')
      .populate('courseId', 'name')
      .populate('projectTaskId', 'title')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const staffReviewProject = CatchAsyncError(async (req, res, next) => {
  try {
    const { projectId, status, marks, message } = req.body;
    const staffId = req.user?._id;

    const project = await Project.findOne({ _id: projectId, staffId });
    if (!project) return next(new ErrorHandler("Project not found or unauthorized", 404));

    if (status) project.status = status;
    if (marks) project.marks = marks;

    if (message) {
      project.replies.push({
        sender: 'staff',
        message,
      });
    }

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
console.log('staff.controller.js updated');
