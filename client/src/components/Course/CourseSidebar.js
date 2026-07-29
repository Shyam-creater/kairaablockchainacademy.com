import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, PlayCircle, CheckCircle2, Lock, Clock, 
  ChevronDown, ChevronUp, BookOpen, Award, X 
} from "lucide-react";

const CircularProgress = ({ percentage, size = 64, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-[#E2E8F0] dark:text-[#1E293B]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-[#3B82F6] transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-[#0F172A] dark:text-white">{percentage}%</span>
      </div>
    </div>
  );
};

const CourseSidebar = ({ 
  data, 
  activeVideo, 
  setActiveVideo, 
  completedLessons = [], 
  setSelectedRecordingUrl, 
  setSelectedRecordingTitle,
  courseDetails 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (secName) => {
    setExpandedSections(prev => ({
      ...prev,
      [secName]: !prev[secName]
    }));
  };

  // Process data into sections
  const { sections, totalCourseVideos, totalCourseCompleted, totalDurationMins } = useMemo(() => {
    const secs = [];
    const secMap = {};
    let prevCompleted = true;
    let tVids = 0, tComp = 0, tDuration = 0;

    data?.forEach((item, index) => {
      const secName = item.videoSection || "Untitled Module";
      if (!secMap[secName]) {
        secMap[secName] = {
          name: secName,
          videos: [],
          totalVideos: 0,
          completedVideos: 0,
          totalDuration: 0
        };
        secs.push(secMap[secName]);
      }
      
      const isCompleted = completedLessons.includes(item._id);
      const isUnlocked = prevCompleted;
      const duration = Number(item.videoLength || 0);

      secMap[secName].videos.push({ ...item, index, isCompleted, isUnlocked, duration });
      secMap[secName].totalVideos += 1;
      secMap[secName].totalDuration += duration;
      
      tVids += 1;
      tDuration += duration;
      
      if (isCompleted) {
        secMap[secName].completedVideos += 1;
        tComp += 1;
      }
      
      prevCompleted = isCompleted;
    });

    secs.forEach(sec => {
      sec.completionPercentage = sec.totalVideos > 0 ? Math.round((sec.completedVideos / sec.totalVideos) * 100) : 100;
    });

    // Expand all sections by default if not set
    const initialExpanded = {};
    secs.forEach(s => initialExpanded[s.name] = true);
    
    return { sections: secs, totalCourseVideos: tVids, totalCourseCompleted: tComp, totalDurationMins: tDuration };
  }, [data, completedLessons]);

  // Set initial expanded state once
  React.useEffect(() => {
    const initial = {};
    sections.forEach(s => initial[s.name] = true);
    setExpandedSections(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overallProgress = totalCourseVideos === 0 ? 0 : Math.round((totalCourseCompleted / totalCourseVideos) * 100);
  
  // Format hours/mins
  const formatDuration = (mins) => {
    if (mins === 0) return "0 mins";
    if (mins < 60) return `${mins} mins`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} Hours`;
  };

  // Filter sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    
    const query = searchQuery.toLowerCase();
    return sections.map(sec => {
      const matchingVideos = sec.videos.filter(v => v.title.toLowerCase().includes(query));
      if (matchingVideos.length > 0 || sec.name.toLowerCase().includes(query)) {
        return { ...sec, videos: matchingVideos.length > 0 ? matchingVideos : sec.videos };
      }
      return null;
    }).filter(Boolean);
  }, [sections, searchQuery]);

  // Default fallbacks for course details
  const courseThumbnail = courseDetails?.thumbnail?.url || courseDetails?.thumbnail || "https://via.placeholder.com/400x225?text=Course+Thumbnail";
  const courseName = courseDetails?.name || "Live Sessions Course";
  const instructorName = "Course Instructor"; // Often not directly on courseDetails object depending on backend
  
  const handleClearSearch = () => setSearchQuery("");

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-lg sticky top-20 max-h-[85vh] overflow-hidden font-sans">
      
      {/* 1. Course Header */}
      <div className="shrink-0">
        <div className="relative h-32 w-full overflow-hidden rounded-t-2xl">
          <img src={courseThumbnail} alt={courseName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-lg leading-tight line-clamp-1">{courseName}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-white/80 text-xs font-medium">
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalCourseVideos} Lessons</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDuration(totalDurationMins)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-[#020617] p-4 space-y-6 relative">
        
        {/* 2. Overall Progress Card */}
        <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-[#0F172A] dark:text-white font-bold text-sm mb-1">Course Progress</h3>
            <p className="text-[#64748B] text-xs font-medium">{totalCourseCompleted} / {totalCourseVideos} Lessons Completed</p>
            {overallProgress === 100 && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#ECFDF5] dark:bg-[#064E3B] text-[#10B981] rounded-md text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Completed
              </div>
            )}
          </div>
          <CircularProgress percentage={overallProgress} size={60} strokeWidth={5} />
        </div>

        {/* 3. Search Lesson */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all shadow-sm"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 4 & 5. Section Cards and Lesson Cards */}
        <div className="space-y-4">
          {filteredSections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#64748B] text-sm">No matching lessons found.</p>
            </div>
          ) : (
            filteredSections.map((sec, secIdx) => {
              const isExpanded = expandedSections[sec.name] !== false;
              
              return (
                <div key={secIdx} className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Section Header */}
                  <button 
                    onClick={() => toggleSection(sec.name)}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors text-left focus:outline-none focus:bg-[#F8FAFC] dark:focus:bg-[#1E293B]"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-bold text-[#0F172A] dark:text-white text-sm line-clamp-1">{sec.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] font-semibold text-[#64748B]">{sec.completedVideos} / {sec.totalVideos} Lessons</span>
                        <div className="w-16 h-1 bg-[#E2E8F0] dark:bg-[#334155] rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-[#10B981]" style={{ width: `${sec.completionPercentage}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-[#10B981]">{sec.completionPercentage}%</span>
                      </div>
                    </div>
                    <div className="text-[#9CA3AF] shrink-0 bg-[#F1F5F9] dark:bg-[#334155] p-1.5 rounded-full">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  {/* Lesson Cards */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B] border-t border-[#F1F5F9] dark:border-[#1E293B] bg-[#F8FAFC]/50 dark:bg-[#020617]/50 p-2 space-y-2">
                          {sec.videos.map((vid) => {
                            const isActive = activeVideo === vid.index;
                            const isVideoUnlocked = vid.isUnlocked !== false;
                            
                            // Determine status
                            let status = "upcoming";
                            let StatusIcon = PlayCircle;
                            let statusColorClass = "text-[#94A3B8]";
                            
                            if (!isVideoUnlocked) {
                              status = "locked";
                              StatusIcon = Lock;
                              statusColorClass = "text-[#CBD5E1] dark:text-[#475569]";
                            } else if (vid.isCompleted) {
                              status = "completed";
                              StatusIcon = CheckCircle2;
                              statusColorClass = "text-[#10B981]";
                            } else if (isActive) {
                              status = "current";
                              StatusIcon = PlayCircle;
                              statusColorClass = "text-[#3B82F6]";
                            }

                            return (
                              <button
                                key={vid._id}
                                disabled={!isVideoUnlocked}
                                onClick={() => {
                                  if (isVideoUnlocked) {
                                    setActiveVideo(vid.index);
                                    if (setSelectedRecordingUrl) setSelectedRecordingUrl(null);
                                    if (setSelectedRecordingTitle) setSelectedRecordingTitle(null);
                                  }
                                }}
                                className={`w-full relative group p-3 rounded-lg flex items-start gap-3 transition-all duration-200 text-left outline-none
                                  ${!isVideoUnlocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-white dark:hover:bg-[#0F172A] hover:shadow-sm hover:border-[#E2E8F0] dark:hover:border-[#334155] border border-transparent'}
                                  ${isActive ? 'bg-white dark:bg-[#0F172A] border-[#BFDBFE] dark:border-[#1E3A8A] shadow-sm' : ''}
                                `}
                              >
                                {/* Accent Border for Active */}
                                {isActive && (
                                  <motion.div 
                                    layoutId="activeLessonAccent" 
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6] rounded-l-lg" 
                                  />
                                )}

                                {/* Icon */}
                                <div className={`mt-0.5 shrink-0 ${statusColorClass} relative`}>
                                  <StatusIcon className={`w-5 h-5 ${status === 'current' ? 'fill-blue-50/50' : ''}`} />
                                  {status === 'current' && (
                                    <span className="absolute -inset-1 rounded-full border border-[#3B82F6] animate-ping opacity-50" />
                                  )}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <h5 className={`text-[13px] font-bold leading-snug line-clamp-2 pr-2
                                      ${status === 'current' ? 'text-[#1D4ED8] dark:text-[#60A5FA]' : 
                                        status === 'locked' ? 'text-[#94A3B8] dark:text-[#64748B]' : 'text-[#0F172A] dark:text-white'}`
                                    }>
                                      {vid.index + 1}. {vid.title}
                                    </h5>
                                    {vid.duration > 0 && (
                                      <span className="text-[10px] font-semibold text-[#94A3B8] shrink-0 whitespace-nowrap bg-[#F1F5F9] dark:bg-[#1E293B] px-1.5 py-0.5 rounded">
                                        {formatDuration(vid.duration)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {status === 'current' && (
                                      <span className="text-[10px] font-bold text-white bg-[#3B82F6] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Currently Watching
                                      </span>
                                    )}
                                    {status === 'completed' && (
                                      <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] dark:bg-[#064E3B] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Completed
                                      </span>
                                    )}
                                    {status === 'locked' && (
                                      <span className="text-[10px] font-bold text-[#EF4444] bg-[#FEF2F2] dark:bg-[#450A0A] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Complete previous lesson
                                      </span>
                                    )}
                                    
                                    {/* Simulated Watch Progress Bar (Aesthetic placeholder as requested for ALL lessons) */}
                                    {status !== 'locked' && (
                                      <div className="w-20 h-1.5 bg-[#E2E8F0] dark:bg-[#334155] rounded-full overflow-hidden flex items-center ml-auto">
                                        <div 
                                          className={`h-full rounded-full ${status === 'completed' ? 'bg-[#10B981] w-full' : status === 'current' ? 'bg-[#3B82F6] w-1/3' : 'bg-transparent w-0'}`} 
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* 6. Course Statistics */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white mb-4">Course Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-center">
              <p className="text-2xl font-black text-[#0F172A] dark:text-white">{totalCourseCompleted}</p>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Completed</p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-center">
              <p className="text-2xl font-black text-[#0F172A] dark:text-white">{totalCourseVideos - totalCourseCompleted}</p>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Remaining</p>
            </div>
            <div className="col-span-2 bg-gradient-to-r from-[#F8FAFC] to-white dark:from-[#1E293B] dark:to-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Certificate</p>
                <p className="text-sm font-bold text-[#0F172A] dark:text-white mt-0.5">
                  {overallProgress === 100 ? "Unlocked!" : "Locked"}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${overallProgress === 100 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F1F5F9] dark:bg-[#334155] text-[#94A3B8]'}`}>
                {overallProgress === 100 ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseSidebar;
