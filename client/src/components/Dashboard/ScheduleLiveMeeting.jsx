import React from 'react';
import { GlassPanel, NeonButton } from '../ui/NeonUI';
import { FaCalendarAlt, FaClock, FaVideo, FaChalkboardTeacher, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ScheduleLiveMeeting = ({ upcomingMeetings = [] }) => {
  const upcomingMeeting = upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;
  const isLiveNow = upcomingMeeting && upcomingMeeting.status === "live";

  return (
    <GlassPanel glow="border-t-2 border-t-[#00e676]" className="p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#00e676]/10 blur-[40px] pointer-events-none rounded-full group-hover:bg-[#00e676]/20 transition-all"></div>
      
      <div className="flex flex-col gap-4 mb-5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00e676]/20 flex items-center justify-center border border-[#00e676]/50 shadow-[0_0_15px_rgba(0,230,118,0.3)]">
              <FaBell className="text-[#00e676] animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Up Next Reminder</h3>
              <p className="text-xs text-[#00e676] font-medium">Your upcoming live sessions</p>
            </div>
          </div>
          {isLiveNow && (
            <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full border border-red-500/30 animate-pulse">
              LIVE NOW
            </span>
          )}
        </div>
      </div>

      {upcomingMeeting ? (
        <div className="flex flex-col flex-1 gap-4 bg-black/40 border border-white/5 p-4 rounded-xl relative z-10 hover:border-[#00e676]/30 transition-colors">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#00e676] font-bold block mb-1">
              {upcomingMeeting.courseName || "Academy Session"}
            </span>
            <h4 className="text-white font-bold text-sm mb-2">{upcomingMeeting.topic || upcomingMeeting.title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FaChalkboardTeacher className="text-blue-400" /> 
              {upcomingMeeting.instructorId ? (
                <Link to={`/instructor/${upcomingMeeting.instructorId}`} className="hover:text-blue-400 hover:underline transition-colors">
                  {upcomingMeeting.instructorName || "Academy Instructor"}
                </Link>
              ) : (
                <span>{upcomingMeeting.instructorName || "Academy Instructor"}</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
              <FaCalendarAlt className="text-blue-400 text-xs" />
              <span className="text-xs text-slate-300 font-medium">
                {new Date(upcomingMeeting.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
              <FaClock className="text-blue-400 text-xs" />
              <span className="text-xs text-slate-300 font-medium">
                {new Date(upcomingMeeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {upcomingMeeting.status === "completed" ? (
            <div className="text-center bg-white/5 text-slate-500 py-3 rounded-lg font-bold uppercase tracking-wider text-xs cursor-not-allowed border border-white/5 relative z-10 mt-2">
              Meeting Ended
            </div>
          ) : (
            <NeonButton 
              variant="secondary"
              className="w-full py-2.5 flex items-center justify-center gap-2 !border-[#00e676]/30 !text-[#00e676] hover:!bg-[#00e676]/10 hover:!border-[#00e676]/50 mt-2"
              onClick={() => window.open(upcomingMeeting.zoomLink || upcomingMeeting.link, '_blank')}
            >
              <FaVideo /> Join Meeting
            </NeonButton>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 h-full opacity-60 bg-black/20 rounded-xl border border-white/5">
          <FaBell className="text-4xl text-slate-600 mb-3" />
          <p className="text-sm text-slate-400 font-medium text-center px-4">You have no upcoming live meetings at this time.</p>
        </div>
      )}
    </GlassPanel>
  );
};

export default ScheduleLiveMeeting;
