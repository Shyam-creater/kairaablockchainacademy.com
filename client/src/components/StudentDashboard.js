import React, { useState, useEffect } from "react";
import { useGetStudentDashboardMetricsQuery } from "../redux/features/student/studentApi";
import { 
  FiHome, FiBook, FiBriefcase, FiCheckSquare, 
  FiUsers, FiAward, FiTarget, FiSettings, 
  FiBell, FiMessageSquare, FiTrendingUp,
  FiArrowRight, FiCheckCircle, FiPlayCircle,
  FiMoreHorizontal, FiPlus, FiGithub, FiExternalLink, FiStar,
  FiVideo, FiCalendar, FiSend, FiPaperclip, FiCircle, FiDownload, FiSearch, FiUpload, FiAlertCircle, FiLoader, FiArrowLeft, FiClock, FiFileText, FiHeart
} from "react-icons/fi";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import CourseContent from "./Course/CourseContent";
import StudentCertificatesPage from "../pages/Student/StudentCertificatesPage";
import WorkspaceProjects from "./WorkspaceProjects";
import { 
  useGetStudentAssignmentsQuery, 
  useGetCourseAssignmentTasksQuery, 
  useSubmitAssignmentMutation,
  useGetCourseContentQuery,
  useGetStudentDoubtsQuery,
  useCreateDoubtMutation,
  useStudentReplyDoubtMutation,
  useGetStudentMeetingsQuery,
  useMarkAttendanceMutation,
  useGetQuizForSectionQuery,
  useSubmitQuizMutation,
  useGetCourseDetailsQuery,
  useGetUserAllCoursesQuery
} from "../redux/features/courses/coursesApi.js";
import { toast } from "react-hot-toast";

