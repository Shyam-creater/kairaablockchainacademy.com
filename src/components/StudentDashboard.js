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
import { useNavigate, useLocation } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'home');
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
      <div className="flex justify-center items-center h-[60vh] bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#111827]"></div>
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
    xpData = { totalXP: 0, level: 1 }
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

  // --- INTERNAL COMPONENTS FOR DYNAMIC CENTER WORKSPACE --- //

  const WorkspaceHome = () => {
    const [lastWatched, setLastWatched] = useState(null);
    useEffect(() => {
      if (user?._id) {
        const stored = localStorage.getItem(`lastWatched_${user._id}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.courseName === "My Course" && courses && courses.length > 0) {
              const found = courses.find(c => String(c._id) === String(parsed.courseId));
              if (found) parsed.courseName = found.name;
            }
            setLastWatched(parsed);
          } catch (e) {}
        }
      }
    }, [user?._id, activeTab, courses]);

    const generateHeatmap = () => {
      const activityMap = {};
      heatmap.activity.forEach(a => {
         const dateString = new Date(a.date).toISOString().split('T')[0];
         activityMap[dateString] = a.count;
      });
      const today = new Date();
      const past365Days = Array.from({ length: 365 }).map((_, i) => {
         const d = new Date();
         d.setDate(today.getDate() - (364 - i));
         return d.toISOString().split('T')[0];
      });
      return past365Days.reverse().map(dateString => {
        const count = activityMap[dateString] || 0;
        if (count === 0) return 'bg-[#F3F4F6]';
        if (count < 2) return 'bg-green-200';
        if (count < 4) return 'bg-green-400';
        if (count < 6) return 'bg-green-600';
        return 'bg-green-800';
      });
    };

    return (
      <div className="px-8 py-12 max-w-5xl mx-auto w-full">
        <section className="mb-16">
           <h2 className="text-3xl font-extrabold text-[#111827] mb-2">Good Morning, {user?.name?.split(' ')[0] || 'Student'}</h2>
           <p className="text-lg text-[#6B7280] mb-8">Here is your daily briefing.</p>
           <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">Continue Learning</h3>
                    <p className="text-2xl font-bold text-[#111827] line-clamp-1" title={lastWatched?.videoTitle || ""}>{lastWatched ? lastWatched.videoTitle : "Start Learning"}</p>
                    <p className="text-[#6B7280] font-medium mt-1 line-clamp-1">{lastWatched ? lastWatched.courseName : ""}</p>
                 </div>
                 <div className="w-16 h-16 rounded-full border-4 border-[#10B981] flex items-center justify-center">
                    <span className="font-bold text-[#10B981]"><FiPlayCircle size={24} /></span>
                 </div>
              </div>
              <button onClick={() => { 
                  if(lastWatched?.courseId) { 
                    if (lastWatched.recordingUrl) {
                      localStorage.setItem('pendingRecording', JSON.stringify({ url: lastWatched.recordingUrl, title: lastWatched.videoTitle }));
                    }
                    setActiveCourseId(lastWatched.courseId); 
                    setActiveTab('course-viewer'); 
                  } else if (activeCourseId) { 
                    setActiveTab('course-viewer'); 
                  } 
                }} className="bg-[#111827] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#374151] transition-colors shadow-md">
                Resume Learning <FiArrowRight />
              </button>
           </div>
        </section>
        
        {/* RECENT ACTIVITY WIDGETS */}
        <section className="mb-16">
           <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Recent Activity</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activityFeed.events.length > 0 ? (
                 activityFeed.events.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#111827] transition-colors cursor-pointer">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                         event.type === 'Assignment' ? 'bg-[#EFF6FF] text-[#3B82F6]' : 
                         event.type === 'Quiz' ? 'bg-[#FEF2F2] text-[#EF4444]' : 
                         event.type === 'System' ? 'bg-[#F0FDF4] text-[#10B981]' : 
                         'bg-[#F3F4F6] text-[#4B5563]'
                       }`}>
                         {event.type === 'Assignment' ? <FiCheckSquare size={20} /> :
                          event.type === 'Quiz' ? <FiAward size={20} /> :
                          event.type === 'System' ? <FiVideo size={20} /> :
                          <FiFileText size={20} />}
                       </div>
                       <h4 className="font-bold text-[#111827]">{event.title}</h4>
                       <p className="text-sm text-[#6B7280] mt-1">{event.message}</p>
                    </div>
                 ))
              ) : (
                 <p className="text-sm text-[#6B7280] col-span-3 text-center py-8 bg-white border border-[#E5E7EB] rounded-xl">No recent activity yet.</p>
              )}
           </div>
        </section>
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Your Strengths</h3>
              <div className="space-y-3">
                 {(digitalTwin.strengths || []).length > 0 ? digitalTwin.strengths.map((str, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                      <FiCheckCircle className="text-[#10B981]" />
                      <span className="font-medium text-[#374151]">{str}</span>
                   </div>
                 )) : (
                   <p className="text-sm text-[#6B7280]">Keep learning to discover your strengths!</p>
                 )}
              </div>
           </div>
           <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Focus Areas</h3>
              <div className="space-y-3">
                 {(digitalTwin.weakAreas || []).length > 0 ? digitalTwin.weakAreas.map((weak, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                      <span className="font-medium text-[#991B1B]">{weak}</span>
                   </div>
                 )) : (
                   <p className="text-sm text-[#6B7280]">No current focus areas required.</p>
                 )}
              </div>
           </div>
        </section>
        <section>
           <h3 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Learning Consistency</h3>
           <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 overflow-x-auto shadow-sm">
              <div className="flex flex-col gap-1 w-max">
                 {Array.from({length: 7}).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                      {generateHeatmap().slice(rowIndex * 52, (rowIndex + 1) * 52).map((color, i) => <div key={i} className={`w-3 h-3 rounded-sm ${color}`}></div>)}
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    );
  };

  const WorkspaceLearning = () => {
    const [lastWatched, setLastWatched] = useState(null);
    useEffect(() => {
      if (user?._id) {
        const stored = localStorage.getItem(`lastWatched_${user._id}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.courseName === "My Course" && courses) {
              const found = courses.find(c => String(c._id) === String(parsed.courseId));
              if (found) parsed.courseName = found.name;
            }
            setLastWatched(parsed);
          } catch (e) {}
        }
      }
    }, [user?._id, activeTab]);

    return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] font-sans">
      <div className="px-8 py-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-20 flex justify-between items-center shadow-sm shrink-0">
         <div>
           <h1 className="text-2xl font-black text-[#111827] tracking-tight">My Learning</h1>
           <p className="text-[#6B7280] text-sm mt-1">Select a course to continue your journey.</p>
         </div>
         <div className="hidden md:flex gap-6 items-center">
            <div className="text-right">
               <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Enrolled</p>
               <p className="text-lg font-black text-[#111827]">{courses?.length || 0}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] w-full mx-auto">
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between shadow-sm">
           <div>
              <h3 className="text-[#6B7280] text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><FiClock /> Resume Session</h3>
              <h2 className="text-[#111827] text-3xl font-black mb-2">{lastWatched ? lastWatched.courseName : (currentCourse ? currentCourse.name : "Start your learning journey")}</h2>
              <p className="text-[#6B7280] truncate max-w-lg">{lastWatched ? lastWatched.videoTitle : (currentCourse?.courseData?.[0]?.title || "")}</p>
           </div>
           <button onClick={() => { 
                if(lastWatched?.courseId) { 
                  if (lastWatched.recordingUrl) {
                    localStorage.setItem('pendingRecording', JSON.stringify({ url: lastWatched.recordingUrl, title: lastWatched.videoTitle }));
                  }
                  setActiveCourseId(lastWatched.courseId); 
                  setActiveTab('course-viewer'); 
                } else if (currentCourse) { 
                  setActiveCourseId(currentCourse._id); 
                  setActiveTab('course-viewer'); 
                } 
             }} className="mt-6 md:mt-0 bg-[#111827] text-white px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3 hover:bg-[#374151] hover:scale-105 transition-all shadow-md">
             <FiPlayCircle size={24} /> Continue Watching
           </button>
        </div>

        <section>
          <h2 className="text-sm font-bold text-[#4B5563] uppercase tracking-widest mb-6">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses && courses.length > 0 ? courses.map((course, idx) => (
               <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#D1D5DB] transition-all group flex flex-col" onClick={() => { setActiveCourseId(course._id); setActiveTab('course-viewer'); }}>
                  <div className={`h-48 relative flex items-center justify-center overflow-hidden bg-[#F3F4F6] border-b border-[#E5E7EB]`}>
                     {course.thumbnail?.url ? <img src={course.thumbnail.url} alt={course.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <FiBook className="text-[#9CA3AF] text-4xl" />}
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#111827] opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-xl">
                          <FiPlayCircle size={32} />
                        </div>
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] text-lg leading-snug line-clamp-2">{course.name}</h3>
                      <p className="text-sm font-medium text-[#6B7280] mt-2 capitalize">{course.level || "Beginner"} Level</p>
                    </div>
                  </div>
               </div>
            )) : (
               <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white border border-[#E5E7EB] rounded-2xl border-dashed">
                  <FiBook className="text-[#9CA3AF] text-4xl mb-4" />
                  <p className="text-lg font-bold text-[#111827]">No active courses</p>
                  <p className="text-sm text-[#6B7280]">Start exploring to see them here.</p>
               </div>
            )}
          </div>
        </section>
      </div>
    </div>
    );
  };

  const WorkspaceAssignments = () => {
    const { data: tasksData, isLoading: isLoadingTasks } = useGetCourseAssignmentTasksQuery(activeCourseId, { skip: !activeCourseId });
    const assignmentTasks = tasksData?.tasks || [];
    
    const { data: submissionsData, isLoading: isLoadingSubmissions, refetch } = useGetStudentAssignmentsQuery(activeCourseId, { skip: !activeCourseId });
    const submissions = submissionsData?.assignments || [];

    const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();
    const [selectedTask, setSelectedTask] = useState(null);
    const [file, setFile] = useState("");

    if (!activeCourseId) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#F8FAFC]">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-4 border border-[#E5E7EB]"><FiBriefcase size={24} /></div>
           <h2 className="text-xl font-bold text-[#111827] mb-2">Assignments</h2>
           <p className="text-[#6B7280] text-sm">Select a course from 'My Learning' to view your assignments.</p>
         </div>
       );
    }

    const submittedTitles = submissions.map(sub => sub.assignmentTitle);
    const pendingTasks = assignmentTasks.filter(task => !submittedTitles.includes(task.title));

    const handleFileChange = (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => { if (reader.readyState === 2) setFile(reader.result); };
        reader.readAsDataURL(selectedFile);
      }
    };

    const handleSubmit = async () => {
      if (!selectedTask || !file) return toast.error("Please attach a file");
      try {
        await submitAssignment({ courseId: activeCourseId, assignmentTitle: selectedTask.title, submittedFile: file }).unwrap();
        toast.success("Assignment submitted for review!");
        setSelectedTask(null);
        setFile("");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to submit assignment");
      }
    };

    return (
      <div className="flex flex-col h-full w-full bg-[#F8FAFC]">
        <div className="px-8 py-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-10 shrink-0">
           <h1 className="text-2xl font-bold text-[#111827]">Assignments</h1>
           <p className="text-[#6B7280] text-sm mt-1">{globalCourseName} • Evaluated by {globalInstructorName}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-10">
           {/* Pending Assignments */}
           <section>
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">To Do <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span></h2>
              {isLoadingTasks ? (
                 <p className="text-sm text-[#6B7280]">Loading...</p>
              ) : pendingTasks.length > 0 ? (
                 <div className="grid gap-4">
                    {pendingTasks.map((task, i) => (
                      <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                         <div>
                            <h3 className="font-bold text-[#111827] text-base">{task.title}</h3>
                            <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{task.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-orange-600">
                               <FiClock /> Due: {formatDateSafe(task.dueDate)}
                            </div>
                         </div>
                         <button onClick={() => { setSelectedTask(task); setFile(""); }} className="bg-[#111827] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#374151] transition-colors shrink-0 ml-4">
                            Submit Work
                         </button>
                      </div>
                    ))}
                 </div>
              ) : (
                 <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                    <FiCheckCircle size={24} className="mx-auto text-emerald-500 mb-3" />
                    <p className="font-bold text-[#111827]">All Caught Up!</p>
                    <p className="text-sm text-[#6B7280]">You have no pending assignments.</p>
                 </div>
              )}
           </section>

           {/* Past Submissions */}
           <section>
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">Past Submissions <span className="bg-[#F1F5F9] text-[#475569] text-xs px-2 py-0.5 rounded-full">{submissions.length}</span></h2>
              {isLoadingSubmissions ? (
                 <p className="text-sm text-[#6B7280]">Loading...</p>
              ) : submissions.length > 0 ? (
                 <div className="grid gap-4">
                    {submissions.map((sub, i) => (
                      <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center justify-between">
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="font-bold text-[#111827] text-base">{sub.assignmentTitle}</h3>
                               <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                 sub.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                 sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                 'bg-red-50 text-red-600 border-red-200'
                               }`}>{sub.status}</span>
                            </div>
                            {sub.status !== 'pending' && (
                               <div className="mt-3">
                                  <p className="text-sm font-bold text-[#111827]">Score: {sub.marks}/100</p>
                                  {sub.feedback && <p className="text-sm text-[#6B7280] mt-1 bg-[#F8FAFC] p-2 rounded-lg border border-[#E5E7EB]">"{sub.feedback}"</p>}
                               </div>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              ) : (
                 <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#6B7280]">
                    <p className="text-sm">No submissions yet.</p>
                 </div>
              )}
           </section>
        </div>

        {selectedTask && (
          <div className="fixed inset-0 bg-[#111827]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-lg font-bold text-[#111827]">Submit Assignment</h2>
                   <button onClick={() => setSelectedTask(null)} className="text-[#9CA3AF] hover:text-[#111827]"><FiMoreHorizontal className="rotate-90" /></button>
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{selectedTask.title}</h3>
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E5E7EB] mb-6 text-sm text-[#4B5563]">
                   {selectedTask.description}
                </div>
                <div className="mb-6">
                   <div className="relative border-2 border-dashed border-[#E5E7EB] rounded-2xl hover:border-[#111827] bg-[#F8FAFC] transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer group">
                      <input type="file" accept=".pdf,.doc,.docx,.zip,.rar" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#111827] group-hover:scale-110 transition-all mb-3"><FiUpload size={20} /></div>
                      <p className="text-sm font-bold text-[#111827] mb-1">{file ? file.name : "Click to upload or drag and drop"}</p>
                      <p className="text-xs text-[#6B7280]">PDF, DOCX, ZIP up to 50MB</p>
                   </div>
                </div>
                <button onClick={handleSubmit} disabled={isSubmitting || !file} className={`w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 ${file ? 'bg-[#111827] text-white hover:bg-[#374151] shadow-md hover:shadow-lg' : 'bg-[#F1F5F9] text-[#9CA3AF] cursor-not-allowed'} transition-all`}>
                  <FiSend /> {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const WorkspaceResources = () => {
    const { data, isLoading } = useGetStudentMeetingsQuery(activeCourseId, { skip: !activeCourseId });
    const meetings = data?.meetings || [];
    const [activeRecording, setActiveRecording] = useState(null);
    
    // Filter completed meetings that have either a recording or materials
    const completedMeetings = meetings.filter(m => 
      (m.status === 'completed' || new Date(m.date) < new Date()) && 
      (m.recordingUrl || (m.materials && m.materials.length > 0))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const formatEmbedUrl = (url) => {
      if (!url) return '';
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return url;
    };

    const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

    if (!activeCourseId) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#F8FAFC]">
           <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-6 border border-[#E5E7EB]"><FiPaperclip size={40} /></div>
           <h2 className="text-3xl font-black text-[#111827] mb-3">Resources & Recordings</h2>
           <p className="text-[#6B7280] max-w-sm">Select a course from 'My Learning' to access materials.</p>
         </div>
       );
    }

    return (
      <div className="flex flex-col h-full w-full bg-[#F8FAFC] font-sans">
        <div className="px-8 py-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-20 flex justify-between items-center shadow-sm shrink-0">
           <div>
             <h1 className="text-2xl font-black text-[#111827] tracking-tight">Session Resources</h1>
             <p className="text-[#6B7280] text-sm mt-1">{globalCourseName} • Materials provided by {globalInstructorName}</p>
           </div>
           <div className="hidden md:flex gap-6 items-center">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Sessions</p>
                 <p className="text-lg font-black text-[#111827]">{completedMeetings.length}</p>
              </div>
           </div>
        </div>

        {/* Inline Video Player — appears when a recording is selected */}
        {activeRecording && (
          <div className="bg-black w-full shrink-0 relative">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex items-center justify-between px-6 py-3 bg-[#111827]">
                <p className="text-white font-bold text-sm truncate">{activeRecording.title}</p>
                <button onClick={() => setActiveRecording(null)} className="text-[#9CA3AF] hover:text-white text-xs font-bold px-3 py-1 rounded border border-[#374151] hover:border-white transition-colors">✕ Close Player</button>
              </div>
              {isYouTube(activeRecording.url) ? (
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    key={activeRecording.url}
                    src={formatEmbedUrl(activeRecording.url)}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeRecording.title}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-[#1F2937]">
                  <FiExternalLink size={40} className="text-[#6B7280] mb-4" />
                  <p className="text-white font-bold mb-2">{activeRecording.title}</p>
                  <p className="text-[#9CA3AF] text-sm mb-6">This recording cannot be embedded. Click below to open.</p>
                  <a href={activeRecording.url} target="_blank" rel="noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2">
                    <FiExternalLink /> Open Recording
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] w-full mx-auto">
          {isLoading ? (
             <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse"></div>)}
             </div>
          ) : completedMeetings.length > 0 ? (
            <div className="space-y-8">
              {completedMeetings.map((meeting, idx) => (
                <div key={idx} className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${activeRecording?.meetingId === meeting._id ? 'border-purple-400' : 'border-[#E5E7EB]'}`}>
                   <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-8 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <FiVideo className="text-[#6B7280]" />
                         <h3 className="font-black text-[#111827] tracking-tight">{meeting.topic || "Live Session"}</h3>
                      </div>
                      <span className="text-xs font-bold text-[#6B7280] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full">{formatDateSafe(meeting.date)}</span>
                   </div>
                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meeting.recordingUrl && (
                        <button
                          onClick={() => {
                            localStorage.setItem('pendingRecording', JSON.stringify({ url: meeting.recordingUrl, title: `Recording: ${meeting.topic || 'Live Session'}` }));
                            setActiveCourseId(activeCourseId);
                            setActiveTab('course-viewer');
                          }}
                          className="text-left w-full flex items-start gap-4 p-5 rounded-xl border bg-[#F8FAFC] border-[#E5E7EB] hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm transition-all group"
                        >
                           <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white">
                             <FiPlayCircle size={20} />
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-bold text-[#111827] mb-1.5 truncate">Session Recording</h4>
                              <p className="text-xs font-semibold text-purple-600 truncate bg-purple-50 px-2 py-1 rounded inline-block border border-purple-100 max-w-full">
                                ▶ Play in My Learning
                              </p>
                           </div>
                        </button>
                      )}
                      {meeting.materials && meeting.materials.map((doc, i) => (
                        <a key={i} href={doc.url || "#"} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl hover:border-[#111827] hover:bg-white hover:shadow-sm transition-all group">
                           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                             <FiDownload size={20} />
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-bold text-[#111827] mb-1.5 truncate" title={doc.name || "Document"}>{doc.name || "Document"}</h4>
                              <p className="text-xs font-semibold text-[#6B7280] truncate bg-white px-2 py-1 rounded inline-block border border-[#E5E7EB] max-w-full">Download File</p>
                           </div>
                        </a>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[#E5E7EB] rounded-3xl bg-white">
                <FiPaperclip size={32} className="text-[#9CA3AF] mb-4" />
                <p className="text-lg font-bold text-[#111827]">No resources found</p>
                <p className="text-sm text-[#6B7280]">Recordings and materials will appear here after live sessions.</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  const WorkspaceLiveMeetings = () => {
  const { data, isLoading } = useGetStudentMeetingsQuery(activeCourseId, { skip: !activeCourseId });
  const [markAttendance] = useMarkAttendanceMutation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const meetings = data?.meetings || [];
  const sortedMeetings = [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date));
  const now = new Date();

  const upcomingMeetings = sortedMeetings.filter(
    m => m.status !== "completed" && new Date(m.endDate || m.date) > now
  );
  const completedMeetings = sortedMeetings.filter(
    m => m.status === "completed" || new Date(m.endDate || m.date) <= now
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const nextMeeting = upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;

  if (!activeCourseId) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-6">
            <FiVideo size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Live Learning Hub</h2>
          <p className="text-slate-600">Select a course from 'My Learning' to view and join your scheduled live sessions.</p>
        </div>
      </div>
    );
  }

  const handleJoin = async (meeting) => {
    try {
      await markAttendance({ meetingId: meeting._id, courseId: activeCourseId }).unwrap();
    } catch (e) {}
    window.open(meeting.zoomLink, "_blank");
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateString));
  };

  const isLive = nextMeeting && new Date(nextMeeting.date) <= now;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Learning Hub</h1>
              <p className="text-slate-600">{globalCourseName} • Hosted by {globalInstructorName}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Today</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                }).format(now)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-slate-200 rounded-xl"></div>
              <div className="h-32 bg-slate-200 rounded-xl"></div>
              <div className="h-32 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Next Meeting Hero */}
            {nextMeeting && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      {isLive && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                          LIVE NOW
                        </div>
                      )}
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {isLive ? 'In Progress' : 'Up Next'}
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{nextMeeting.title || nextMeeting.topic}</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {nextMeeting.description || 'Join this scheduled live session to interact with your mentor and learn together.'}
                    </p>
                    <div className="flex items-center gap-3 text-slate-700 mb-8">
                      <FiCalendar size={18} className="text-slate-400" />
                      <span className="font-medium">{formatDate(nextMeeting.date)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoin(nextMeeting)}
                    className="flex-shrink-0 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap h-fit"
                  >
                    <FiPlayCircle size={20} />
                    Join Meeting
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Sessions</p>
                    <p className="text-3xl font-bold text-slate-900">{meetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiVideo className="text-blue-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-600">Assigned to you</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Upcoming</p>
                    <p className="text-3xl font-bold text-slate-900">{upcomingMeetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FiAlertCircle className="text-amber-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {upcomingMeetings.length > 0
                    ? `Next: ${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
                        new Date(upcomingMeetings[0].date)
                      )}`
                    : 'None scheduled'}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Completed</p>
                    <p className="text-3xl font-bold text-slate-900">{completedMeetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiCheckCircle className="text-emerald-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-600">Great progress!</p>
              </div>
            </div>

            {/* Meetings List */}
            <div>
              {/* Tabs */}
              <div className="flex gap-8 border-b border-slate-200 mb-8">
                {['upcoming', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 -mb-[2px] ${
                      activeTab === tab
                        ? 'text-slate-900 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    {tab === 'upcoming' ? 'Upcoming Schedule' : 'Meeting History'}
                    <span className="ml-2 px-2 py-1 text-xs font-bold bg-slate-100 rounded">
                      {tab === 'upcoming' ? upcomingMeetings.length : completedMeetings.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Empty States */}
              {activeTab === 'upcoming' && upcomingMeetings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FiCalendar size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Upcoming Meetings</h3>
                  <p className="text-slate-600 max-w-sm">Your mentor hasn't scheduled any new sessions yet. Check back later!</p>
                </div>
              )}

              {activeTab === 'completed' && completedMeetings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
                  <p className="text-slate-600 max-w-sm">You haven't attended any completed meetings yet.</p>
                </div>
              )}

              {/* Meetings Grid */}
              <div className="space-y-4">
                {(activeTab === 'upcoming' ? upcomingMeetings : completedMeetings).map(meeting => {
                  const isEnded = activeTab === 'completed';
                  const meetingDate = new Date(meeting.date);
                  const isToday = meetingDate.toDateString() === now.toDateString();

                  return (
                    <div
                      key={meeting._id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Left Section - Meeting Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isEnded ? 'bg-slate-100' : 'bg-blue-100'
                              }`}
                            >
                              <FiVideo className={isEnded ? 'text-slate-400' : 'text-blue-600'} size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                {isEnded ? 'Completed' : isToday ? 'Today' : 'Scheduled'}
                              </p>
                              <p className="text-sm font-bold text-slate-900">{formatDate(meeting.date)}</p>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{meeting.title || meeting.topic}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {meeting.description || 'Live session'}
                          </p>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex-shrink-0 flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                          {!isEnded && (
                            <>
                              <div className="hidden sm:block text-right">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                  UPCOMING
                                </span>
                              </div>
                              <button
                                onClick={() => handleJoin(meeting)}
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                              >
                                <FiPlayCircle size={16} />
                                Join
                              </button>
                            </>
                          )}
                          {isEnded && (
                            <>
                              <div className="hidden sm:block text-right">
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                                  ENDED
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {meeting.recordingUrl && (
                                  <a
                                    href={meeting.recordingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                                  >
                                    <FiPlayCircle size={16} />
                                    Recording
                                  </a>
                                )}
                                {!meeting.recordingUrl && (
                                  <button
                                    disabled
                                    className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-bold rounded-lg cursor-not-allowed"
                                  >
                                    No Recording
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Materials Section */}
                      {isEnded && meeting.materials && meeting.materials.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Resources</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {meeting.materials.map((mat, i) => (
                              <a
                                key={i}
                                href={mat.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <FiPaperclip size={16} className="text-slate-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-700 flex-1 truncate">
                                  {mat.name || 'Resource'}
                                </span>
                                <FiDownload size={16} className="text-slate-400 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkspaceAskDoubt = () => {
  const { data: doubtsData, isLoading, refetch } = useGetStudentDoubtsQuery(activeCourseId, { skip: !activeCourseId });
  const { data: courseDetails } = useGetCourseDetailsQuery(activeCourseId, { skip: !activeCourseId });
  const instructorName = courseDetails?.course?.author || courseDetails?.course?.instructorName || "Instructor";
  const doubts = doubtsData?.doubts || [];

  const [activeDoubt, setActiveDoubt] = useState(null);
  const [newDoubtTitle, setNewDoubtTitle] = useState("");
  const [newDoubtDesc, setNewDoubtDesc] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const [createDoubt, { isLoading: isCreating }] = useCreateDoubtMutation();
  const [replyDoubt, { isLoading: isReplying }] = useStudentReplyDoubtMutation();

  const handleCreate = async () => {
    if (!newDoubtTitle || !newDoubtDesc) return toast.error("Please fill in all fields");
    try {
      await createDoubt({ courseId: activeCourseId, title: newDoubtTitle, description: newDoubtDesc }).unwrap();
      toast.success("Discussion started!");
      setNewDoubtTitle("");
      setNewDoubtDesc("");
      setIsCreatingNew(false);
      refetch();
    } catch (error) { toast.error("Failed to submit doubt"); }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      await replyDoubt({ doubtId: activeDoubt._id, message: replyMessage }).unwrap();
      setReplyMessage("");
      const updated = await refetch().unwrap();
      const refreshedDoubt = updated.doubts.find(d => d._id === activeDoubt._id);
      if (refreshedDoubt) setActiveDoubt(refreshedDoubt);
    } catch (error) { toast.error("Failed to send reply"); }
  };

  return (
    <div className="flex h-full w-full bg-white font-sans overflow-hidden">
      {/* Left Sidebar - Doubt List */}
      <div className="w-96 border-r border-slate-100 bg-white flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900">Discussions</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{doubts.length} Active Threads</p>
          </div>
          <button onClick={() => { setIsCreatingNew(true); setActiveDoubt(null); }} className="w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-600/20">
            <FiPlus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400 text-sm">Loading...</div>
          ) : doubts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {doubts.map(d => (
                <button
                  key={d._id}
                  onClick={() => { setActiveDoubt(d); setIsCreatingNew(false); }}
                  className={`w-full text-left p-6 transition-all hover:bg-slate-50 ${activeDoubt?._id === d._id ? 'bg-slate-50 border-r-4 border-r-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${d.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{d.status}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{formatDateSafe(d.createdAt)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{d.title}</h4>
                  <p className="text-xs text-slate-500">{d.replies?.length || 0} replies</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <FiMessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">No discussions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {isCreatingNew ? (
          <div className="flex-1 flex flex-col bg-white h-full">
            <div className="px-8 md:px-12 py-8 border-b border-[#E5E7EB] bg-gradient-to-r from-blue-50/50 to-white sticky top-0 z-10 shrink-0">
              <div className="flex items-start sm:items-center gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <FiMessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Ask a Question</h2>
                  <p className="text-sm text-slate-500 mt-1">Get help from mentors and fellow students.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6">
              <div className="max-w-4xl space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Question Title</label>
                  <input 
                    type="text" 
                    value={newDoubtTitle} 
                    onChange={e => setNewDoubtTitle(e.target.value)} 
                    placeholder="e.g. How does the ERC20 transfer function work?" 
                    className="w-full !px-4 !py-3 bg-white !rounded-xl !border !border-slate-200 !shadow-none !outline-none !m-0 !text-slate-900 text-sm font-medium focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500 focus:!shadow-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
                  <textarea 
                    value={newDoubtDesc} 
                    onChange={e => setNewDoubtDesc(e.target.value)} 
                    placeholder="Include code snippets, error messages, or exactly what you are stuck on..." 
                    className="w-full !px-4 !py-3 bg-white !rounded-xl !border !border-slate-200 !shadow-none !outline-none !m-0 !text-slate-900 text-sm min-h-[300px] resize-none focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500 focus:!shadow-none transition-all" 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E5E7EB] bg-white flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setIsCreatingNew(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={isCreating} className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50 flex items-center gap-2">
                {isCreating ? 'Submitting...' : <><FiSend size={16} /> Post</>}
              </button>
            </div>
          </div>
        ) : activeDoubt ? (
          <div className="flex flex-col h-full bg-white">
            <div className="px-8 py-6 border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#111827] mb-2 leading-tight">{activeDoubt.title}</h2>
              <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280]">
                 <div className="flex items-center gap-2"><div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-700">S</div> Student</div>
                 <span>{formatDateSafe(activeDoubt.createdAt)}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">S</div>
                <div className="flex-1 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{activeDoubt.description}</p>
                </div>
              </div>

              {activeDoubt.replies?.map((r, i) => (
                <div key={i} className={`flex gap-4 ${r.sender === 'student' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${r.sender === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-[#111827] text-white'}`}>
                    {r.sender === 'student' ? 'S' : instructorName.charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex-1 rounded-xl p-5 ${r.sender === 'student' ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-[#E5E7EB] shadow-sm'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${r.sender === 'student' ? 'flex-row-reverse' : ''}`}>
                       <span className="text-xs font-bold text-[#111827]">{r.sender === 'student' ? 'You' : instructorName}</span>
                       <span className="text-[10px] text-[#9CA3AF] font-semibold">{formatTimeSafe(r.timestamp)}</span>
                    </div>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${r.sender === 'student' ? 'text-blue-900 text-right' : 'text-[#374151]'}`}>{r.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-[#E5E7EB]">
                <div className="flex gap-3 bg-white border border-[#E5E7EB] rounded-2xl p-2 pl-5 shadow-sm focus-within:border-[#111827] focus-within:ring-4 focus-within:ring-[#111827]/5 transition-all">
                  <input type="text" value={replyMessage} onChange={e => setReplyMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleReply()} placeholder="Type a reply..." className="flex-1 !bg-transparent !border-none !shadow-none !outline-none !p-0 !m-0 !text-[#111827] placeholder-[#9CA3AF] focus:!shadow-none focus:!ring-0 text-sm font-medium" />
                  <button onClick={handleReply} disabled={isReplying || !replyMessage.trim()} className="px-6 py-3 bg-[#111827] text-white font-bold rounded-xl hover:bg-[#374151] transition-all disabled:opacity-50 text-sm flex items-center gap-2 shadow-sm">
                    {isReplying ? '...' : <><FiSend size={16} /> Reply</>}
                  </button>
                </div>
              </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FiMessageSquare size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-semibold">Select a discussion to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

  const WorkspaceQuiz = () => {
    const { data: contentData } = useGetCourseContentQuery(activeCourseId, { skip: !activeCourseId });
    const sections = React.useMemo(() => {
      const s = new Set();
      if (contentData?.content) contentData.content.forEach(l => s.add(l.videoSection));
      return Array.from(s);
    }, [contentData]);

    const [selectedSection, setSelectedSection] = useState("");
    const { data: quizData, isLoading } = useGetQuizForSectionQuery(
      { courseId: activeCourseId, sectionName: selectedSection },
      { skip: !selectedSection }
    );
    const quiz = quizData?.quiz;
    
    const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    if (!activeCourseId) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center px-6">
           <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#9CA3AF] mb-6"><FiCheckCircle size={32} /></div>
           <h2 className="text-2xl font-bold text-[#111827] mb-2">Quizzes</h2>
           <p className="text-[#6B7280]">Please select a course from 'My Learning' first.</p>
         </div>
       );
    }

    const handleSubmit = async () => {
      if (!quiz) return;
      const ansArray = quiz.questions.map((_, i) => answers[i] ?? -1);
      try {
        const res = await submitQuiz({ quizId: quiz._id, answers: ansArray }).unwrap();
        setResult(res);
      } catch (err) { toast.error("Failed to submit quiz"); }
    };

    return (
      <div className="flex flex-col h-full px-8 py-12 w-full relative">
        <h1 className="text-3xl font-extrabold text-[#111827] mb-10 flex-shrink-0">Knowledge Check</h1>
        
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
           {!selectedSection ? (
             <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#EFF6FF] text-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-6"><FiCheckCircle size={32} /></div>
                <h3 className="text-xl font-bold text-[#111827] mb-4">Select a Module</h3>
                <p className="text-[#6B7280] mb-8">Choose a module to test your knowledge.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                   {sections.map(sec => (
                     <button key={sec} onClick={() => { setSelectedSection(sec); setResult(null); setAnswers({}); }} className="p-4 border border-[#E5E7EB] rounded-xl hover:border-[#111827] font-bold text-[#374151] hover:text-[#111827] transition-colors shadow-sm">{sec}</button>
                   ))}
                </div>
             </div>
           ) : isLoading ? (
             <p className="text-center text-[#6B7280]">Loading quiz...</p>
           ) : !quiz ? (
             <div className="text-center bg-white border border-[#E5E7EB] rounded-2xl p-12">
                <p className="text-[#6B7280] mb-6">No quiz available for {selectedSection}.</p>
                <button onClick={() => setSelectedSection("")} className="text-[#3B82F6] font-bold">← Back to Modules</button>
             </div>
           ) : result ? (
             <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center shadow-sm">
                <div className="w-24 h-24 bg-[#F0FDF4] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6"><FiAward size={48} /></div>
                <h2 className="text-3xl font-black text-[#111827] mb-2">Quiz Completed!</h2>
                <p className="text-xl font-bold text-[#374151] mb-8">You scored: <span className="text-[#10B981]">{result.score}</span> / {quiz.questions.length}</p>
                <button onClick={() => { setSelectedSection(""); setResult(null); setAnswers({}); }} className="bg-[#111827] text-white px-8 py-3 rounded-xl font-bold">Take Another Quiz</button>
             </div>
           ) : (
             <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-[#F3F4F6] pb-6">
                   <h2 className="text-xl font-bold text-[#111827]">{quiz.title}</h2>
                   <button onClick={() => setSelectedSection("")} className="text-sm font-bold text-[#9CA3AF] hover:text-[#111827]">Cancel</button>
                </div>
                <div className="space-y-10 overflow-y-auto max-h-[50vh] pr-4">
                   {quiz.questions.map((q, qIndex) => (
                     <div key={qIndex}>
                        <h4 className="font-bold text-[#111827] mb-4 flex gap-2"><span className="text-[#9CA3AF]">{qIndex + 1}.</span> {q.question}</h4>
                        <div className="space-y-3 pl-6">
                          {q.options.map((opt, oIndex) => (
                            <label key={oIndex} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${answers[qIndex] === oIndex ? 'border-[#111827] bg-[#F9FAFB] shadow-inner' : 'border-[#E5E7EB] hover:border-[#9CA3AF]'}`}>
                               <input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === oIndex} onChange={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))} className="w-4 h-4 text-[#111827] focus:ring-[#111827]" />
                               <span className="text-sm font-medium text-[#374151]">{opt}</span>
                            </label>
                          ))}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                   <button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length < quiz.questions.length} className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${Object.keys(answers).length === quiz.questions.length ? 'bg-[#111827] text-white hover:bg-[#374151]' : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'}`}>
                     {isSubmitting ? 'Grading...' : 'Submit Answers'}
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  const WorkspaceMentor = () => (
    <div className="flex h-full w-full">
       <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center bg-white shadow-sm">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100" className="w-12 h-12 rounded-full object-cover" alt="Mentor" />
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full"></div>
                </div>
                <div><h2 className="text-lg font-bold text-[#111827]">Rajesh Kumar</h2><p className="text-xs text-[#6B7280]">Blockchain Expert • Online</p></div>
             </div>
             <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-[#F3F4F6] text-[#374151] px-4 py-2 rounded-lg font-bold text-sm"><FiCalendar /> Schedule</button>
                <button className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2 rounded-lg font-bold text-sm"><FiVideo /> Call</button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] space-y-6">
             <div className="flex justify-center"><span className="bg-[#E5E7EB] text-[#4B5563] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</span></div>
             <div className="flex items-end gap-3 max-w-2xl">
                <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100" className="w-8 h-8 rounded-full" alt="Mentor" />
                <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl rounded-bl-none shadow-sm text-sm text-[#374151]">Hi Shyam! I reviewed your ERC20 assignment. Great work.<span className="block mt-2 text-[10px] text-[#9CA3AF] text-right">10:42 AM</span></div>
             </div>
             <div className="flex items-end gap-3 max-w-2xl ml-auto justify-end">
                <div className="bg-[#111827] text-white p-4 rounded-2xl rounded-br-none shadow-sm text-sm">Thanks Rajesh! I wanted to add custom fee logic.<span className="block mt-2 text-[10px] text-gray-400 text-right">10:45 AM</span></div>
             </div>
          </div>
          <div className="p-4 bg-white border-t border-[#E5E7EB]">
             <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-2xl p-2 pl-3 shadow-sm focus-within:border-[#111827] focus-within:ring-4 focus-within:ring-[#111827]/5 transition-all">
                <button className="p-2.5 text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-xl transition-colors"><FiPaperclip size={20} /></button>
                <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium text-[#111827] placeholder-[#9CA3AF]" />
                <button className="bg-[#111827] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#374151] transition-all shadow-sm"><FiSend size={16} /> Send</button>
             </div>
          </div>
       </div>
    </div>
  );

  const WorkspacePlacement = () => (
    <div className="max-w-4xl mx-auto w-full px-8 py-12">
      <div className="mb-12"><h1 className="text-3xl font-extrabold text-[#111827] mb-2">Placement Tracker</h1></div>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 lg:p-12 shadow-sm relative">
        <div className="absolute left-[59px] top-[72px] bottom-[72px] w-0.5 bg-[#E5E7EB]"></div>
        <div className="space-y-12">
          {['Course Learning', 'Capstone Project', 'Resume Review', 'Mock Interview', 'Placed'].map((title, idx) => {
            const status = idx < 2 ? 'completed' : idx === 2 ? 'active' : 'upcoming';
            return (
              <div key={idx} className="relative flex gap-8 items-start group">
                 <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 ${status === 'completed' ? 'bg-[#10B981] border-white text-white shadow-[0_0_0_2px_#10B981]' : status === 'active' ? 'bg-white border-[#3B82F6] text-[#3B82F6]' : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'}`}>
                   {status === 'completed' ? <FiCheckCircle size={24} /> : status === 'active' ? <div className="w-4 h-4 bg-[#3B82F6] rounded-full animate-pulse"></div> : <FiCircle size={24} />}
                 </div>
                 <div className={`flex-1 pt-3 pb-6 border-b border-[#F3F4F6] ${status === 'upcoming' ? 'opacity-50' : ''}`}>
                    <h3 className={`text-xl font-bold ${status === 'active' ? 'text-[#3B82F6]' : 'text-[#111827]'}`}>{title}</h3>
                    {status === 'active' && <button className="mt-4 bg-[#3B82F6] text-white px-5 py-2 rounded-lg font-bold text-sm">Schedule</button>}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const WorkspaceAttendance = () => {
    const { data, isLoading } = useGetStudentMeetingsQuery(activeCourseId, { skip: !activeCourseId });
    const meetings = data?.meetings || [];
    const attendancePercentage = data?.attendancePercentage || 0;

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    if (!activeCourseId) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="w-20 h-20 bg-[#F3F4F6] rounded-[16px] flex items-center justify-center text-[#9CA3AF] mb-6">
            <FiCalendar size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Attendance Records</h2>
          <p className="text-[#6B7280]">Please select a course from 'My Learning' first.</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    let pastMeetings = meetings.filter(m => new Date(m.date) < new Date());
    
    // Sort new class top, older bottom (descending by date)
    pastMeetings.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (fromDate) {
      pastMeetings = pastMeetings.filter(m => new Date(m.date) >= new Date(fromDate));
    }
    if (toDate) {
      const toD = new Date(toDate);
      toD.setHours(23, 59, 59, 999);
      pastMeetings = pastMeetings.filter(m => new Date(m.date) <= toD);
    }

    return (
      <div className="flex flex-col h-full bg-white rounded-[16px] shadow-sm overflow-hidden border border-[#E5E7EB]">
        <div className="px-10 py-10 border-b border-[#F3F4F6] bg-gradient-to-br from-[#F8FAFC] to-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">Attendance</h1>
              <p className="text-[#6B7280] text-sm mt-1">{globalCourseName} • Evaluated by {globalInstructorName}</p>
            </div>
            <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-[6px] shadow-sm bg-white" style={{ borderColor: attendancePercentage >= 85 ? '#10B981' : (attendancePercentage >= 50 ? '#F59E0B' : '#EF4444') }}>
              <span className="text-2xl font-extrabold" style={{ color: attendancePercentage >= 85 ? '#10B981' : (attendancePercentage >= 50 ? '#F59E0B' : '#EF4444') }}>{attendancePercentage}%</span>
              <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-1">Overall</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-sm font-bold text-[#4B5563] uppercase tracking-widest">Past Sessions</h2>
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-[#E5E7EB] shadow-sm text-sm">
                  <div className="flex items-center gap-2">
                    <label className="text-[#6B7280] font-bold">From:</label>
                    <input 
                      type="date" 
                      value={fromDate} 
                      onChange={(e) => setFromDate(e.target.value)}
                      className="!border-none !outline-none !shadow-none !bg-transparent !p-0 !m-0 !text-[#111827] focus:!shadow-none focus:!ring-0"
                    />
                  </div>
                  <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                  <div className="flex items-center gap-2">
                    <label className="text-[#6B7280] font-bold">To:</label>
                    <input 
                      type="date" 
                      value={toDate} 
                      onChange={(e) => setToDate(e.target.value)}
                      className="!border-none !outline-none !shadow-none !bg-transparent !p-0 !m-0 !text-[#111827] focus:!shadow-none focus:!ring-0"
                    />
                  </div>
                  {(fromDate || toDate) && (
                    <button onClick={() => { setFromDate(''); setToDate(''); }} className="ml-2 text-xs font-bold text-[#EF4444] hover:text-[#B91C1C]">Clear</button>
                  )}
                </div>
              </div>
              {pastMeetings.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm bg-white p-6 rounded-[12px] border border-[#E5E7EB]">No past sessions found for this course.</p>
              ) : (
                <div className="space-y-3">
                  {pastMeetings.map((meeting, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${meeting.attended ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                        <div>
                          <h4 className="font-bold text-[#111827]">{meeting.topic}</h4>
                          <p className="text-xs text-[#6B7280] mt-0.5">{formatDateSafe(meeting.date)} • {formatTimeSafe(meeting.date)}</p>
                        </div>
                      </div>
                      <div>
                        {meeting.attended ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46]">Present</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B]">Absent</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  };

  const WorkspaceCertificates = () => (
    <div className="w-full h-full bg-[#F8FAFC]">
      <StudentCertificatesPage courses={courses} />
    </div>
  );

  const WorkspacePlaceholder = ({ title, icon }) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
       <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#9CA3AF] mb-6">
          {icon}
       </div>
       <h2 className="text-2xl font-bold text-[#111827] mb-2">{title}</h2>
       <p className="text-[#6B7280] max-w-md">
         This global workspace tool is currently being wired up to show data across all your enrolled courses.
       </p>
    </div>
  );

  // --- RENDER COMPONENT DYNAMICALLY --- //
  const renderWorkspace = () => {
    switch(activeTab) {
      case 'home': return <WorkspaceHome />;
      case 'learning': return <WorkspaceLearning />;
      case 'course-viewer': return <CourseContent key={activeCourseId} id={activeCourseId} user={user} isEmbedded={true} pendingRecordingUrl={pendingRecordingUrl} pendingRecordingTitle={pendingRecordingTitle} onRecordingPlayed={() => { setPendingRecordingUrl(null); setPendingRecordingTitle(null); }} />;
      case 'resources': return <WorkspaceResources />;
      case 'ask-doubt': return <WorkspaceAskDoubt />;
      case 'assignments': return <WorkspaceAssignments />;
      case 'meetings': return <WorkspaceLiveMeetings />;
      case 'quiz': return <WorkspaceQuiz />;
      case 'projects': return <WorkspaceProjects activeCourseId={activeCourseId} user={user} globalCourseName={globalCourseName} />;
      case 'certificates': return <WorkspaceCertificates />;
      case 'attendance': return <WorkspaceAttendance />;
      case 'mentor': return <WorkspaceMentor />;
      case 'placement': return <WorkspacePlacement />;
      case 'settings': return <div className="p-12"><h1 className="text-3xl font-extrabold text-[#111827]">Settings</h1><p className="text-[#6B7280]">Account and preferences configuration.</p></div>;
      default: return <WorkspaceHome />;
    }
  };

  const navItems = [
    { id: 'home', name: 'Home', icon: <FiHome /> },
    { id: 'learning', name: 'My Learning', icon: <FiBook /> },
    { id: 'meetings', name: 'Live Meetings', icon: <FiVideo /> },
    { id: 'attendance', name: 'Attendance', icon: <FiCalendar /> },
    { id: 'resources', name: 'Resources', icon: <FiPaperclip /> },
    { id: 'ask-doubt', name: 'Ask Doubt', icon: <FiMessageSquare /> },
    { id: 'assignments', name: 'Assignments', icon: <FiBriefcase /> },
    { id: 'quiz', name: 'Quiz', icon: <FiCheckSquare /> },
    { id: 'projects', name: 'Projects', icon: <FiTarget /> },
    { id: 'certificates', name: 'Certificates', icon: <FiAward /> },
    { id: 'placement', name: 'Placement', icon: <FiTrendingUp /> },
    { id: 'settings', name: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="fixed inset-0 pt-[80px] z-10 bg-white">
      <div className="flex h-full w-full bg-[#F9FAFB] text-[#111827] overflow-hidden font-sans">
        
        {/* LEFT SIDEBAR (Persistent) */}
        <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col h-full flex-shrink-0">
          <div className="p-6 border-b border-[#E5E7EB]">
            <h1 className="text-xl font-extrabold tracking-tight">Learning OS</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#F3F4F6] text-[#111827]' 
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
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
        <main className="flex-1 overflow-y-auto bg-white flex flex-col h-full relative">
           
           {renderWorkspace()}
           
           {/* FLOATING ACTION BAR (Mobile/Tablet Only) */}
           <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 xl:hidden z-50 border border-white/10">
              <button onClick={() => setActiveTab('course-viewer')} className="flex flex-col items-center gap-1 text-[#00f2fe] hover:text-white transition-colors">
                 <FiPlayCircle size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">Resume</span>
              </button>
              <button onClick={() => setActiveTab('ai-copilot')} className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors">
                 <FiTarget size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">AI</span>
              </button>
              <button onClick={() => setActiveTab('ask-doubt')} className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors">
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
    </div>
  );
};

export default StudentDashboard;



