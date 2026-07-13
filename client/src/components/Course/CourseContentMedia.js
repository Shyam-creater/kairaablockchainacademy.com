import React, { useEffect, useState } from 'react'
import CoursePlayer from "../../utils/CoursePlayer.js";
import { styles } from "../../styles/style"
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import { AiOutlineArrowLeft, AiOutlineArrowRight, } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useAddNewQuestionMutation, useAddAnswerInQuestionMutation, useGetQuizForSectionQuery, useSubmitQuizMutation, useCreateDoubtMutation, useGetStudentDoubtsQuery, useStudentReplyDoubtMutation, useSubmitAssignmentMutation, useGetStudentAssignmentsQuery, useGetStudentMeetingsQuery, useGetCourseAssignmentTasksQuery, useMarkAttendanceMutation, useMarkLessonWatchedMutation, useSaveResumeProgressMutation } from '../../redux/features/courses/coursesApi.js';
import { BiMessage } from 'react-icons/bi';
import { FaCheckCircle, FaRegCircle, FaClock, FaRedo, FaUpload, FaVideo, FaMedal, FaExternalLinkAlt, FaFilePdf, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FiCompass } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

const SectionHeading = ({ colorClass, title }) => (
  <h2 className={`text-base sm:text-lg font-extrabold text-[#111827] mb-5 flex items-center gap-3`}>
    <span className={`w-1 h-6 rounded-full flex-shrink-0 ${colorClass}`} />
    {title}
  </h2>
);