const StudentDashboard = ({ user, courses }) => {
  const { data, isLoading } = useGetStudentDashboardMetricsQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'profile' ? 'home' : currentPath;
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeCourseTab, setActiveCourseTab] = useState(0);
  const [pendingRecordingUrl, setPendingRecordingUrl] = useState(null);
  const [pendingRecordingTitle, setPendingRecordingTitle] = useState(null);

  // Initialize activeCourseId to first course if available
  useEffect(() => {
    if (courses && courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0]._id);
    }
  }, [courses, activeCourseId]);

  const currentCourse = courses && courses.length > 0 ? courses[0] : null;
  const { data: courseDetailsData } = useGetCourseDetailsQuery(activeCourseId, { skip: !activeCourseId });
  const globalCourseName = courseDetailsData?.course?.name || currentCourse?.title || currentCourse?.name || "Course";
  const globalInstructorName = courseDetailsData?.course?.author || courseDetailsData?.course?.instructorName || "Instructor";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-[#050810]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary border-opacity-80"></div>
      </div>
    );
  }

  const metrics = data?.data || {};
  const { 
    heatmap = { activity: [] }, 
    digitalTwin = { strengths: [], weakAreas: [] },
    activityFeed = { events: [] },
    pendingAssignments = [],
    upcomingMeetings = [],
    placement = { readinessScore: 0, status: 'Learning' },
    achievements = { badges: [] },
    xpData = { totalXP: 0, level: 1 },
    pendingAssignmentsCount = 0,
    pendingProjectsCount = 0,
    pendingQuizCount = 0,
    unrepliedDoubtsCount = 0,
    upcomingMeetingsCount = 0
  } = metrics;
  
  const formatDateSafe = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTimeSafe = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  // Internal components extracted to StudentDashboardViews.js

  const navItems = [
    { id: 'home', name: 'Home', icon: <FiHome /> },
    { id: 'learning', name: 'My Learning', icon: <FiBook /> },
    { id: 'assignments', name: 'Assignments', icon: <FiBriefcase />, alertCount: pendingAssignmentsCount },
    { id: 'projects', name: 'Projects', icon: <FiTarget />, alertCount: pendingProjectsCount },
    { id: 'quiz', name: 'Quiz', icon: <FiCheckSquare />, alertCount: pendingQuizCount },
    { id: 'meetings', name: 'Live Meetings', icon: <FiVideo />, alertCount: upcomingMeetingsCount },
    { id: 'ask-doubt', name: 'Ask Doubt', icon: <FiMessageSquare />, alertCount: unrepliedDoubtsCount },
    { id: 'resources', name: 'Resources', icon: <FiPaperclip /> },
    { id: 'attendance', name: 'Attendance', icon: <FiCalendar /> },
    { id: 'certificates', name: 'Certificates', icon: <FiAward /> },
    { id: 'placement', name: 'Placement', icon: <FiTrendingUp /> },
    { id: 'neet', name: 'NEET Prep', icon: <FiTarget /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 pt-[80px] z-10 bg-white"
    >
      <div className="flex h-full w-full bg-[#F9FAFB] text-[#111827] overflow-hidden font-sans">
        
        {/* LEFT SIDEBAR (Persistent) */}
        <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col h-full flex-shrink-0">
          <div className="p-6 border-b border-[#E5E7EB]">
            <h1 className="text-xl font-extrabold tracking-tight">Student Portal</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/profile/${item.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#F3F4F6] text-[#111827]' 
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                  {item.alertCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white shadow-sm"></span>
                    </span>
                  )}
                </div>
                {item.name}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-[#E5E7EB] flex items-center gap-3">
             <img src={user?.avatar?.url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100"} alt="User" className="w-8 h-8 rounded-full object-cover" />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate">{user?.name || "Student"}</p>
               <p className="text-xs text-[#6B7280] truncate">Lvl 2 • 500 XP</p>
             </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE (Dynamic Content) */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-white flex flex-col h-full relative">
           
           <Outlet context={{ 
  user, courses, currentCourse, activeCourseId, setActiveCourseId,
  activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
  pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
  activityFeed, pendingAssignments, upcomingMeetings, placement, achievements,
  xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
  navigate
}} />
           
           {/* FLOATING ACTION BAR (Mobile/Tablet Only) */}
           <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 xl:hidden z-50 border border-white/10">
              <button onClick={() => navigate('/profile/course-viewer')} className="flex flex-col items-center gap-1 text-[#00f2fe] hover:text-white transition-colors">
                 <FiPlayCircle size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">Resume</span>
              </button>
              <button onClick={() => navigate('/profile/ai-copilot')} className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors">
                 <FiTarget size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">AI</span>
              </button>
              <button onClick={() => navigate('/profile/ask-doubt')} className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors">
                 <FiMessageSquare size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">Ask</span>
              </button>
           </div>

        </main>

        {/* RIGHT INTELLIGENCE PANEL (Persistent) */}
        {activeTab !== 'course-viewer' && (
          <aside className="w-80 bg-[#F9FAFB] border-l border-[#E5E7EB] flex flex-col h-full flex-shrink-0 hidden xl:flex">
            <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center bg-white">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B7280]">Intelligence</h2>
              <div className="flex gap-2 text-[#6B7280]">
                 <FiBell className="cursor-pointer hover:text-[#111827]" />
                 <FiMessageSquare className="cursor-pointer hover:text-[#111827]" />
              </div>
            </div>
            <div className="p-6 space-y-8 overflow-y-auto">
               
               <div>
                 <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-2"><FiTrendingUp /> AI Insights</h3>
                 <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] text-sm text-[#374151] leading-relaxed shadow-sm">
                    You are currently ranked <strong>#8</strong> in your cohort. Your Smart Contract scores are strong, but consider dedicating more time to frontend integration patterns.
                 </div>
               </div>

               <div>
                 <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Upcoming Deadlines & Meetings</h3>
                 <div className="space-y-3">
                    {upcomingMeetings.length > 0 ? upcomingMeetings.map((meeting, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500"></div>
                         <div>
                           <p className="text-sm font-bold text-[#111827]">{meeting.title || "Live Session"}</p>
                           <p className="text-xs text-[#6B7280]">{formatDateSafe(meeting.date)} • {formatTimeSafe(meeting.date)}</p>
                         </div>
                      </div>
                    )) : (
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300"></div>
                         <div>
                           <p className="text-sm text-[#6B7280]">No upcoming events scheduled.</p>
                         </div>
                      </div>
                    )}
                 </div>
               </div>

               <div>
                 <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Placement Alerts</h3>
                 <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-lg">
                    <p className="text-sm font-bold text-[#1E3A8A]">Resume Review Completed</p>
                    <p className="text-xs text-[#3B82F6] mt-1">Check feedback from the placement team.</p>
                 </div>
               </div>

            </div>
          </aside>
        )}

      </div>
    </motion.div>
  );
};

export default StudentDashboard;



