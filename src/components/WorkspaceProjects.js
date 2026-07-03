import React, { useState } from "react";
import { FiFolder, FiSend, FiCheckCircle, FiClock, FiXCircle, FiMessageSquare, FiCalendar, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { 
  useGetCourseProjectTasksQuery, 
  useGetStudentProjectsQuery, 
  useSubmitProjectMutation,
  useStudentReplyProjectMutation
} from "../redux/features/courses/coursesApi";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";

const WorkspaceProjects = ({ activeCourseId, user, globalCourseName }) => {
  const { data: tasksData, isLoading: isLoadingTasks } = useGetCourseProjectTasksQuery(activeCourseId, { skip: !activeCourseId });
  const projectTasks = tasksData?.projectTasks || [];
  
  const { data: submissionsData, isLoading: isLoadingSubmissions, refetch } = useGetStudentProjectsQuery(activeCourseId, { skip: !activeCourseId });
  const submissions = submissionsData?.projects || [];

  const [submitProject, { isLoading: isSubmitting }] = useSubmitProjectMutation();
  const [replyProject, { isLoading: isReplying }] = useStudentReplyProjectMutation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionLink) return toast.error("Please provide a submission link (GitHub/Zip URL)");
    
    try {
      await submitProject({
        courseId: activeCourseId,
        projectTaskId: selectedTask._id,
        submissionLink,
        message
      }).unwrap();
      
      toast.success("Project submitted successfully!");
      setSubmissionLink("");
      setMessage("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Error submitting project");
    }
  };

  const handleReply = async (e, projectId) => {
    e.preventDefault();
    if (!replyMessage) return toast.error("Please enter a message");

    try {
      await replyProject({
        projectId,
        message: replyMessage
      }).unwrap();
      
      toast.success("Reply sent");
      setReplyMessage("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Error sending reply");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><FiCheckCircle /> Approved</span>;
      case "rejected": return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><FiXCircle /> Rejected</span>;
      case "revision_requested": return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"><FiClock /> Revision Requested</span>;
      default: return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold border border-blue-200"><FiClock /> Pending</span>;
    }
  };

  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#F8FAFC]">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-6 border border-[#E5E7EB]"><FiFolder size={40} /></div>
        <h2 className="text-3xl font-black text-[#111827] mb-3">Course Projects</h2>
        <p className="text-[#6B7280] max-w-sm">Select a course to view and submit projects.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#F8FAFC] font-sans">
      {/* Left Sidebar - Task List */}
      <div className="w-1/3 bg-white border-r border-[#E5E7EB] flex flex-col hidden md:flex h-full">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-black text-[#111827]">Projects</h2>
          <p className="text-[#6B7280] text-sm mt-1">{projectTasks.length} Assigned</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoadingTasks ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>)}
            </div>
          ) : projectTasks.length > 0 ? (
            projectTasks.map((task) => {
               const submission = submissions.find(s => s.projectTaskId?._id === task._id || s.projectTaskId === task._id);
               return (
                  <div 
                    key={task._id} 
                    onClick={() => setSelectedTask(task)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTask?._id === task._id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-[#E5E7EB] hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-[#111827] truncate pr-2">{task.title}</h3>
                       {submission ? getStatusBadge(submission.status) : <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">To Do</span>}
                    </div>
                    <p className="text-xs text-[#6B7280] font-semibold flex items-center gap-1"><FiCalendar size={11} /> Due: {fmtDate(task.dueDate)}</p>
                  </div>
               );
            })
          ) : (
            <div className="text-center py-10">
              <FiFolder className="mx-auto text-slate-300 mb-2" size={24} />
              <p className="text-sm font-semibold text-slate-400">No projects assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {selectedTask ? (
          (() => {
            const submission = submissions.find(s => s.projectTaskId?._id === selectedTask._id || s.projectTaskId === selectedTask._id);
            return (
              <div className="flex flex-col h-full">
                {/* Task Header */}
                <div className="p-8 bg-white border-b border-slate-200 shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{selectedTask.title}</h1>
                      <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-1"><FiCalendar size={12} /> Due: {fmtDate(selectedTask.dueDate)} &middot; {globalCourseName}</p>
                    </div>
                    {submission && getStatusBadge(submission.status)}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap font-medium">
                    {selectedTask.description}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  {submission ? (
                    <div className="max-w-3xl mx-auto space-y-8">
                       <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Submission</p>
                            <a href={submission.submissionLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline break-all flex items-center gap-2">
                               <FiFolder /> {submission.submissionLink}
                            </a>
                          </div>
                          {submission.marks && (
                            <div className="bg-green-50 px-6 py-3 rounded-xl border border-green-200 text-center shrink-0">
                              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-0.5">Grade</p>
                              <p className="text-xl font-black text-green-700">{submission.marks}</p>
                            </div>
                          )}
                       </div>

                       {/* Interaction Thread */}
                       <div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <FiMessageSquare /> Feedback & Discussion
                          </h3>
                          <div className="space-y-6">
                            {submission.replies?.map((reply, i) => (
                              <div key={i} className={`flex gap-4 ${reply.sender === 'student' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm ${reply.sender === 'student' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                  {reply.sender === 'student' ? user?.name?.charAt(0) : 'S'}
                                </div>
                                <div className={`flex-1 max-w-[80%] ${reply.sender === 'student' ? 'text-right' : ''}`}>
                                   <div className={`inline-block p-4 rounded-2xl ${reply.sender === 'student' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                                     <p className="text-sm font-medium whitespace-pre-wrap">{reply.message}</p>
                                   </div>
                                   <p className="text-xs text-slate-400 mt-2 font-semibold">
                                     {fmtDateTime(reply.createdAt)}
                                   </p>
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>

                       {/* Reply Input */}
                       <div className="mt-8">
                         <form onSubmit={(e) => handleReply(e, submission._id)} className="bg-white rounded-2xl border border-slate-200 p-2 pl-4 flex items-center shadow-sm focus-within:border-blue-500 transition-colors">
                           <input
                             type="text"
                             className="flex-1 bg-transparent !border-none !outline-none !shadow-none !ring-0 !p-0 font-medium text-slate-700 placeholder-slate-400 focus:!ring-0"
                             placeholder="Type a message to your staff..."
                             value={replyMessage}
                             onChange={(e) => setReplyMessage(e.target.value)}
                           />
                           <button 
                             type="submit" 
                             disabled={isReplying}
                             className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ml-2"
                           >
                             <FiSend size={16} />
                           </button>
                         </form>
                       </div>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                       <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Submit Project <FiSend className="text-blue-600"/></h3>
                          <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Project URL (GitHub / Zip Link)</label>
                              <input 
                                type="url" 
                                required
                                value={submissionLink}
                                onChange={(e) => setSubmissionLink(e.target.value)}
                                className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 font-medium transition-colors !shadow-none"
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Message (Optional)</label>
                              <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 font-medium transition-colors !shadow-none min-h-[100px]"
                                placeholder="Add any comments about your submission..."
                              />
                            </div>
                            <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)]"
                            >
                              {isSubmitting ? "Submitting..." : "Submit Project"}
                            </button>
                          </form>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
             <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 mb-6">
                <FiFolder size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Project</h3>
             <p className="text-slate-500 font-medium max-w-sm">Choose a project from the sidebar to view details, submit your work, or check feedback.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceProjects;