const CourseContentMedia = ({ data, id, activeVideo, setActiveVideo, user, refetch, resumePlaybackTime = 0, completedLessons = [], onMarkWatched, isCurrentLessonCompleted, courseDetails, meetings, activeCourseTab = 6, isEmbedded = false, hideVideo = false, pendingRecordingUrl = null, pendingRecordingTitle = null, onRecordingPlayed, selectedRecordingUrl, setSelectedRecordingUrl, selectedRecordingTitle, setSelectedRecordingTitle }) => {

  const [markLessonWatched] = useMarkLessonWatchedMutation();
  const [saveResumeProgress] = useSaveResumeProgressMutation();
  const isInitialVideoMount = React.useRef(true);

  const handlePlayRecording = (url, title) => {
    setSelectedRecordingUrl(url);
    setSelectedRecordingTitle(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPlaybackTimeRef = React.useRef(resumePlaybackTime);
  const lastSavedTimeRef = React.useRef(resumePlaybackTime);
  
  const handleTimeUpdate = (time) => {
    currentPlaybackTimeRef.current = time;
  };

  const saveProgress = async (time) => {
    // Do not save progress if we are watching a live session recording instead of the curriculum video
    if (selectedRecordingUrl) return;

    if (!data || !data[activeVideo]) return;
    const lectureId = data[activeVideo]._id;
    const sectionId = data[activeVideo].videoSection;

    let completionPercentage = 0;
    const lengthStr = data[activeVideo].videoLength;
    if (lengthStr && !isNaN(parseFloat(lengthStr))) {
       const durationSeconds = parseFloat(lengthStr) * 60;
       if (durationSeconds > 0) {
          completionPercentage = Math.min(100, (time / durationSeconds) * 100);
       }
    }

    try {
      await saveResumeProgress({
        courseId: id,
        lectureId,
        sectionId,
        playbackTime: time,
        completionPercentage: completionPercentage
      });
      lastSavedTimeRef.current = time;
    } catch (e) {
      console.error("Failed to save resume progress");
    }
  };

  // Autosave interval and page unload handler
  useEffect(() => {
    const interval = setInterval(() => {
      // Throttle: Only save if time changed by more than 2 seconds
      if (Math.abs(currentPlaybackTimeRef.current - lastSavedTimeRef.current) >= 2) {
        saveProgress(currentPlaybackTimeRef.current);
      }
    }, 10000);

    const handleBeforeUnload = () => {
      if (Math.abs(currentPlaybackTimeRef.current - lastSavedTimeRef.current) >= 2) {
        saveProgress(currentPlaybackTimeRef.current);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Auto-save on unmount / lecture change
      if (Math.abs(currentPlaybackTimeRef.current - lastSavedTimeRef.current) >= 2) {
         saveProgress(currentPlaybackTimeRef.current);
      }
    };
  }, [activeVideo, id, data]);

  // On mount: check if a recording was queued from WorkspaceResources via localStorage
  useEffect(() => {
    const pending = localStorage.getItem('pendingRecording');
    if (pending) {
      try {
        const { url, title } = JSON.parse(pending);
        if (url) {
          setSelectedRecordingUrl(url);
          setSelectedRecordingTitle(title || 'Session Recording');
          localStorage.removeItem('pendingRecording');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (e) {
        localStorage.removeItem('pendingRecording');
      }
    }
  }, []);

  // Also support prop-based recording (kept for backward compat)
  useEffect(() => {
    if (pendingRecordingUrl) {
      setSelectedRecordingUrl(pendingRecordingUrl);
      setSelectedRecordingTitle(pendingRecordingTitle || 'Session Recording');
      if (onRecordingPlayed) onRecordingPlayed();
    }
  }, [pendingRecordingUrl]);

  const formatEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    return url;
  };

  const isEmbeddableVideo = (url) => {
    if (!url) return false;
    return true; // User requested to always try embedding
  };

  const { data: meetingsData } = useGetStudentMeetingsQuery(id);
  const meetingsList = meetingsData?.meetings || [];

  const playableRecordings = React.useMemo(() => {
    const list = [];
    meetingsList.forEach(m => {
      if (m.recordingUrl) {
        list.push({ url: m.recordingUrl, title: m.topic || "Meeting Recording" });
      }
      if (m.materials) {
        m.materials.forEach(mat => {
          if (isEmbeddableVideo(mat.url)) {
            list.push({ url: mat.url, title: mat.name || "Live Session Recording" });
          }
        });
      }
    });
    return list;
  }, [meetingsList]);

  const currentRecordingIndex = selectedRecordingUrl ? playableRecordings.findIndex(r => r.url === selectedRecordingUrl) : -1;

  const groupedResources = React.useMemo(() => {
    const groups = {};
    if (data) {
      data.forEach(lesson => {
        if (lesson.links && lesson.links.length > 0) {
          if (!groups[lesson.videoSection]) {
            groups[lesson.videoSection] = [];
          }
          groups[lesson.videoSection].push(...lesson.links);
        }
      });
    }
    return groups;
  }, [data]);


  const [activeBar, setactiveBar] = useState(activeCourseTab || 6);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isEmbedded && activeCourseTab !== undefined) {
      setactiveBar(activeCourseTab);
    }
  }, [activeCourseTab, isEmbedded]);

  const [question, setQuestion] = useState('');
  const [review, setReview] = useState("");
  const [rating, setRating] = useState();
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  // Quiz state
  const currentSection = data[activeVideo]?.videoSection;
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizTimeLeft, setQuizTimeLeft] = useState(null);

  const { data: quizData } = useGetQuizForSectionQuery(
    { courseId: id, sectionName: currentSection },
    { skip: !currentSection }
  );
  const quiz = quizData?.quiz;
  const [submitQuiz, { isLoading: submittingQuiz }] = useSubmitQuizMutation();

  // Reset quiz state on video change (skip initial mount so recording URL is preserved)
  useEffect(() => {
    if (isInitialVideoMount.current) {
      isInitialVideoMount.current = false;
      return;
    }
    setQuizAnswers({});
    setQuizResult(null);
    setQuizSubmitted(false);
    setSelectedRecordingUrl(null);
    setSelectedRecordingTitle(null);
  }, [activeVideo]);

  // Track last watched video for dashboard resume functionality
  useEffect(() => {
    if (data && data[activeVideo] && user && user._id) {
      const progressObj = {
        courseId: id,
        videoId: data[activeVideo]._id,
        videoTitle: selectedRecordingTitle || data[activeVideo].title,
        courseName: courseDetails?.name || "My Course",
        activeVideo: activeVideo,
        recordingUrl: selectedRecordingUrl || null,
        timestamp: Date.now()
      };
      localStorage.setItem(`lastWatched_${user._id}`, JSON.stringify(progressObj));
      localStorage.setItem(`courseProgress_${user._id}_${id}`, JSON.stringify(progressObj));
      
      // Save progress to the backend (only for actual course videos)
      if (data[activeVideo]._id && !selectedRecordingUrl) {
        markLessonWatched({
          courseId: id,
          lessonId: data[activeVideo]._id
        });
      }
    }
  }, [activeVideo, data, id, user, courseDetails, markLessonWatched, selectedRecordingUrl, selectedRecordingTitle]);

  // Quiz timer
  useEffect(() => {
    if (quiz?.timeLimit && activeBar === 3 && !quizSubmitted) {
      setQuizTimeLeft(quiz.timeLimit * 60);
      const interval = setInterval(() => {
        setQuizTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(interval); handleSubmitQuiz(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [quiz, activeBar, quizSubmitted]);

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    const answers = quiz.questions.map((_, i) => quizAnswers[i] ?? -1);
    try {
      const result = await submitQuiz({ quizId: quiz._id, answers }).unwrap();
      setQuizResult(result);
      setQuizSubmitted(true);
      if (result.passed) toast.success(`✅ Passed! Score: ${result.score}%`);
      else toast.error(`❌ Failed. Score: ${result.score}%. Try again.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Could not submit quiz.');
    }
  };

  const isReviewExists = data?.reviews?.find(
    (item) => item.user._id === user._id
  );

  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation();

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const handleQuestion = () => {
    console.log('User in handleQuestion:', user);
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      console.log({ videoUrl: data[activeVideo]?.videoUrl });
      console.log({
        question,
        courseId: id,
        contentId: data[activeVideo]._id
      })
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,

      });
    }
  };


  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });

    console.log('mhgfdxfgchj')
  };

  console.log(` questionhgfh ${questionId}`)
  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully!")
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = error;
        toast.error(errorMessage.data.message)
      }
    }
    console.log('User in useEffect:', user);
    if (error) {
      if ("data" in error) {
        const errorMessage = error;
        toast.error(errorMessage.data.message)
      }
    }
  }, [isSuccess, error, answerError, answerSuccess])

  return (
    <div className='w-full flex flex-col xl:flex-row gap-6'>
      <div className={`transition-all duration-300 ${isFullScreen ? 'w-full' : 'w-full xl:w-[70%]'}`}>
        {!hideVideo && (
          <>
            <div className="relative overflow-hidden shadow-sm mb-6 bg-black border border-[#E5E7EB]">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all"
                title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullScreen ? <FaCompress /> : <FaExpand />}
              </button>
              {(selectedRecordingUrl || data[activeVideo]?.videoUrl)?.startsWith('http') ? (
              isEmbeddableVideo(selectedRecordingUrl || data[activeVideo]?.videoUrl) ? (
                <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
                  <iframe
                    key={selectedRecordingUrl || data[activeVideo]?.videoUrl}
                    src={formatEmbedUrl(selectedRecordingUrl || data[activeVideo]?.videoUrl)}
                    style={{ border: 0, width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
                    <FaExternalLinkAlt className="text-4xl text-[#3B82F6] mb-4" />
                    <h3 className="text-xl font-bold mb-2">External Link / Meeting</h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-md">This resource is hosted externally and cannot be embedded directly in the player. Click the button below to open it.</p>
                    <a
                      href={selectedRecordingUrl || data[activeVideo]?.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                    >
                      Open Link <FaExternalLinkAlt size={14} />
                    </a>
                  </div>
                </div>
              )
            ) : (
              <CoursePlayer
                  key={selectedRecordingUrl || data[activeVideo]?.videoUrl}
                  title={selectedRecordingTitle || data[activeVideo]?.title}
                  videoUrl={selectedRecordingUrl || data[activeVideo]?.videoUrl}
                  resumeTime={isInitialVideoMount.current ? resumePlaybackTime : 0}
                  onTimeUpdate={handleTimeUpdate}
                />
            )}
          </div>
          
          <div className="px-2 mb-2">
            <h2 className="text-2xl font-bold text-[#111827]">
              {selectedRecordingTitle || data[activeVideo]?.title}
            </h2>
            {selectedRecordingTitle && (
              <p className="text-sm text-[#3B82F6] font-semibold mt-1">
                Live Session Recording
              </p>
            )}
          </div>

          <div className="w-full flex flex-col lg:flex-row items-center justify-between my-8 gap-6 px-2">
            <div className="flex flex-col sm:flex-row w-full lg:w-auto flex-1 gap-4">
              <button
                onClick={() => {
                  if (selectedRecordingUrl && currentRecordingIndex > 0) {
                    handlePlayRecording(playableRecordings[currentRecordingIndex - 1].url, playableRecordings[currentRecordingIndex - 1].title);
                  } else if (!selectedRecordingUrl) {
                    setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1);
                  }
                }}
                disabled={selectedRecordingUrl ? currentRecordingIndex <= 0 : activeVideo === 0}
                className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-2xl transition-all duration-300 border text-left ${(selectedRecordingUrl ? currentRecordingIndex <= 0 : activeVideo === 0) ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" : "bg-white border-[#E5E7EB] hover:border-[#111827] hover:shadow-md group"}`}
              >
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${(selectedRecordingUrl ? currentRecordingIndex <= 0 : activeVideo === 0) ? "text-slate-400" : "text-[#6B7280] group-hover:text-[#111827]"}`}>
                  <AiOutlineArrowLeft className="text-sm" /> Previous
                </div>
                <div className="text-sm font-bold text-[#111827] line-clamp-1 w-full">
                  {selectedRecordingUrl 
                    ? (currentRecordingIndex > 0 ? playableRecordings[currentRecordingIndex - 1]?.title : "No previous class")
                    : (activeVideo > 0 ? data[activeVideo - 1]?.title : "No previous class")
                  }
                </div>
              </button>

              <button
                onClick={() => {
                  if (selectedRecordingUrl && currentRecordingIndex < playableRecordings.length - 1) {
                    handlePlayRecording(playableRecordings[currentRecordingIndex + 1].url, playableRecordings[currentRecordingIndex + 1].title);
                  } else if (!selectedRecordingUrl) {
                    setActiveVideo(activeVideo === data.length - 1 ? activeVideo : activeVideo + 1);
                  }
                }}
                disabled={selectedRecordingUrl ? currentRecordingIndex >= playableRecordings.length - 1 : activeVideo === data.length - 1}
                className={`flex-1 flex flex-col items-end gap-1 p-4 rounded-2xl transition-all duration-300 border text-right ${(selectedRecordingUrl ? currentRecordingIndex >= playableRecordings.length - 1 : activeVideo === data.length - 1) ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" : "bg-white border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-blue-50/30 hover:shadow-md group"}`}
              >
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${(selectedRecordingUrl ? currentRecordingIndex >= playableRecordings.length - 1 : activeVideo === data.length - 1) ? "text-slate-400" : "text-[#3B82F6]"}`}>
                  Next Up <AiOutlineArrowRight className="text-sm" />
                </div>
                <div className="text-sm font-bold text-[#111827] line-clamp-1 w-full">
                  {selectedRecordingUrl 
                    ? (currentRecordingIndex < playableRecordings.length - 1 ? playableRecordings[currentRecordingIndex + 1]?.title : "No more classes")
                    : (activeVideo < data.length - 1 ? data[activeVideo + 1]?.title : "Course completed")
                  }
                </div>
              </button>
            </div>
          </div>

          <div className="w-full p-2 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl flex-wrap gap-2 mb-8">
            {[
              { id: 6, label: 'AI Co-Pilot' },
              { id: 7, label: 'Notepad' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeBar === tab.id
                    ? "bg-white text-[#111827] border border-[#E5E7EB] shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827] border border-transparent"
                  }`}
                onClick={() => setactiveBar(tab.id)}
              >
                {tab.label === 'AI Co-Pilot' && <span className="text-[10px] bg-[#EFF6FF] text-[#3B82F6] px-2 py-0.5 rounded-full border border-[#BFDBFE]">AI</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      <br />
  
      {/* Ask Doubt Tab (Now index 2) */}
      {activeBar === 2 && (
        <StudentDoubtCenter courseId={id} user={user} />
      )}

      {/* Assignments Tab (Now index 3) */}
      {activeBar === 3 && (
        <StudentAssignments courseId={id} />
      )}

      {/* Quiz Tab (Index 5) */}
      {activeBar === 5 && quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full mt-4"
        >
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#8B5CF6]">
                  <MdQuiz className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">Lesson Assessment</h2>
                  <p className="text-sm text-[#6B7280] font-medium mt-1">Test your knowledge to proceed</p>
                </div>
              </div>
              {!quizSubmitted && quizTimeLeft !== null && (
                <motion.div
                  animate={{ scale: quizTimeLeft <= 60 ? [1, 1.05, 1] : 1 }}
                  transition={{ repeat: quizTimeLeft <= 60 ? Infinity : 0, duration: 1 }}
                  className={`mt-4 md:mt-0 px-6 py-3 rounded-full font-bold flex items-center gap-3 border ${quizTimeLeft <= 60 ? 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]' : 'bg-[#F9FAFB] text-[#3B82F6] border-[#BFDBFE]'}`}
                >
                  <FaClock className="text-xl" />
                  <span className="text-xl tracking-wider">
                    {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {quizSubmitted && quizResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="text-center py-16 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] mb-6 relative overflow-hidden"
                >
                  {quizResult.passed && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10B981] to-teal-500" />
                  )}
                  {!quizResult.passed && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#EF4444] to-orange-500" />
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: quizResult.passed ? [0, 15, -15, 0] : 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-8xl mb-6 flex justify-center"
                  >
                    {quizResult.passed ?
                      <FaMedal className="text-[#10B981]" /> :
                      <FaRedo className="text-[#EF4444]" />
                    }
                  </motion.div>

                  <h3 className={`text-4xl font-extrabold mb-4 tracking-tight ${quizResult.passed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {quizResult.passed ? 'Assessment Cleared!' : 'Assessment Failed'}
                  </h3>

                  <div className="inline-block bg-white rounded-2xl p-6 mt-2 mb-8 border border-[#E5E7EB] shadow-sm">
                    <p className="text-[#6B7280] text-sm uppercase tracking-widest font-bold mb-2">Final Score</p>
                    <p className="text-6xl font-black text-[#111827]">
                      {quizResult.score}<span className="text-3xl text-[#9CA3AF]">%</span>
                    </p>
                    <p className="text-sm font-medium text-[#6B7280] mt-2">Required: {quiz.passMark}%</p>
                  </div>

                  {!quizResult.passed && (
                    <div>
                      <button
                        onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizResult(null); }}
                        className="px-10 py-4 text-lg bg-[#EF4444] text-white font-bold rounded-xl shadow-md hover:bg-[#DC2626]"
                      >
                        Retry Assessment
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="questions" className="space-y-8" initial="hidden" animate="visible" variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}>
                  {quiz.questions.map((q, i) => (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      key={q._id}
                      className="p-8 border border-[#E5E7EB] rounded-2xl bg-white shadow-sm hover:border-[#111827] transition-all relative overflow-hidden group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E5E7EB] group-hover:bg-[#111827] transition-colors" />

                      <h4 className="font-extrabold text-xl text-[#111827] mb-6 leading-relaxed">
                        <span className="text-[#3B82F6] mr-2">{i + 1}.</span> {q.question}
                      </h4>

                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = quizAnswers[i] === oIndex;
                          return (
                            <motion.label
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.99 }}
                              key={oIndex}
                              className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl transition-all border ${isSelected
                                  ? 'bg-[#F9FAFB] border-[#111827] shadow-inner'
                                  : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#9CA3AF]'
                                }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'border-[#111827]' : 'border-[#9CA3AF]'
                                }`}>
                                {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-[#111827] rounded-full" />}
                              </div>
                              <input
                                type="radio"
                                name={`quiz-q-${i}`}
                                className="hidden"
                                checked={isSelected}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [i]: oIndex })}
                              />
                              <span className={`text-lg ${isSelected ? 'text-[#111827] font-bold' : 'text-[#374151] font-medium'}`}>
                                {opt}
                              </span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    className="flex flex-col items-end pt-8 mt-8 border-t border-[#E5E7EB]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      className={`px-12 py-4 text-xl rounded-xl font-bold transition-colors ${Object.keys(quizAnswers).length < quiz.questions.length ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed' : 'bg-[#111827] text-white hover:bg-[#374151]'}`}
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz || Object.keys(quizAnswers).length < quiz.questions.length}
                    >
                      {submittingQuiz ? 'Evaluating...' : 'Submit Assessment'}
                    </button>

                    {Object.keys(quizAnswers).length < quiz.questions.length && (
                      <p className="text-[#EF4444] font-bold mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                        Please select an answer for all questions.
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* AI Co-Pilot Tab (Index 6) */}
      {activeBar === 6 && (
        <div className="w-full mt-4 animate-fade-in">
          <AICoPilot lessonTitle={selectedRecordingTitle || data[activeVideo]?.title || "this lesson"} />
        </div>
      )}

      {/* Notepad Tab (Index 7) */}
      {activeBar === 7 && (
        <div className="w-full mt-4 animate-fade-in">
          <Notepad lessonId={data[activeVideo]?._id || id} />
        </div>
      )}
      </div>

      {!isFullScreen && (
        <div className="w-full xl:w-[30%] flex flex-col gap-4">
          <StudentMeetings courseId={id} onPlayRecording={handlePlayRecording} />



          {/* Live Session Materials */}
          {meetings && meetings.some(m => m.materials && m.materials.length > 0) && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#111827]"><span className="text-[#8B5CF6]">📚</span> Session Materials</h2>
              <ul className="flex flex-col space-y-3">
                {meetings.filter(m => m.materials && m.materials.length > 0).map((meeting, idx) => (
                  <li key={idx} className="bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] hover:border-[#8B5CF6] transition-colors">
                    <h4 className="font-bold text-[#111827] mb-0.5 text-xs">{meeting.topic}</h4>
                    <p className="text-[10px] text-[#6B7280] mb-2 font-mono">{new Date(meeting.date).toLocaleDateString()}</p>
                    <ul className="space-y-1.5 mt-2 border-t border-[#E5E7EB] pt-2">
                      {meeting.materials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <FaFilePdf className="text-[#EF4444] text-xs flex-shrink-0" />
                          {isEmbeddableVideo(mat.url) ? (
                            <button onClick={() => handlePlayRecording(mat.url, mat.name || "Live Session Recording")} className="text-[#111827] hover:text-[#EF4444] hover:underline font-bold text-xs transition-colors cursor-pointer text-left leading-tight">
                              {mat.name || "Watch Recording"}
                            </button>
                          ) : (
                            <a href={mat.url} target="_blank" rel="noopener noreferrer" className="text-[#111827] hover:text-[#EF4444] hover:underline font-bold text-xs transition-colors leading-tight">
                              {mat.name || "Download Material"}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* reviews */}
      {/* {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <img
                    src={
                      user.avatar
                        ? user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500]  text-black ">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Write your comment..."
                      className="outline-none bg-transparent 800px:ml-3  text-black border border-[#00000027]  w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end"> */}
      {/* <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={
                      reviewCreationLoading ? () => {} : handleReviewSubmit
                    }
                  >
                    Submit
                  </div> */}
      {/* </div>
              </>
            )}
            <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div> */}



      {/* <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse())?.map(
                (item, index) => {
                  
                  return (
                    <div className="w-full my-5  text-black" key={index}>
                      <div className="w-full flex">
                        <div>
                          <img
                            src={
                              item.user.avatar
                                ? item.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-2">
                          <h1 className="text-[18px]">{item?.user.name}</h1>
                          <Ratings rating={item.rating} />
                          <p>{item.comment}</p>
                          <small className="text-[#0000009e] dark:text-[#ffffff83]">
                            {format(item.createdAt)} •
                          </small>
                        </div>
                      </div>
                      {user.role === "admin" && item.commentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-10 cursor-pointer`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Add Reply
                        </span>
                      )}

                      {isReviewReply && reviewId === item._id && (
                        <div className="w-full flex relative">
                          <input
                            type="text"
                            placeholder="Enter your reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"
                          />
                          <button
                            type="submit"
                            className="absolute right-0 bottom-1"
                            onClick={handleReviewReplySubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}

                      {item.commentReplies.map((i, index) => (
                        <div className="w-full flex 800px:ml-16 my-5" key={index}>
                          <div className="w-[50px] h-[50px]">
                            <img
                              src={
                                i.user.avatar
                                  ? i.user.avatar.url
                                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                              width={50}
                              height={50}
                              alt=""
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                              <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                            </div>
                            <p>{i.comment}</p>
                            <small className="text-[#ffffff83]">
                              {format(i.createdAt)} •
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
              )}
            </div> */}
      {/* </> */}
      {/* </div> */}
      {/* )} */}

    </div>
  )
}



const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  user,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo].questions.map((item, index) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};


const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}) => {
  const [replyActive, setreplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <img
              src={
                item.user.avatar
                  ? item.user.avatar.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
          <div className="pl-3  text-black">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] ">
              {!item.createdAt ? "" : format(item?.createdAt)} •
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span
            className="800px:pl-16 text-[#000000b8]  cursor-pointer mr-2"
            onClick={() => {
              setreplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className=" cursor-pointer text-[#000000b8]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] ">
            {item.questionReplies.length}
          </span>
        </div>

        {replyActive && questionId === item._id && (
          <>
            {item.questionReplies.map((item) => (
              <div className="w-full flex 800px:ml-16 my-5 text-black " key={item._id}>
                <div>
                  <img
                    src={
                      item.user.avatar
                        ? item.user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item.user.name}</h5>{" "}
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#ffffff83]">
                    {format(item.createdAt)} •
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative  text-black">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027]  text-black  p-[5px] w-[95%] ${answer === "" ||
                    (answerCreationLoading && "cursor-not-allowed")
                    }`}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </>
          </>
        )}
        )}
      </div>
    </>
  );
};

// ==========================================
// STUDENT DOUBTS COMPONENT
// ==========================================
const StudentDoubtCenter = ({ courseId, user }) => {
  const { data, isLoading, refetch } = useGetStudentDoubtsQuery(courseId);
  const doubts = data?.doubts || [];

  const [createDoubt, { isLoading: isCreating }] = useCreateDoubtMutation();
  const [replyDoubt] = useStudentReplyDoubtMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleCreateDoubt = async () => {
    if (!title || !description) return toast.error("Please fill all fields");
    try {
      await createDoubt({ courseId, title, description }).unwrap();
      toast.success("Doubt submitted successfully");
      setTitle("");
      setDescription("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit doubt");
    }
  };

  const handleReply = async () => {
    if (!replyMessage || !activeDoubt) return;
    try {
      await replyDoubt({ doubtId: activeDoubt._id, message: replyMessage }).unwrap();
      toast.success("Reply sent");
      setReplyMessage("");
      refetch();
      setActiveDoubt(prev => ({
        ...prev,
        replies: [...prev.replies, { sender: "student", message: replyMessage, createdAt: new Date() }]
      }));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      {!activeDoubt ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#111827] flex items-center gap-2"><span className="text-[#EF4444]">❓</span> Ask a New Doubt</h2>
            <div className="space-y-4">
              <input
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[#111827] outline-none focus:border-[#EF4444] transition-colors"
                placeholder="Doubt Title (e.g. Smart Contract Error)"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[#111827] outline-none focus:border-[#EF4444] transition-colors custom-scrollbar"
                placeholder="Describe your issue in detail..."
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <button
                className={`w-full py-3 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#374151] transition-colors ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCreateDoubt}
                disabled={isCreating}
              >
                {isCreating ? "Submitting..." : "Submit Doubt to Staff"}
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">My Previous Doubts</h2>
            {isLoading ? <p className="text-slate-400">Loading...</p> : doubts.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {doubts.map(doubt => (
                  <div
                    key={doubt._id}
                    className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-white hover:border-[#EF4444] transition-colors flex justify-between items-start"
                    onClick={() => setActiveDoubt(doubt)}
                  >
                    <div>
                      <h4 className="font-bold text-[#111827]">{doubt.title}</h4>
                      <p className="text-xs text-[#6B7280] line-clamp-1 mt-1">{doubt.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${doubt.status === 'open' ? 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]' : 'bg-[#F0FDF4] text-[#10B981] border-[#bbf7d0]'}`}>
                      {doubt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#6B7280] text-sm bg-[#F9FAFB] p-6 rounded-xl border border-[#E5E7EB] text-center">You haven't asked any doubts yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#F3F4F6]">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">{activeDoubt.title}</h2>
              <p className="text-sm text-[#6B7280] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                Assigned Staff: {activeDoubt.staffId?.name || 'Pending Assignment'}
              </p>
            </div>
            <button onClick={() => setActiveDoubt(null)} className="text-xs text-[#374151] hover:text-[#111827] font-bold bg-[#F3F4F6] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
              ← Back to Doubts
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-[#6B7280] font-bold uppercase tracking-wider pl-1">You (Original Query)</span>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded-2xl rounded-tl-sm max-w-[80%]">
                <p className="text-sm text-[#374151] whitespace-pre-wrap">{activeDoubt.description}</p>
              </div>
            </div>
            {activeDoubt.replies?.map((r, i) => (
              <div key={i} className={`flex flex-col gap-1 ${r.sender === 'student' ? 'items-start' : 'items-end'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${r.sender === 'student' ? 'text-[#6B7280] pl-1' : 'text-[#3B82F6] pr-1'}`}>{r.sender === 'student' ? 'You' : 'Staff'}</span>
                <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${r.sender === 'student' ? 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] rounded-tl-sm' : 'bg-[#3B82F6] text-white font-medium rounded-tr-sm shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{r.message}</p>
                </div>
              </div>
            ))}
          </div>

          {activeDoubt.status === 'open' && (
            <div className="flex gap-2 mt-auto">
              <input
                className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#EF4444] transition-colors"
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
              />
              <button onClick={handleReply} className="px-8 py-3 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#374151] transition-colors">
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ==========================================
// STUDENT ASSIGNMENTS COMPONENT
// ==========================================
const StudentAssignments = ({ courseId }) => {
  const { data, isLoading, refetch } = useGetStudentAssignmentsQuery(courseId);
  const assignments = data?.assignments || [];

  const { data: tasksData, isLoading: isLoadingTasks } = useGetCourseAssignmentTasksQuery(courseId);
  const assignmentTasks = tasksData?.tasks || [];

  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setFile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTask || !file) return toast.error("Please select an assignment task and attach a file");
    try {
      await submitAssignment({ courseId, assignmentTitle: selectedTask, submittedFile: file }).unwrap();
      toast.success("Assignment submitted for review!");
      setSelectedTask("");
      setFile("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit assignment");
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Submit Form */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#111827]">Submit Assignment</h2>
          <div className="space-y-4">
            <div className="w-full">
              <label className="block text-sm font-bold text-[#6B7280] mb-2 uppercase tracking-wider">Select Assignment Task</label>
              <select
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[#111827] outline-none focus:border-[#3B82F6] transition-colors"
                value={selectedTask}
                onChange={e => setSelectedTask(e.target.value)}
              >
                <option value="">-- Choose an assignment --</option>
                {assignmentTasks.map(task => (
                  <option key={task._id} value={task.title}>{task.title}</option>
                ))}
              </select>
              {assignmentTasks.length === 0 && !isLoadingTasks && (
                <p className="text-xs text-[#EF4444] mt-2 font-medium">No pending assignments available for this course.</p>
              )}
            </div>

            {selectedTask && (
              <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-sm text-[#374151] mb-4">
                <strong className="text-[#3B82F6] uppercase tracking-wider text-xs">Instructions:</strong> <br />{assignmentTasks.find(t => t.title === selectedTask)?.description}
                <br /><br />
                <strong className="text-[#3B82F6] uppercase tracking-wider text-xs">Due Date:</strong> <br />{new Date(assignmentTasks.find(t => t.title === selectedTask)?.dueDate).toLocaleDateString()}
              </div>
            )}

            <div className="w-full p-4 border border-[#E5E7EB] border-dashed rounded-xl bg-[#F9FAFB] hover:bg-white transition-colors">
              <label className="block text-sm font-bold text-[#6B7280] mb-2 uppercase tracking-wider">Upload File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={handleFileChange}
                className="w-full text-[#6B7280] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#EFF6FF] file:text-[#3B82F6] hover:file:bg-[#DBEAFE] transition-all"
              />
            </div>

            <button
              className={`w-full flex items-center justify-center gap-2 py-3 bg-[#111827] text-white font-bold rounded-xl hover:bg-[#374151] transition-colors ${!selectedTask || !file ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedTask || !file}
            >
              <FaUpload /> {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </div>
        </div>

        {/* Previous Submissions */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#111827]">My Submissions</h2>
          {isLoading ? <p className="text-[#6B7280]">Loading...</p> : assignments.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {assignments.map(a => (
                <div key={a._id} className="p-4 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] hover:bg-white transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#111827]">{a.assignmentTitle}</h4>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold border ${a.status === 'approved' ? 'bg-[#F0FDF4] text-[#10B981] border-[#bbf7d0]' :
                        a.status === 'rejected' ? 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]' :
                          'bg-[#FEF9C3] text-[#CA8A04] border-[#FDE047]'
                      }`}>
                      {a.status.toUpperCase()}
                    </span>
                  </div>
                  <a href={a.submittedFile} target="_blank" rel="noreferrer" className="text-xs text-[#3B82F6] hover:underline mb-2 block truncate">
                    View Submitted File
                  </a>
                  {a.status !== 'pending' && (
                    <div className="mt-3 p-3 bg-white border border-[#E5E7EB] rounded-lg">
                      <p className="text-sm font-bold text-[#111827]">Marks: <span className="text-[#3B82F6] text-lg">{a.marks}</span></p>
                      <p className="text-xs text-[#6B7280] mt-1"><span className="font-bold uppercase tracking-wider text-[#9CA3AF]">Feedback:</span> <br />{a.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] text-sm bg-[#F9FAFB] p-6 rounded-xl border border-[#E5E7EB] text-center">You haven't submitted any assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STUDENT MEETINGS COMPONENT
// ==========================================
const StudentMeetings = ({ courseId, onPlayRecording }) => {
  const { data, isLoading } = useGetStudentMeetingsQuery(courseId);
  const meetings = data?.meetings || [];
  const [markAttendance] = useMarkAttendanceMutation();

  const handleJoinMeeting = async (meeting) => {
    try {
      await markAttendance({ meetingId: meeting._id, courseId }).unwrap();
    } catch (error) {
      console.error("Failed to mark attendance", error);
    }
    // Open zoom link regardless of attendance API success
    window.open(meeting.zoomLink, "_blank");
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#111827]">
        Live Sessions
      </h2>

      {isLoading ? (
        <p className="text-[#6B7280] text-sm">Loading sessions...</p>
      ) : meetings.length > 0 ? (
        <div className="flex flex-col gap-3">
          {meetings.map((meeting) => {
            const isEnded = meeting.status === "completed" || new Date() > new Date(meeting.endDate);
            
            return (
              <div key={meeting._id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-white hover:border-[#E2E8F0] hover:shadow-sm transition-all duration-200 w-full overflow-hidden">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#111827] shadow-sm">
                    <FaVideo size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {meeting.recordingUrl ? (
                      <h3 
                        className="text-sm font-bold text-[#111827] truncate cursor-pointer hover:text-[#10B981] hover:underline transition-colors"
                        onClick={() => onPlayRecording(meeting.recordingUrl, meeting.topic || "Meeting Recording")}
                      >
                        {meeting.title || meeting.topic}
                      </h3>
                    ) : (
                      <h3 className="text-sm font-bold text-[#111827] truncate">{meeting.title || meeting.topic}</h3>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] mt-1 truncate">
                      <FaClock size={12} className="flex-shrink-0" />
                      <span className="truncate">{new Date(meeting.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {meeting.recordingUrl ? null : !isEnded ? (
                    <button
                      onClick={() => handleJoinMeeting(meeting)}
                      className="text-xs font-bold bg-[#0F172A] text-white px-4 py-2 rounded-lg hover:bg-[#1E293B] transition-colors shadow-sm whitespace-nowrap"
                    >
                      Join Session
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[#64748B] text-sm">No scheduled sessions at this time.</p>
      )}
    </div>
  );
};

// ==========================================
// AI CO-PILOT COMPONENT
// ==========================================
const AICoPilot = ({ lessonTitle }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello! I'm your AI Learning Assistant. Do you have any questions about "${lessonTitle}"?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    setMessages([
      { role: 'ai', text: `Hello! I'm your AI Learning Assistant. Do you have any questions about "${lessonTitle}"?` }
    ]);
  }, [lessonTitle]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('summary') || text.includes('summarize')) {
      return `Here is a summary of "${lessonTitle}": This lesson covers the core principles and syntax required to master the topic. Key takeaways include understanding the architecture, setting up your environment correctly, and following best practices to avoid common pitfalls.`;
    } else if (text.includes('explain') || text.includes('how')) {
      return `I can explain that! In the context of "${lessonTitle}", the mechanism works by breaking down complex operations into smaller, manageable functions. This modular approach ensures that your code is reusable and easier to debug.`;
    } else if (text.includes('error') || text.includes('bug')) {
      return `Errors are a normal part of learning! Make sure to check your syntax and verify that all dependencies are installed. In "${lessonTitle}", a common mistake is forgetting to initialize variables correctly before using them.`;
    } else if (text.includes('quiz') || text.includes('test')) {
      return `Sure, let's test your knowledge! Question: What is the primary purpose of the main concept discussed in "${lessonTitle}"? (Reply with your answer and I'll grade it!)`;
    } else {
      return `That's a great question. While I don't have the exact answer right now, I recommend re-watching the middle section of "${lessonTitle}" where the instructor dives deep into this specific scenario. Do you want me to summarize the lesson instead?`;
    }
  };

  const handleSend = (textToProcess = input) => {
    if (!textToProcess.trim()) return;
    const userMsg = { role: 'user', text: textToProcess };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Processing Delay
    setTimeout(() => {
      const responseText = generateAIResponse(textToProcess);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5s and 2.5s
  };

  const suggestions = [
    "Summarize this lesson",
    "Explain the core concepts",
    "Give me a quick quiz"
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-[500px] flex flex-col relative overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F3F4F6] relative z-10">
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE]">
          <span className="text-[#3B82F6] font-bold text-sm">AI</span>
        </div>
        <div>
          <h3 className="text-[#111827] font-bold text-lg">AI Co-Pilot</h3>
          <p className="text-xs text-[#3B82F6] animate-pulse">Online & Ready</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4 relative z-10 px-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-tr-sm font-medium shadow-sm' : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] rounded-tl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-10 mt-auto">
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="whitespace-nowrap text-[10px] bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] px-3 py-1.5 rounded-full hover:bg-[#DBEAFE] transition-colors uppercase tracking-wider font-bold"
            >
              {sug}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about this lesson..."
            disabled={isTyping}
            className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors disabled:opacity-50"
          />
          <button onClick={() => handleSend()} disabled={isTyping} className="bg-[#111827] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#374151] shadow-sm disabled:opacity-50 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NOTEPAD COMPONENT
// ==========================================
const Notepad = ({ lessonId }) => {
  const [note, setNote] = useState('');
  const [saveStatus, setSaveStatus] = useState('All changes saved');

  // Load saved note
  useEffect(() => {
    const saved = localStorage.getItem(`note_${lessonId}`);
    if (saved) setNote(saved);
  }, [lessonId]);

  // Auto-save debounced
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      localStorage.setItem(`note_${lessonId}`, note);
      setSaveStatus('All changes saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [note, lessonId]);

  const handleDownload = () => {
    if (!note.trim()) {
      toast.error("Notepad is empty!");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([note], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `notes_lesson_${lessonId}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    toast.success("Notes downloaded successfully!");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your notes? This cannot be undone.")) {
      setNote('');
      localStorage.removeItem(`note_${lessonId}`);
      toast.success("Notes cleared!");
    }
  };

  return (
    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6 h-[500px] flex flex-col relative shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#FDE68A]">
        <div>
          <h3 className="text-[#92400E] font-bold text-lg flex items-center gap-2">
            <span>📝</span> Personal Notepad
          </h3>
          <p className="text-[10px] text-[#B45309] font-bold uppercase tracking-widest mt-1">{saveStatus}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleClear} className="text-xs text-[#EF4444] font-bold hover:bg-[#FEF2F2] px-3 py-1.5 rounded-lg transition-colors">
            Clear
          </button>
          <button onClick={handleDownload} className="text-xs flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] px-3 py-1.5 rounded-lg font-bold hover:bg-[#FDE68A] transition-colors border border-[#FDE68A]">
            <FaDownload /> Download
          </button>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your markdown notes here... (Auto-saves as you type)"
        className="flex-1 w-full bg-white/50 border border-[#FDE68A] rounded-xl p-5 text-[#374151] text-sm focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors custom-scrollbar resize-none leading-relaxed"
      />
    </div>
  );
};

export default CourseContentMedia;
