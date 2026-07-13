import mongoose from 'mongoose';
import Course from './models/courseModel.js';
import Progress from './models/progressModel.js';
import Order from './models/orderModel.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DB_URL).then(async () => {
    const orders = await Order.find().sort({ createdAt: -1 });
    if(orders.length === 0) { console.log('no orders'); process.exit(0); }
    
    const studentId = orders[0].userId;
    const progressRecords = await Progress.find({ userId: studentId }).populate('courseId');
    
    const latestCourse = await Course.findById(orders[0].courseId);
    console.log('Latest course:', latestCourse.name);
    console.log('Total lessons:', latestCourse.courseData?.length || latestCourse.courseContentData?.length || 0);
    
    const currentProgress = progressRecords.find(p => p.courseId?._id?.toString() === latestCourse._id.toString());
    console.log('Completed lessons in latest course:', currentProgress?.completedLessons?.length || 0);
    
    const totalLessonsInCurrentCourse = latestCourse.courseData?.length || latestCourse.courseContentData?.length || 0;
    const currentCourseCompletedLessons = currentProgress?.completedLessons?.length || 0;
    
    const overallProgress = totalLessonsInCurrentCourse > 0 ? Math.min(100, Math.round((currentCourseCompletedLessons / totalLessonsInCurrentCourse) * 100)) : 0;
    console.log('Calculated Progress:', overallProgress);
    
    process.exit(0);
});
