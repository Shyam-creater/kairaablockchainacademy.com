import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../redux/features/orders/ordersApi";
import logoImage from "../carouselimages/footerLogo2.png";
import {
  FiHome, FiBook, FiBriefcase, FiCheckSquare,
  FiUsers, FiAward, FiTarget, FiSettings,
  FiBell, FiMessageSquare, FiTrendingUp,
  FiArrowRight, FiCheckCircle, FiPlayCircle,
  FiMoreHorizontal, FiPlus, FiGithub, FiExternalLink, FiStar,
  FiVideo, FiCalendar, FiSend, FiPaperclip, FiCircle, FiDownload, FiSearch,
  FiUpload, FiAlertCircle, FiLoader, FiArrowLeft, FiClock, FiFileText, FiHeart,
  FiFilter, FiBarChart2, FiActivity, FiX, FiXCircle, FiChevronRight, FiSliders, FiUser, FiMonitor, FiPlay
} from "react-icons/fi";
import CourseContent from "./Course/CourseContent";
import WorkspaceProjects from "./WorkspaceProjects";

import {
  useGetCourseAssignmentTasksQuery,
  useSubmitAssignmentMutation,
  useGetCourseContentQuery,
  useGetStudentDoubtsQuery,
  useCreateDoubtMutation,
  useStudentReplyDoubtMutation,
  useGetStudentAssignmentsQuery,
  useGetStudentMeetingsQuery,
  useMarkAttendanceMutation,
  useGetQuizForSectionQuery,
  useSubmitQuizMutation
} from "../redux/features/courses/coursesApi.js";
import { toast } from "react-hot-toast";
import StudentCertificatesPage from "../pages/Student/StudentCertificatesPage";
import { useGetCourseDetailsQuery, useGetUserAllCoursesQuery } from "../redux/features/courses/coursesApi.js";
import { useGetCoursesProgressSummaryQuery } from "../redux/features/student/studentApi.js";



export const WorkspaceHome = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
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
        } catch (e) { }
      }
    }
  }, [user?._id, courses]);

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
            if (lastWatched?.courseId) {
              if (lastWatched.recordingUrl) {
                localStorage.setItem('pendingRecording', JSON.stringify({ url: lastWatched.recordingUrl, title: lastWatched.videoTitle }));
              }
              setActiveCourseId(lastWatched.courseId);
              navigate('/profile/course-viewer');
            } else if (activeCourseId) {
              navigate('/profile/course-viewer');
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${event.type === 'Assignment' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
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
            {Array.from({ length: 7 }).map((_, rowIndex) => (
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

export const WorkspaceLearning = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();

  const [lastWatched, setLastWatched] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: myOrdersData } = useGetMyOrdersQuery(undefined, { skip: !user?._id });
  const myOrders = myOrdersData?.orders || [];
  
  const { data: progressSummaryData } = useGetCoursesProgressSummaryQuery(undefined, { skip: !user?._id });
  const progressMap = progressSummaryData?.progressMap || {};

 const handleDownloadInvoice = () => {
    if (!myOrders || myOrders.length === 0) return;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const latestOrder = myOrders[0];
    const transactionId = latestOrder?.payment_info?.id || "CONSOLIDATED";
    const currency = latestOrder?.payment_info?.currency || "INR";

    const totalAmount = myOrders.reduce((sum, order) => {
        const amt = order.payment_info?.amount ? (order.payment_info.amount / 100) : (order.course?.price || 0);
        return sum + Number(amt);
    }, 0);

    const subtotal = (totalAmount / 1.18).toFixed(2);
    const taxAmount = (totalAmount - subtotal).toFixed(2);

    const rowsHTML = myOrders.map((order) => {
      const amt = order.payment_info?.amount ? (order.payment_info.amount / 100).toFixed(2) : (order.course?.price || 0);
      const curr = order.payment_info?.currency || "INR";
      return `
        <tr>
          <td class="col-desc">
            <p class="item-name">${order.course?.name || "Course Purchase"}</p>
            <p class="item-sub">Transaction ID: ${order.payment_info?.id || order._id}</p>
          </td>
          <td class="col-date">${new Date(order.createdAt).toLocaleDateString()}</td>
          <td class="col-amount">${curr} ${amt}</td>
        </tr>
      `;
    }).join("");

    const absoluteLogoUrl = window.location.origin + logoImage;
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @page { size: A4; margin: 14mm; }
      * { box-sizing: border-box; }

      body {
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #1f2937;
        background: #fff;
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
      }

      .invoice-box {
        max-width: 780px;
        margin: 0 auto;
      }

      /* ---------- HEADER ---------- */
      .invoice-header {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        gap: 24px;
        border-bottom: 2px solid #3b82f6;
        padding-bottom: 18px;
        margin-bottom: 22px;
      }
      .invoice-title {
        font-size: 26px;
        font-weight: 800;
        color: #1e3a8a;
        letter-spacing: 0.5px;
        margin: 0 0 4px 0;
      }
      .invoice-subtitle {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        margin: 0;
      }
      .brand {
        text-align: right;
      }
      .logo-wrap {
        width: 130px;
        height: 56px;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .logo-wrap img {
        max-width: 130px;
        max-height: 56px;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
      }
      .fallback-text {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
        display: none;
      }
      .brand-address {
        font-size: 11px;
        color: #6b7280;
        margin-top: 8px;
        line-height: 1.6;
      }

      /* ---------- META / BILLED TO ---------- */
      .invoice-details {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 24px;
        margin-bottom: 24px;
      }
      .label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: #9ca3af;
        margin: 0 0 6px 0;
      }
      .billed-name {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 2px 0;
      }
      .billed-email {
        font-size: 12.5px;
        color: #6b7280;
        margin: 0;
      }
      .meta {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 10px;
        row-gap: 6px;
        text-align: right;
        font-size: 12.5px;
      }
      .meta .k {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: #9ca3af;
        align-self: center;
      }
      .meta .v {
        font-weight: 700;
        color: #1f2937;
      }
      .status-paid { color: #16a34a; }

      /* ---------- TABLE ---------- */
      .table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin-bottom: 20px;
      }
      .table th {
        background: #f8fafc;
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: #64748b;
        text-align: left;
        padding: 10px 12px;
        border-bottom: 2px solid #e2e8f0;
      }
      .table td {
        padding: 12px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
        font-size: 12.5px;
      }
      .col-desc { width: 54%; }
      .col-date { width: 23%; }
      .col-amount { width: 23%; }
      th.col-amount, td.col-amount { text-align: right; }
      .item-name { font-weight: 700; color: #1f2937; margin: 0; }
      .item-sub { font-size: 10.5px; color: #9ca3af; margin: 3px 0 0 0; }
      tr { page-break-inside: avoid; }

      /* ---------- SUMMARY ---------- */
      .bottom-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 28px;
      }
      .summary-box {
        width: 280px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px 18px;
        page-break-inside: avoid;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px dashed #cbd5e1;
        font-size: 12.5px;
        color: #4b5563;
      }
      .summary-row span:last-child { font-weight: 600; color: #1f2937; }
      .summary-row.total {
        border-bottom: none;
        border-top: 2px solid #94a3b8;
        margin-top: 6px;
        padding-top: 12px;
      }
      .summary-row.total span:first-child {
        font-size: 14px;
        font-weight: 700;
        color: #1f2937;
      }
      .summary-row.total span:last-child {
        font-size: 18px;
        font-weight: 800;
        color: #2563eb;
      }

      /* ---------- FOOTER ---------- */
      .footer {
        border-top: 1px solid #e2e8f0;
        padding-top: 16px;
        text-align: center;
        font-size: 11px;
        color: #9ca3af;
        line-height: 1.6;
      }
      .footer .fbold {
        font-weight: 700;
        color: #4b5563;
        font-size: 12px;
      }

      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(`
      <div class="invoice-box">

        <div class="invoice-header">
          <div>
            <h1 class="invoice-title">INVOICE</h1>
            <p class="invoice-subtitle">Receipt for your purchases</p>
          </div>
          <div class="brand">
            <div class="logo-wrap">
              <img src="${absoluteLogoUrl}" alt="Kairaa Academy Logo"
                onerror="this.parentElement.style.display='none'; document.getElementById('fallback-text').style.display='block';" />
            </div>
            <p id="fallback-text" class="fallback-text">Kairaa Academy</p>
            <p class="brand-address">
              131, 2nd floor, DB Road,<br/>
              RS Puram, Coimbatore - 641002<br/>
              +91 7092774077<br/>
              support@kairaaacademy.com
            </p>
          </div>
        </div>

        <div class="invoice-details">
          <div>
            <p class="label">Billed To</p>
            <p class="billed-name">${user?.name || ''}</p>
            <p class="billed-email">${user?.email || ''}</p>
          </div>
          <div class="meta">
            <span class="k">Invoice No</span>
            <span class="v">INV-${transactionId.substring(0, 8).toUpperCase()}</span>
            <span class="k">Date</span>
            <span class="v">${formattedDate}</span>
            <span class="k">Status</span>
            <span class="v status-paid">PAID IN FULL</span>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th class="col-desc">Description</th>
              <th class="col-date">Date</th>
              <th class="col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <div class="bottom-section">
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${currency} ${subtotal}</span>
            </div>
            <div class="summary-row">
              <span>Tax (GST 18%)</span>
              <span>${currency} ${taxAmount}</span>
            </div>
            <div class="summary-row total">
              <span>Total Paid</span>
              <span>${currency} ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p class="fbold">Thank you for learning with Kairaa Academy!</p>
          <p>This is a computer-generated document. No signature is required.</p>
          <p>If you have any questions concerning this invoice, please contact support@kairaaacademy.com.</p>
        </div>
      </div>
    `);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

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
        } catch (e) { }
      }
    }
  }, [user?._id, courses]);

  const handleContinue = () => {
    if (lastWatched?.courseId) {
      if (lastWatched.recordingUrl) {
        localStorage.setItem('pendingRecording', JSON.stringify({ url: lastWatched.recordingUrl, title: lastWatched.videoTitle }));
      }
      setActiveCourseId(lastWatched.courseId);
      navigate('/profile/course-viewer');
    } else if (currentCourse) {
      setActiveCourseId(currentCourse._id);
      navigate('/profile/course-viewer');
    }
  };

  // Calculate synthetic stats for the premium look (graceful fallbacks)
  const totalCourses = courses?.length || 0;
  const completedCourses = courses?.filter(c => c.progress >= 100)?.length || 0;
  const activeStreak = heatmap?.streak || 3;
  const avgProgress = totalCourses > 0 ? Math.round((courses.reduce((acc, c) => acc + (c.progress || 0), 0) / totalCourses)) : 0;

  const filteredCourses = (courses || []).filter(c => {
    if (searchQuery && !c.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'in_progress' && (c.progress >= 100 || !c.progress)) return false;
    if (activeFilter === 'completed' && c.progress !== 100) return false;
    return true;
  });

  const getProgressRing = (percentage, size = 44, stroke = 3) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="transparent" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#0F172A" strokeWidth={stroke} fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <span className="absolute text-[10px] font-bold text-[#0F172A]">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFA] font-sans overflow-hidden">

      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              My Learning
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiBook size={13} className="text-[#94A3B8]" />
                {courses?.length || 0} Enrolled Courses
              </div>
              {myOrders.length > 0 && (
                <>
                  <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
                  <button 
                    onClick={handleDownloadInvoice}
                    className="group flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap hover:text-[#0F172A] transition-colors bg-transparent border-none outline-none cursor-pointer"
                  >
                    <FiDownload size={13} className="text-[#94A3B8] group-hover:text-[#0F172A] transition-colors" />
                    Download Invoice
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 space-y-10 pb-20">

          {/* ── HERO RESUME CARD ── */}
          <div className="relative bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full filter blur-[100px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

            <div className="relative z-10 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 border border-blue-100">
                  <FiPlayCircle size={12} /> Resume Session
                </span>
              </div>
              <h2 className="text-[28px] md:text-[32px] font-black text-[#0F172A] leading-tight mb-2 tracking-tight">
                {lastWatched ? lastWatched.courseName : (currentCourse ? currentCourse.name : "Start your learning journey")}
              </h2>
              <p className="text-[15px] text-[#64748B] font-medium flex items-center gap-2 truncate max-w-xl">
                <FiVideo size={14} className="shrink-0" /> {lastWatched ? lastWatched.videoTitle : (currentCourse?.courseData?.[0]?.title || "Explore available courses")}
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex items-center gap-6">
              <button onClick={handleContinue} className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-[14px] font-bold shadow-lg hover:shadow-[0_8px_20px_-4px_rgb(15,23,42,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-3">
                Continue Watching <FiArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* ── KPI STRIP ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { label: "Enrolled Courses", value: totalCourses, icon: <FiBook size={18} strokeWidth={2.5} />, color: "text-slate-600", bg: "bg-slate-100", accent: "bg-slate-400", track: "bg-slate-100", ratio: 1 },
              { label: "Completed", value: completedCourses, icon: <FiAward size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: completedCourses / (totalCourses || 1) },
              { label: "Active Streak", value: `${activeStreak}`, icon: <FiTrendingUp size={18} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-100", accent: "bg-amber-500", track: "bg-amber-100", ratio: activeStreak / 7 },
              { label: "Avg. Progress", value: `${avgProgress}%`, icon: <FiTarget size={18} strokeWidth={2.5} />, color: "text-indigo-600", bg: "bg-indigo-100", accent: "bg-indigo-500", track: "bg-indigo-100", ratio: avgProgress / 100 },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{k.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${k.bg} ${k.color} group-hover:scale-105 transition-transform`}>
                    {k.icon}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{k.value}</h3>
                  </div>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div key={j} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${j < Math.round(Math.min(Math.max(k.ratio, 0), 1) * 12) ? k.accent : k.track}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── COURSE LIST SECTION ── */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Your Courses</h2>
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl w-fit">
                {[
                  { key: 'all', label: 'All Courses' },
                  { key: 'in_progress', label: 'In Progress' },
                  { key: 'completed', label: 'Completed' }
                ].map(f => (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)}
                    className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-all ${activeFilter === f.key ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#334155]'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => {
                const progress = progressMap[course._id] !== undefined ? progressMap[course._id] : (course.progress || 0);
                const totalLessons = course.courseData?.length || course.courseContentData?.length || 12;
                const completedLessons = Math.floor((progress / 100) * totalLessons);

                return (
                  <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col">
                    {/* Thumbnail */}
                    <div className="h-[180px] relative bg-[#F1F5F9] overflow-hidden cursor-pointer" onClick={() => { setActiveCourseId(course._id); navigate('/profile/course-viewer'); }}>
                      {course.thumbnail?.url ? (
                        <img src={course.thumbnail.url} alt={course.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <FiMonitor className="text-slate-300 text-5xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#0F172A]/10 group-hover:bg-[#0F172A]/30 transition-colors" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur text-[#0F172A] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{course.level || "Beginner"}</span>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <div className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-[#0F172A] pl-1"><FiPlay size={24} /></div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5"><FiUser size={12} /> {globalInstructorName}</span>
                          {progress === 100 && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1"><FiAward size={10} /> Certified</span>}
                        </div>
                        <h3 className="font-bold text-[#0F172A] text-[16px] leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => { setActiveCourseId(course._id); navigate('/profile/course-viewer'); }}>
                          {course.name}
                        </h3>
                      </div>



                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                        {getProgressRing(progress, 36, 3.5)}
                        <button onClick={() => { setActiveCourseId(course._id); navigate('/profile/course-viewer'); }}
                          className="text-[13px] font-bold text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                          {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Continue'} <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white border border-[#E2E8F0] rounded-3xl border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100"><FiMonitor size={32} /></div>
                  <p className="text-[18px] font-bold text-[#0F172A] mb-1">No courses found</p>
                  <p className="text-[14px] text-[#64748B] font-medium">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const getPercentage = (marks) => (marks && marks <= 10) ? marks * 10 : (marks || 0);

export const WorkspaceAssignments = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();

  const { data: tasksData, isLoading: isLoadingTasks } = useGetCourseAssignmentTasksQuery(activeCourseId, { skip: !activeCourseId });
  const assignmentTasks = tasksData?.tasks || [];

  const { data: submissionsData, isLoading: isLoadingSubmissions, refetch } = useGetStudentAssignmentsQuery(activeCourseId, { skip: !activeCourseId });
  const submissions = submissionsData?.assignments || [];

  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [file, setFile] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full px-6 bg-[#FAFAFA]">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-5 border border-[#E5E7EB]">
          <FiBriefcase size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Assignments Workspace</h2>
        <p className="text-[#6B7280] text-sm font-medium">Select a course from 'My Learning' to view your assignments.</p>
      </div>
    );
  }

  const submittedTitles = submissions.map(sub => sub.assignmentTitle);
  const pendingTasks = assignmentTasks.filter(task => !submittedTitles.includes(task.title));
  const totalXP = submissions.reduce((acc, sub) => acc + Math.floor(getPercentage(sub.marks) * 1.5), 0);

  const filteredPending = pendingTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSubmissions = submissions.filter(s => s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()));

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
      toast.error(typeof (error?.data?.message || "Failed to submit assignment") === "string" ? (error?.data?.message || "Failed to submit assignment") : JSON.stringify(error?.data?.message || "Failed to submit assignment") || "An error occurred");
    }
  };

  const getDifficulty = (title) => ['Beginner', 'Intermediate', 'Advanced'][title.length % 3];
  const getSkills = (title) => ['React', 'UI/UX', 'API Integration', 'Data Modeling', 'State Management'].slice(0, (title.length % 3) + 2);
  const getGrade = (marks) => {
    const p = getPercentage(marks);
    if (p >= 90) return 'A';
    if (p >= 80) return 'B';
    if (p >= 70) return 'C';
    return 'F';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">

      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Assignments
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {globalCourseName}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiUsers size={13} className="text-[#94A3B8]" />
                {globalInstructorName}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { label: "Total Assignments", value: assignmentTasks.length, icon: <FiBriefcase size={18} strokeWidth={2.5} />, color: "text-slate-600", bg: "bg-slate-100", accent: "bg-slate-400", track: "bg-slate-100", ratio: 1 },
              { label: "Completed", value: submissions.length, icon: <FiCheckCircle size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: submissions.length / (assignmentTasks.length || 1) },
              { label: "Pending", value: pendingTasks.length, icon: <FiClock size={18} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-100", accent: "bg-amber-500", track: "bg-amber-100", ratio: pendingTasks.length / (assignmentTasks.length || 1) },
              { label: "Total XP", value: totalXP, icon: <FiStar size={18} strokeWidth={2.5} />, color: "text-indigo-600", bg: "bg-indigo-100", accent: "bg-indigo-500", track: "bg-indigo-100", ratio: (totalXP % 500) / 500 }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                    {kpi.icon}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{kpi.value}</h3>
                  </div>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : kpi.track}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-b border-[#E2E8F0]">
            {['pending', 'evaluated'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-[14px] font-semibold capitalize transition-all flex items-center gap-2 ${activeTab === tab ? 'text-[#0F172A]' : 'text-[#64748B] hover:text-[#334155]'
                  }`}
              >
                {tab === 'pending' ? 'To Do' : 'Submissions'}
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                  {tab === 'pending' ? filteredPending.length : filteredSubmissions.length}
                </span>
                {activeTab === tab && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0F172A]" />
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pb-10"
          >

            {activeTab === 'pending' && (
              <div className="flex flex-col gap-5">
                {isLoadingTasks ? (
                  <div className="animate-pulse flex flex-col gap-5">
                    {[1, 2].map(i => <div key={i} className="h-[140px] bg-white border border-[#E2E8F0] rounded-2xl"></div>)}
                  </div>
                ) : filteredPending.length > 0 ? (
                  filteredPending.map((task, i) => (
                    <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 lg:p-8 hover:border-[#CBD5E1] shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-all duration-200 group flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between items-start lg:items-center">
                      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg lg:text-[19px] font-bold text-[#0F172A] leading-tight tracking-tight truncate">{task.title}</h3>
                          <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${getDifficulty(task.title) === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                              getDifficulty(task.title) === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                                'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                            }`}>{getDifficulty(task.title)}</span>
                        </div>

                        <p className="text-[14px] text-[#475569] leading-relaxed line-clamp-2 max-w-4xl break-words">
                          {task.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-5 text-[13px] font-semibold mt-1">
                          <div className="flex items-center gap-1.5 text-[#D97706] bg-[#FEF3C7]/50 px-2.5 py-1 rounded-lg border border-[#FDE68A]/60">
                            <FiClock className="text-sm" /> Due: {formatDateSafe(task.dueDate)}
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[#94A3B8] font-medium">Skills:</span>
                            <div className="flex flex-wrap gap-2">
                              {getSkills(task.title).map(skill => (
                                <span key={skill} className="bg-[#F8FAFC] text-[#475569] px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedTask(task); setFile(""); }}
                        className="w-full lg:w-auto bg-[#0F172A] text-white px-7 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#1E293B] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-[0_2px_4px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgb(0,0,0,0.12)] shrink-0 flex items-center justify-center gap-2"
                      >
                        <FiUpload className="text-base" /> Submit Work
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-emerald-100">
                      <FiCheckCircle size={36} />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-2 tracking-tight">You're all caught up!</h3>
                    <p className="text-[#64748B] text-[15px] max-w-md mx-auto leading-relaxed">You have completed all pending assignments for this course. Take a well-deserved break.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'evaluated' && (
              <div className="flex flex-col gap-6">
                {isLoadingSubmissions ? (
                  <div className="animate-pulse flex flex-col gap-6">
                    {[1, 2].map(i => <div key={i} className="h-[220px] bg-white border border-[#E2E8F0] rounded-3xl"></div>)}
                  </div>
                ) : filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub, i) => (
                    <div key={i} className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow duration-300 flex flex-col">

                      <div className="px-8 py-5 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between gap-4 md:items-center bg-gradient-to-b from-[#FAFAFA] to-white">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight">{sub.assignmentTitle}</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${sub.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                                sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                                  'bg-red-50 text-red-700 border-red-200/60'
                              }`}>
                              {sub.status === 'pending' && <FiClock className="text-sm" />}
                              {sub.status === 'approved' && <FiCheckCircle className="text-sm" />}
                              {sub.status === 'rejected' && <FiAlertCircle className="text-sm" />}
                              {sub.status}
                            </span>
                            <span className="text-[13px] text-[#64748B] font-medium flex items-center gap-1.5">
                              <FiCalendar className="text-[#94A3B8]" /> Submitted {formatDateSafe(sub.createdAt || new Date())}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <button className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#334155] bg-white border border-[#E2E8F0] px-5 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors shadow-sm w-full md:w-auto">
                            <FiDownload className="text-base" /> Download File
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">

                        <div className="flex flex-col items-center justify-center p-8 bg-[#FAFAFA]">
                          {sub.status === 'pending' ? (
                            <>
                              <div className="w-24 h-24 rounded-full border-[6px] border-amber-100 flex items-center justify-center mb-5 bg-white shadow-sm">
                                <FiActivity className="text-amber-500 text-3xl animate-pulse" />
                              </div>
                              <h4 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Under Review</h4>
                              <p className="text-[13px] text-[#64748B] mt-1.5 text-center">Your mentor is evaluating your work.</p>
                            </>
                          ) : (
                            <>
                              <div className="relative w-[110px] h-[110px] mb-5">
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                                  <circle
                                    cx="50" cy="50" r="42"
                                    stroke={getPercentage(sub.marks) >= 70 ? "#10B981" : "#EF4444"}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray="263.89"
                                    strokeDashoffset={263.89 - (263.89 * getPercentage(sub.marks)) / 100}
                                    className="transition-all duration-1000 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none">{sub.marks || 0}</span>
                                </div>
                                <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] text-white shadow-md ring-2 ring-white ${getPercentage(sub.marks) >= 90 ? 'bg-indigo-500' :
                                    getPercentage(sub.marks) >= 80 ? 'bg-blue-500' :
                                      getPercentage(sub.marks) >= 70 ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}>
                                  {getGrade(sub.marks || 0)}
                                </div>
                              </div>
                              <h4 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Evaluation Complete</h4>
                              <div className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-700 mt-2.5 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
                                <FiStar className="text-sm" /> +{Math.floor(getPercentage(sub.marks) * 1.5)} XP
                              </div>
                            </>
                          )}
                        </div>

                        <div className="p-8 flex flex-col gap-8 bg-white">

                          <div>
                            <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-5 flex items-center gap-2">
                              <FiActivity /> Status Timeline
                            </h4>
                            <div className="relative pl-6 border-l-2 border-[#E2E8F0] flex flex-col gap-7">
                              <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-[#3B82F6] rounded-full ring-[6px] ring-white shadow-sm" />
                                <h5 className="text-[14px] font-bold text-[#0F172A] leading-none mb-1.5">Work Submitted</h5>
                                <p className="text-[13px] text-[#64748B]">{formatDateSafe(sub.createdAt || new Date())}</p>
                              </div>
                              {sub.status !== 'pending' && (
                                <div className="relative">
                                  <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ring-[6px] ring-white shadow-sm ${sub.status === 'approved' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                                  <h5 className="text-[14px] font-bold text-[#0F172A] leading-none mb-1.5">Evaluated by Mentor</h5>
                                  <p className="text-[13px] text-[#64748B]">On {formatDateSafe(sub.updatedAt || sub.createdAt)}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {sub.feedback && (
                            <div className="pt-2">
                              <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                                <FiMessageSquare /> Mentor Feedback
                              </h4>
                              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl relative group hover:border-[#CBD5E1] transition-colors">
                                <FiMessageSquare className="absolute top-5 right-5 text-[#CBD5E1] text-2xl group-hover:text-[#94A3B8] transition-colors" />
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-sm">M</div>
                                  <span className="text-[14px] font-bold text-[#0F172A]">Mentor</span>
                                </div>
                                <p className="text-[14px] text-[#334155] leading-relaxed relative z-10 pl-1">
                                  "{sub.feedback}"
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-6 shadow-sm border border-[#E2E8F0]">
                      <FiFileText size={36} />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-2 tracking-tight">No Submissions Yet</h3>
                    <p className="text-[#64748B] text-[15px] max-w-md mx-auto leading-relaxed">You haven't submitted any assignments for this course. Switch to the 'To Do' tab to get started.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.97, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-[24px] w-full max-w-2xl shadow-[0_20px_25px_-5px_rgb(0,0,0,0.1),0_8px_10px_-6px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] border border-[#E2E8F0]"
              >
                <div className="px-8 py-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
                  <h2 className="text-[18px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                    <FiUpload className="text-[#64748B]" /> Submit Assignment
                  </h2>
                  <button
                    onClick={() => { setSelectedTask(null); setFile(""); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto bg-[#FAFAFA]">
                  <div className="mb-8">
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight leading-tight">{selectedTask.title}</h3>
                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] text-[14px] text-[#475569] leading-relaxed shadow-sm break-words">
                      {selectedTask.description}
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                      <FiPaperclip className="text-[#64748B]" /> Attach File
                    </h4>
                    <div className={`relative border-[2px] border-dashed rounded-[20px] transition-all p-12 flex flex-col items-center justify-center text-center cursor-pointer group ${file
                        ? 'border-[#3B82F6] bg-[#EFF6FF]'
                        : 'border-[#CBD5E1] hover:border-[#0F172A] bg-white'
                      }`}>
                      <input type="file" accept=".pdf,.doc,.docx,.zip,.rar" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-all duration-300 ${file
                          ? 'bg-[#3B82F6] text-white shadow-[0_8px_16px_rgb(59,130,246,0.25)] scale-110'
                          : 'bg-[#F8FAFC] shadow-sm border border-[#E2E8F0] text-[#94A3B8] group-hover:text-[#0F172A] group-hover:scale-110'
                        }`}>
                        {file ? <FiCheckCircle size={28} /> : <FiUpload size={28} />}
                      </div>

                      <p className={`font-bold text-[16px] mb-1.5 transition-colors ${file ? 'text-[#1D4ED8]' : 'text-[#0F172A]'}`}>
                        {file ? "File Attached Successfully" : "Click to upload or drag & drop"}
                      </p>
                      <p className={`text-[13px] font-medium transition-colors ${file ? 'text-[#3B82F6]' : 'text-[#64748B]'}`}>
                        {file ? file.name : "Supported formats: PDF, DOCX, ZIP (Max 50MB)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:px-8 border-t border-[#E2E8F0] bg-white flex flex-col-reverse md:flex-row items-stretch md:items-center justify-end gap-3 shrink-0">
                  <button
                    onClick={() => { setSelectedTask(null); setFile(""); }}
                    className="py-3 px-6 rounded-xl text-[14px] font-bold bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors w-full md:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !file}
                    className={`py-3 px-8 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto min-w-[200px] ${file
                        ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-[0_2px_4px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgb(0,0,0,0.15)] hover:-translate-y-0.5'
                        : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]'
                      }`}
                  >
                    {isSubmitting ? <FiLoader className="animate-spin text-lg" /> : <FiSend className="text-lg" />}
                    {isSubmitting ? "Submitting Work..." : "Submit Assignment"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
export const WorkspaceResources = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
  const { data, isLoading } = useGetStudentMeetingsQuery(activeCourseId, { skip: !activeCourseId });
  const meetings = data?.meetings || [];
  const [activeRecording, setActiveRecording] = useState(null);
  const [activeTab, setActiveTab] = useState('recordings');

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

  const recordingSessions = completedMeetings.filter(m => m.recordingUrl);
  const allMaterials = completedMeetings.flatMap(m =>
    (m.materials || []).map(doc => ({ ...doc, sessionTitle: m.topic || 'Live Session', sessionDate: m.date }))
  );

  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#FAFAFA] font-sans">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-5 border border-[#E5E7EB]"><FiPaperclip size={28} /></div>
        <h2 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Resources & Recordings</h2>
        <p className="text-[#6B7280] text-sm font-medium max-w-xs">Select a course from 'My Learning' to access session materials.</p>
      </div>
    );
  }

  const fileIcon = (name = '') => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return { icon: 'PDF', bg: 'bg-red-50 text-red-600 border-red-200' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'DOC', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (['ppt', 'pptx'].includes(ext)) return { icon: 'PPT', bg: 'bg-orange-50 text-orange-600 border-orange-200' };
    if (['xls', 'xlsx'].includes(ext)) return { icon: 'XLS', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (['mp4', 'mkv', 'mov'].includes(ext)) return { icon: 'VID', bg: 'bg-violet-50 text-violet-700 border-violet-200' };
    if (['zip', 'rar'].includes(ext)) return { icon: 'ZIP', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    return { icon: 'FILE', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans">

      {/* STICKY HEADER */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">Resources</h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">{globalCourseName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <span className="text-[12px] font-semibold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200">{recordingSessions.length} Recordings</span>
            <span className="text-[12px] font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">{allMaterials.length} Materials</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 space-y-8 pb-16">

          {/* KPI CARDS — 3 cards, no instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {[
              { label: "Sessions", value: completedMeetings.length, icon: <FiVideo size={18} strokeWidth={2.5} />, color: "text-slate-600", bg: "bg-slate-100", accent: "bg-slate-400", ratio: 1 },
              { label: "Recordings", value: recordingSessions.length, icon: <FiPlayCircle size={18} strokeWidth={2.5} />, color: "text-violet-600", bg: "bg-violet-100", accent: "bg-violet-500", ratio: recordingSessions.length / (completedMeetings.length || 1) },
              { label: "Materials", value: allMaterials.length, icon: <FiFileText size={18} strokeWidth={2.5} />, color: "text-blue-600", bg: "bg-blue-100", accent: "bg-blue-500", ratio: Math.min(allMaterials.length / 10, 1) },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>{kpi.icon}</div>
                  <span className="text-[28px] font-black text-[#0F172A] tracking-tight leading-none">{kpi.value}</span>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-[4px] flex-1 rounded-[1px] ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2 border-b border-[#E2E8F0]">
            {[
              { key: 'recordings', label: 'Recordings', icon: <FiPlayCircle size={13} />, count: recordingSessions.length },
              { key: 'materials', label: 'Materials', icon: <FiFileText size={13} />, count: allMaterials.length },
              { key: 'sessions', label: 'All Sessions', icon: <FiVideo size={13} />, count: completedMeetings.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-[14px] font-semibold transition-all ${activeTab === tab.key ? 'text-[#0F172A]' : 'text-[#64748B] hover:text-[#334155]'}`}>
                {tab.icon} {tab.label}
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{tab.count}</span>
                {activeTab === tab.key && (
                  <motion.div layoutId="resourceTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0F172A]" />
                )}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          {isLoading ? (
            <div className="flex flex-col gap-5 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-[120px] bg-white border border-[#E2E8F0] rounded-2xl" />)}
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >

              {/* ── RECORDINGS TAB ── */}
              {activeTab === 'recordings' && (
                <div className="flex flex-col gap-5">
                  {recordingSessions.length > 0 ? recordingSessions.map((meeting, idx) => (
                    <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 group flex flex-col lg:flex-row">
                      <div className="lg:w-[180px] shrink-0 bg-gradient-to-br from-[#1E1B4B] to-[#4C1D95] flex items-center justify-center p-8 relative min-h-[100px]">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <FiPlayCircle size={24} className="text-white" />
                        </div>
                        <div className="absolute top-3 right-3 bg-violet-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest">REC</div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                        <div>
                          <h3 className="text-[16px] font-bold text-[#0F172A] mb-2 leading-snug">{meeting.topic || 'Live Session Recording'}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#64748B]">
                            <span className="flex items-center gap-1.5"><FiCalendar size={11} className="text-[#94A3B8]" />{formatDateSafe(meeting.date)}</span>
                            <span className="flex items-center gap-1.5"><FiUser size={11} className="text-[#94A3B8]" />{globalInstructorName}</span>
                            {meeting.materials?.length > 0 && (
                              <span className="flex items-center gap-1.5"><FiFileText size={11} className="text-[#94A3B8]" />{meeting.materials.length} file{meeting.materials.length !== 1 ? 's' : ''} attached</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              localStorage.setItem('pendingRecording', JSON.stringify({ url: meeting.recordingUrl, title: `Recording: ${meeting.topic || 'Live Session'}` }));
                              setActiveCourseId(activeCourseId);
                              navigate('/profile/course-viewer');
                            }}
                            className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#1E293B] transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md w-fit">
                            <FiPlayCircle size={14} /> Watch Recording
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-300 mb-6 border border-violet-100"><FiPlayCircle size={36} /></div>
                      <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">No Recordings Yet</h3>
                      <p className="text-[#64748B] text-[15px] max-w-sm">Session recordings will appear here after each live class.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── MATERIALS TAB ── */}
              {activeTab === 'materials' && (
                <div>
                  {allMaterials.length > 0 ? (
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.02)]">
                      {/* Table header */}
                      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <span className="w-10" />
                        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">File</span>
                        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest hidden md:block text-center px-6">Session</span>
                        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Action</span>
                      </div>
                      {/* Rows */}
                      {allMaterials.map((doc, i) => {
                        const { icon, bg } = fileIcon(doc.name);
                        return (
                          <a key={i} href={doc.url || '#'} target="_blank" rel="noreferrer"
                            className="grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors group gap-4">
                            {/* Icon */}
                            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[10px] font-black shrink-0 ${bg}`}>{icon}</div>
                            {/* Name */}
                            <div className="min-w-0">
                              <p className="text-[14px] font-semibold text-[#0F172A] truncate group-hover:text-[#3B82F6] transition-colors" title={doc.name}>{doc.name || 'Document'}</p>
                              <p className="text-[12px] text-[#94A3B8] mt-0.5 md:hidden truncate">{doc.sessionTitle} · {formatDateSafe(doc.sessionDate)}</p>
                            </div>
                            {/* Session */}
                            <div className="hidden md:flex flex-col items-center px-6 min-w-0 max-w-[200px]">
                              <p className="text-[12px] font-semibold text-[#475569] truncate w-full text-center">{doc.sessionTitle}</p>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">{formatDateSafe(doc.sessionDate)}</p>
                            </div>
                            {/* Download btn */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 rounded-lg group-hover:bg-[#0F172A] group-hover:text-white group-hover:border-[#0F172A] transition-all">
                                <FiDownload size={12} /> Download
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-300 mb-6 border border-blue-100"><FiFileText size={36} /></div>
                      <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">No Materials Yet</h3>
                      <p className="text-[#64748B] text-[15px] max-w-sm">Slides, notes and resources will appear here after each session.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── ALL SESSIONS TAB ── */}
              {activeTab === 'sessions' && (
                <div className="flex flex-col gap-6">
                  {completedMeetings.length > 0 ? completedMeetings.map((meeting, idx) => (
                    <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow">
                      <div className="px-7 py-4 border-b border-[#F1F5F9] bg-gradient-to-b from-[#FAFAFA] to-white flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center shrink-0"><FiVideo size={14} className="text-white" /></div>
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-bold text-[#0F172A] leading-none truncate">{meeting.topic || 'Live Session'}</h3>
                            <p className="text-[12px] text-[#64748B] font-medium mt-0.5 flex items-center gap-1.5"><FiCalendar size={10} />{formatDateSafe(meeting.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {meeting.recordingUrl && <span className="text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-md flex items-center gap-1"><FiPlayCircle size={10} />Recording</span>}
                          {meeting.materials?.length > 0 && <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1"><FiFileText size={10} />{meeting.materials.length} files</span>}
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meeting.recordingUrl && (
                          <button
                            onClick={() => {
                              localStorage.setItem('pendingRecording', JSON.stringify({ url: meeting.recordingUrl, title: `Recording: ${meeting.topic || 'Live Session'}` }));
                              setActiveCourseId(activeCourseId);
                              navigate('/profile/course-viewer');
                            }}
                            className="text-left flex items-center gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] hover:border-violet-400 hover:bg-violet-50 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors"><FiPlayCircle size={18} /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-[#0F172A] truncate">Session Recording</p>
                              <p className="text-[11px] font-semibold text-violet-600 mt-0.5">▶ Watch in Player</p>
                            </div>
                          </button>
                        )}
                        {(meeting.materials || []).map((doc, i) => {
                          const { icon, bg } = fileIcon(doc.name);
                          return (
                            <a key={i} href={doc.url || '#'} target="_blank" rel="noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] hover:border-[#0F172A] hover:bg-white transition-all group">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black border shrink-0 ${bg} group-hover:scale-105 transition-transform`}>{icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-[#0F172A] truncate" title={doc.name}>{doc.name || 'Document'}</p>
                                <p className="text-[11px] font-semibold text-blue-600 mt-0.5 flex items-center gap-1"><FiDownload size={10} /> Download</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )) : (
                    <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-6 border border-[#E2E8F0]"><FiVideo size={36} /></div>
                      <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">No Sessions Yet</h3>
                      <p className="text-[#64748B] text-[15px] max-w-md">Recordings and materials will appear here after live sessions are completed.</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export const WorkspaceLiveMeetings = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
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
    } catch (e) { }
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
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Live Learning Hub
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {globalCourseName || "Your Course"}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiUsers size={13} className="text-[#94A3B8]" />
                {globalInstructorName || "Instructor"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-8 pb-16">
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

            {/* ── KPI STRIP ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {[
                { label: "Total Sessions", value: meetings.length, icon: <FiVideo size={18} strokeWidth={2.5} />, color: "text-blue-600", bg: "bg-blue-100", accent: "bg-blue-500", track: "bg-blue-100", ratio: 1 },
                { label: "Upcoming", value: upcomingMeetings.length, icon: <FiAlertCircle size={18} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-100", accent: "bg-amber-500", track: "bg-amber-100", ratio: meetings.length > 0 ? upcomingMeetings.length / meetings.length : 0 },
                { label: "Completed", value: completedMeetings.length, icon: <FiCheckCircle size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: meetings.length > 0 ? completedMeetings.length / meetings.length : 0 }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                  <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                      {kpi.icon}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{kpi.value}</h3>
                    </div>
                  </div>
                  <div className="flex gap-[3px] mt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : kpi.track}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Meetings List */}
            <div>
              {/* Tabs */}
              <div className="flex gap-8 border-b border-slate-200 mb-8">
                {['upcoming', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 -mb-[2px] ${activeTab === tab
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
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEnded ? 'bg-slate-100' : 'bg-blue-100'
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
                                  <button
                                    onClick={() => {
                                      localStorage.setItem('pendingRecording', JSON.stringify({ url: meeting.recordingUrl, title: `Recording: ${meeting.topic || 'Live Session'}` }));
                                      setActiveCourseId(activeCourseId);
                                      navigate('/profile/course-viewer');
                                    }}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                                  >
                                    <FiPlayCircle size={16} />
                                    Recording
                                  </button>
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
    </div>
  );
};

export const WorkspaceAskDoubt = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
  const { data: doubtsData, isLoading, refetch } = useGetStudentDoubtsQuery(activeCourseId, { skip: !activeCourseId });
  const { data: courseDetails } = useGetCourseDetailsQuery(activeCourseId, { skip: !activeCourseId });
  const instructorName = courseDetails?.course?.author || courseDetails?.course?.instructorName || "Instructor";
  const doubts = doubtsData?.doubts || [];

  const [activeDoubt, setActiveDoubt] = useState(null);
  const [newDoubtTitle, setNewDoubtTitle] = useState("");
  const [newDoubtDesc, setNewDoubtDesc] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [createDoubt, { isLoading: isCreating }] = useCreateDoubtMutation();
  const [replyDoubt, { isLoading: isReplying }] = useStudentReplyDoubtMutation();

  const handleCreate = async () => {
    if (!newDoubtTitle || !newDoubtDesc) return toast.error("Please fill in all fields");
    try {
      await createDoubt({ courseId: activeCourseId, title: newDoubtTitle, description: newDoubtDesc }).unwrap();
      toast.success("Discussion started!");
      setNewDoubtTitle(""); setNewDoubtDesc(""); setIsCreatingNew(false);
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

  const openCount = doubts.filter(d => d.status === 'open').length;
  const answeredCount = doubts.filter(d => (d.replies || []).some(r => r.sender !== 'student')).length;

  const filteredDoubts = doubts.filter(d => {
    if (activeFilter === 'open') return d.status === 'open';
    if (activeFilter === 'answered') return (d.replies || []).some(r => r.sender !== 'student');
    if (activeFilter === 'closed') return d.status !== 'open';
    return true;
  });

  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#FAFAFA] font-sans">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-5 border border-[#E5E7EB]"><FiMessageSquare size={28} /></div>
        <h2 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Discussion Forum</h2>
        <p className="text-[#6B7280] text-sm font-medium max-w-xs">Select a course from 'My Learning' to view and post discussions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans">

      {/* STICKY HEADER */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">Discussions</h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">{globalCourseName}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex text-[12px] font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">{openCount} Open</span>
            <span className="hidden sm:flex text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">{answeredCount} Answered</span>
            <button
              onClick={() => { setIsCreatingNew(true); setActiveDoubt(null); }}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-[#1E293B] transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md">
              <FiPlus size={14} /> New Discussion
            </button>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <div className="w-[290px] xl:w-[310px] bg-white border-r border-[#E5E7EB] hidden md:flex flex-col h-full shrink-0">
          {/* Mini KPI strip */}
          <div className="grid grid-cols-3 gap-px bg-[#F1F5F9] border-b border-[#E5E7EB]">
            {[
              { label: "Total", value: doubts.length, color: "text-[#0F172A]" },
              { label: "Open", value: openCount, color: "text-amber-600" },
              { label: "Answered", value: answeredCount, color: "text-emerald-600" },
            ].map((k, i) => (
              <div key={i} className="bg-white px-3 py-3">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{k.label}</p>
                <p className={`text-[18px] font-black ${k.color} leading-tight tabular-nums`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 px-3 pt-3 pb-2 flex-wrap border-b border-[#F1F5F9]">
            {[
              { key: 'all', label: 'All' },
              { key: 'open', label: 'Open' },
              { key: 'answered', label: 'Answered' },
              { key: 'closed', label: 'Closed' },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === f.key ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F8FAFC]">
            {isLoading ? (
              <div className="p-4 flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-4/5" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredDoubts.length > 0 ? (
              filteredDoubts.map(d => {
                const isActive = activeDoubt?._id === d._id;
                const isAnswered = (d.replies || []).some(r => r.sender !== 'student');
                return (
                  <button key={d._id}
                    onClick={() => { setActiveDoubt(d); setIsCreatingNew(false); }}
                    className={`w-full text-left px-4 py-4 transition-all relative ${isActive ? 'bg-blue-50/50' : 'hover:bg-[#F8FAFC]'}`}>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600" />}
                    <div className="flex items-center gap-2 mb-1.5 pl-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isAnswered ? 'bg-emerald-500' : d.status === 'open' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <span className={`text-[10px] font-bold flex-1 ${isAnswered ? 'text-emerald-600' : d.status === 'open' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {isAnswered ? 'Answered' : d.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                      <span className={`text-[10px] ${isActive ? 'text-blue-600 font-semibold' : 'text-[#94A3B8]'}`}>{formatDateSafe(d.createdAt)}</span>
                    </div>
                    <p className={`text-[13px] font-bold leading-snug line-clamp-2 mb-2 pl-1 ${isActive ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>{d.title}</p>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 pl-1 ${isActive ? 'text-blue-600' : 'text-[#94A3B8]'}`}>
                      <FiMessageSquare size={10} />{d.replies?.length || 0} replies
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <FiMessageSquare size={28} className="text-slate-200 mb-3" />
                <p className="text-[13px] font-semibold text-slate-400">No discussions found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* NEW DISCUSSION FORM */}
          {isCreatingNew ? (
            <div className="flex flex-col h-full bg-white">
              <div className="px-8 py-6 border-b border-[#E2E8F0] bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0F172A] text-white rounded-xl flex items-center justify-center shrink-0"><FiMessageSquare size={16} /></div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Start a Discussion</h2>
                    <p className="text-[13px] text-[#64748B]">Get help from your mentor and peers</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl flex flex-col gap-6">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex gap-3">
                    <FiAlertCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0F172A] mb-1">Tips for a great question</p>
                      <ul className="text-[12px] text-[#64748B] space-y-0.5 list-disc list-inside">
                        <li>Be specific about what you're stuck on</li>
                        <li>Include error messages or code snippets</li>
                        <li>Mention what you've already tried</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#334155] mb-2">Question Title <span className="text-rose-500">*</span></label>
                    <input type="text" value={newDoubtTitle} onChange={e => setNewDoubtTitle(e.target.value)}
                      placeholder="e.g. How does the ERC20 transfer function work?"
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] focus:bg-white rounded-xl text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#334155] mb-2">Detailed Description <span className="text-rose-500">*</span></label>
                    <textarea value={newDoubtDesc} onChange={e => setNewDoubtDesc(e.target.value)}
                      placeholder="Describe your question in detail. Include code snippets, error messages, or exactly what you're stuck on..."
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] focus:bg-white rounded-xl text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all resize-none min-h-[200px] leading-relaxed" />
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-[#E2E8F0] bg-white flex items-center justify-end gap-3 shrink-0">
                <button onClick={() => setIsCreatingNew(false)}
                  className="px-5 py-2.5 text-[13px] font-bold text-[#475569] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={isCreating || !newDoubtTitle.trim() || !newDoubtDesc.trim()}
                  className={`px-7 py-2.5 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2 ${newDoubtTitle.trim() && newDoubtDesc.trim()
                      ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm hover:shadow-md hover:-translate-y-0.5'
                      : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                    }`}>
                  {isCreating ? <FiLoader size={14} className="animate-spin" /> : <FiSend size={14} />}
                  {isCreating ? 'Posting...' : 'Post Discussion'}
                </button>
              </div>
            </div>

          ) : activeDoubt ? (
            /* ACTIVE DISCUSSION VIEW */
            <div className="flex flex-col h-full bg-[#F8FAFC]">
              {/* Discussion sticky header */}
              <div className="bg-white border-b border-[#E2E8F0] px-8 py-5 shrink-0 shadow-[0_1px_3px_0_rgb(0,0,0,0.02)]">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-[17px] font-bold text-[#0F172A] leading-snug tracking-tight flex-1">{activeDoubt.title}</h2>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${(activeDoubt.replies || []).some(r => r.sender !== 'student')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : activeDoubt.status === 'open'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(activeDoubt.replies || []).some(r => r.sender !== 'student') ? 'bg-emerald-500' : activeDoubt.status === 'open' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    {(activeDoubt.replies || []).some(r => r.sender !== 'student') ? 'Answered' : activeDoubt.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-[9px] font-black">{user?.name?.charAt(0) || 'S'}</div>
                    {user?.name || 'You'}
                  </span>
                  <span className="flex items-center gap-1.5"><FiCalendar size={11} className="text-[#94A3B8]" />{formatDateSafe(activeDoubt.createdAt)}</span>
                  <span className="flex items-center gap-1.5"><FiMessageSquare size={11} className="text-[#94A3B8]" />{activeDoubt.replies?.length || 0} replies</span>
                </div>
              </div>

              {/* Thread scroll area */}
              <div className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">

                {/* Original question card */}
                <div className="flex gap-4">
                  <div className="w-9 h-9 bg-[#0F172A] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0">{user?.name?.charAt(0) || 'S'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-bold text-[#0F172A]">{user?.name || 'You'}</span>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">Author</span>
                      <span className="text-[11px] text-[#94A3B8]">{formatDateSafe(activeDoubt.createdAt)}</span>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl px-6 py-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.03)]">
                      <p className="text-[14px] text-[#334155] leading-relaxed whitespace-pre-wrap">{activeDoubt.description}</p>
                    </div>
                  </div>
                </div>

                {/* Replies count divider */}
                {activeDoubt.replies?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-[#E2E8F0]" />
                    <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-2">{activeDoubt.replies.length} {activeDoubt.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                    <div className="flex-1 border-t border-[#E2E8F0]" />
                  </div>
                )}

                {/* Reply bubbles */}
                {activeDoubt.replies?.map((r, i) => {
                  const isMentor = r.sender !== 'student';
                  const initials = isMentor ? instructorName.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'S');
                  return (
                    <div key={i} className="flex gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${isMentor ? 'bg-[#6366F1] text-white' : 'bg-[#0F172A] text-white'}`}>{initials}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[13px] font-bold text-[#0F172A]">{isMentor ? instructorName : (user?.name || 'You')}</span>
                          {isMentor && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1"><FiAward size={9} /> Mentor</span>
                          )}
                          <span className="text-[11px] text-[#94A3B8]">{formatTimeSafe(r.timestamp)}</span>
                        </div>
                        <div className={`rounded-2xl px-6 py-5 shadow-[0_1px_3px_0_rgb(0,0,0,0.03)] ${isMentor ? 'bg-white border border-[#E2E8F0]' : 'bg-[#0F172A]'}`}>
                          <p className={`text-[14px] leading-relaxed whitespace-pre-wrap ${isMentor ? 'text-[#334155]' : 'text-white'}`}>{r.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply composer */}
              <div className="bg-white border-t border-[#E2E8F0] px-8 py-5 shrink-0">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-1">{user?.name?.charAt(0) || 'S'}</div>
                    <textarea rows={3} value={replyMessage} onChange={e => setReplyMessage(e.target.value)}
                      placeholder="Write a reply... (Enter to send, Shift+Enter for new line)"
                      className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] focus:bg-white rounded-xl px-4 py-3 text-[13px] text-[#0F172A] placeholder-[#94A3B8] font-medium resize-none focus:outline-none transition-all leading-relaxed"
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                    />
                  </div>
                  <div className="flex justify-end pl-11">
                    <button onClick={handleReply} disabled={isReplying || !replyMessage.trim()}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${replyMessage.trim()
                          ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm hover:shadow-md hover:-translate-y-0.5'
                          : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                        }`}>
                      {isReplying ? <FiLoader size={13} className="animate-spin" /> : <FiSend size={13} />}
                      {isReplying ? 'Sending...' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          ) : (
            /* EMPTY STATE with KPIs + recent list */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[820px] mx-auto px-6 md:px-10 py-8 space-y-8 pb-16">


                {/* Recent discussions list or empty */}
                {doubts.length > 0 ? (
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgb(0,0,0,0.02)]">
                    <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#0F172A]">Recent Discussions</p>
                      <span className="text-[12px] text-[#94A3B8] font-medium">{doubts.length} total</span>
                    </div>
                    {doubts.slice(0, 8).map((d, i) => {
                      const isAnswered = (d.replies || []).some(r => r.sender !== 'student');
                      return (
                        <button key={i} onClick={() => setActiveDoubt(d)}
                          className="w-full text-left px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors group flex items-start gap-4">
                          <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isAnswered ? 'bg-emerald-500' : d.status === 'open' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors line-clamp-1 mb-1">{d.title}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#94A3B8] font-medium">
                              <span>{formatDateSafe(d.createdAt)}</span>
                              <span className="flex items-center gap-1"><FiMessageSquare size={10} />{d.replies?.length || 0} replies</span>
                              {isAnswered && <span className="text-emerald-600 font-bold">✓ Answered</span>}
                            </div>
                          </div>
                          <FiChevronRight size={14} className="text-[#CBD5E1] group-hover:text-[#0F172A] transition-colors shrink-0 mt-1" />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#CBD5E1] mb-6 border border-[#E2E8F0]"><FiMessageSquare size={36} /></div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">No Discussions Yet</h3>
                    <p className="text-[#64748B] text-[15px] max-w-md mb-6">Be the first to ask a question. Your mentor is here to help.</p>
                    <button onClick={() => setIsCreatingNew(true)}
                      className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl text-[14px] font-bold hover:bg-[#1E293B] transition-all shadow-sm hover:-translate-y-0.5">
                      <FiPlus size={16} /> Start a Discussion
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const WorkspaceQuiz = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
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
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Knowledge Check
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {globalCourseName || "Your Course"}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiUsers size={13} className="text-[#94A3B8]" />
                {globalInstructorName || "Instructor"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-8 pb-16">
          <div className="max-w-4xl mx-auto w-full">
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
      </div>
    </div>
  );
};

export const WorkspaceMentor = () => {
  const { user, courses, currentCourse, activeCourseId, setActiveCourseId, activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl, pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin, activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements, xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe, navigate } = useOutletContext();
  return (
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
};

export const WorkspacePlacement = () => {
  const { user, courses, currentCourse, activeCourseId, setActiveCourseId, activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl, pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin, activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements, xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe, navigate } = useOutletContext();
  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Placement Tracker
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {globalCourseName || "Your Course"}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiUsers size={13} className="text-[#94A3B8]" />
                {globalInstructorName || "Instructor"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-8 pb-16">
          <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 lg:p-12 shadow-sm relative max-w-4xl">
            <div className="absolute left-[59px] top-[72px] bottom-[72px] w-0.5 bg-[#E5E7EB]"></div>
            <div className="space-y-12">
                {['Learning', 'Preparing', 'Interview Ready', 'Interview Scheduled', 'Placed'].map((title, idx) => {
                  const stages = ['Learning', 'Preparing', 'Interview Ready', 'Interview Scheduled', 'Placed'];
                  const currentStatus = placement?.status || 'Learning';
                  const currentIndex = stages.indexOf(currentStatus);
                  
                  const status = idx < currentIndex ? 'completed' : idx === currentIndex ? (title === 'Placed' ? 'completed' : 'active') : 'upcoming';

                  return (
                    <div key={idx} className="relative flex gap-8 items-start group">
                      <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 ${status === 'completed' ? 'bg-[#10B981] border-white text-white shadow-[0_0_0_2px_#10B981]' : status === 'active' ? 'bg-white border-[#3B82F6] text-[#3B82F6]' : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'}`}>
                        {status === 'completed' ? <FiCheckCircle size={24} /> : status === 'active' ? <div className="w-4 h-4 bg-[#3B82F6] rounded-full animate-pulse"></div> : <FiCircle size={24} />}
                      </div>
                      <div className={`flex-1 pt-3 pb-6 border-b border-[#F3F4F6] ${status === 'upcoming' ? 'opacity-50' : ''}`}>
                        <h3 className={`text-xl font-bold ${status === 'active' ? 'text-[#3B82F6]' : 'text-[#111827]'}`}>{title}</h3>
                        {status === 'active' && title !== 'Placed' && <button className="mt-4 bg-[#3B82F6] text-white px-5 py-2 rounded-lg font-bold text-sm text-center">In Progress</button>}
                        {status === 'completed' && title === 'Placed' && <p className="mt-2 text-sm font-semibold text-[#10B981]">Congratulations! You are placed.</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkspaceAttendance = () => {
  const {
    user, courses, currentCourse, activeCourseId, setActiveCourseId,
    activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl,
    pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin,
    activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements,
    xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe,
    navigate
  } = useOutletContext();
  const { data, isLoading } = useGetStudentMeetingsQuery(activeCourseId, { skip: !activeCourseId });
  const meetings = data?.meetings || [];
  const attendancePercentage = data?.attendancePercentage || 0;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full px-6 bg-[#FAFAFA]">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-5 border border-[#E5E7EB]">
          <FiActivity size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Attendance Analytics</h2>
        <p className="text-[#6B7280] text-sm font-medium">Select a course from 'My Learning' to view your insights.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-[#FAFAFA]">
        <FiLoader size={24} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  // Process meetings
  let pastMeetings = meetings.filter(m => new Date(m.date) < new Date());
  pastMeetings.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  const totalClasses = pastMeetings.length;
  const attendedCount = pastMeetings.filter(m => m.attended).length;
  const missedCount = totalClasses - attendedCount;
  const certificateEligibility = Math.min(100, Math.round((attendancePercentage / 75) * 100));

  if (fromDate) {
    pastMeetings = pastMeetings.filter(m => new Date(m.date) >= new Date(fromDate));
  }
  if (toDate) {
    const toD = new Date(toDate);
    toD.setHours(23, 59, 59, 999);
    pastMeetings = pastMeetings.filter(m => new Date(m.date) <= toD);
  }

  let currentStreak = 0;
  for (let i = 0; i < pastMeetings.length; i++) {
    if (pastMeetings[i].attended) currentStreak++;
    else break;
  }

  let calcLongestStreak = 0;
  let tempStreak = 0;
  const oldestFirst = [...pastMeetings].reverse();
  for (let i = 0; i < oldestFirst.length; i++) {
    if (oldestFirst[i].attended) {
      tempStreak++;
      if (tempStreak > calcLongestStreak) calcLongestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  const journeySessions = [...pastMeetings].slice(0, 6).reverse();

  const handleDownloadReport = () => {
    const rows = pastMeetings.map((meeting) => {
      const attended = meeting.attended ? 'Yes' : 'No';
      const recording = meeting.recordingUrl ? 'Yes' : 'No';
      const files = (meeting.materials || []).length;
      return [
        formatDateSafe(meeting.date),
        formatTimeSafe(meeting.date),
        meeting.topic || 'Session',
        attended,
        meeting.status || 'Completed',
        globalInstructorName,
        `${meeting.duration || 120} mins`,
        recording,
        files,
      ];
    });

    const header = ['Date', 'Time', 'Topic', 'Attended', 'Status', 'Instructor', 'Duration', 'Recording', 'Files'];
    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance-report-${activeCourseId || 'course'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SVG Circular Progress
  const getProgressRing = (percentage, size = 180, stroke = 12) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full filter drop-shadow-md">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="transparent" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="url(#gradient)" strokeWidth={stroke} fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#0F172A] tracking-tighter">{percentage}%</span>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1">Attendance</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">
      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              Attendance Analytics
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">
                {globalCourseName}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                <FiUsers size={13} className="text-[#94A3B8]" />
                {globalInstructorName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[12px] font-bold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              <FiDownload size={14} /> Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 lg:py-10 space-y-10">

          {/* ── KPI & INSIGHTS STRIP ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {[
              { label: "Overall Attendance", value: `${attendancePercentage}%`, icon: <FiActivity size={18} strokeWidth={2.5} />, color: "text-blue-600", bg: "bg-blue-100", accent: "bg-blue-500", track: "bg-blue-100", ratio: attendancePercentage / 100 },
              { label: "Cert. Eligibility", value: `${certificateEligibility}%`, icon: <FiAward size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: certificateEligibility / 100 }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                    {kpi.icon}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{kpi.value}</h3>
                  </div>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : kpi.track}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TOP/MIDDLE SECTION: Circular Meter & Consistency Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">

            {/* Circular Meter */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full filter blur-[80px] opacity-70 -translate-y-1/2 translate-x-1/3" />
              <h3 className="text-[14px] font-bold text-[#0F172A] self-start mb-6 w-full flex justify-between items-center z-10">
                Attendance Quality

              </h3>
              <div className="relative z-10 mb-8">
                {getProgressRing(attendancePercentage)}
              </div>

              <div className="w-full space-y-4 z-10 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[13px] font-semibold text-[#334155]">Attended</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#0F172A]">{attendedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-[13px] font-semibold text-[#334155]">Missed</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#0F172A]">{missedCount}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                  <span className="text-[13px] font-bold text-[#0F172A]">Total Sessions</span>
                  <span className="text-[13px] font-bold text-[#0F172A]">{totalClasses}</span>
                </div>
              </div>
            </div>

            {/* Consistency Timeline (Journey Path) */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-sm flex flex-col justify-between">
              <h3 className="text-[14px] font-bold text-[#0F172A] mb-8">Learning Consistency Timeline</h3>

              <div className="relative flex items-center justify-between w-full pt-10 pb-6 px-4">
                {/* Connecting Line */}
                <div className="absolute top-[48px] left-8 right-8 h-1 bg-[#E2E8F0] -z-10 rounded-full" />
                <div className="absolute top-[48px] left-8 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 -z-10 rounded-full transition-all" style={{ width: '80%' }} />

                {/* Nodes */}
                {journeySessions.length > 0 ? journeySessions.map((session, idx) => (
                  <div key={idx} className="relative group flex flex-col items-center">
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 bg-[#0F172A] text-white p-3 rounded-xl shadow-xl z-20 w-40 pointer-events-none mb-2">
                      <p className="text-[11px] font-bold text-blue-300 mb-1">{formatDateSafe(session.date)}</p>
                      <p className="text-[13px] font-bold truncate">{session.topic || 'Session'}</p>
                      <p className="text-[11px] text-slate-300 mt-1">{session.duration || 120} mins</p>
                      <p className={`text-[10px] font-bold uppercase mt-2 px-2 py-0.5 inline-block rounded-md ${session.attended ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {session.attended ? 'Present' : 'Missed'}
                      </p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F172A]" />
                    </div>

                    {/* Node Circle */}
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-125 z-10 ${session.attended ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                      {session.attended ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />}
                    </div>
                    <span className="text-[10px] font-bold text-[#64748B] mt-4 whitespace-nowrap">
                      {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(session.date))}
                    </span>
                    <span className={`text-[12px] font-black mt-1 ${session.attended ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {session.attended ? '100%' : 'Missed'}
                    </span>
                  </div>
                )) : (
                  <div className="text-center w-full text-sm text-[#94A3B8]">No recent sessions to display</div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#F1F5F9]">
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Attendance</p>
                  <p className="text-lg font-black text-[#0F172A]">{attendancePercentage}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Current Streak</p>
                  <p className="text-lg font-black text-[#0F172A]">{currentStreak} Classes</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Risk Level</p>
                  <p className={`text-lg font-black ${attendancePercentage >= 75 ? 'text-emerald-500' : attendancePercentage >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {attendancePercentage >= 75 ? 'Very Low' : attendancePercentage >= 50 ? 'Moderate' : 'High'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── MAIN CONTENT: DETAILED SESSION CARDS ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-6 border-b border-[#F1F5F9] bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-[18px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                <FiActivity className="text-blue-500" /> Session Timeline
              </h2>

              {/* Clean Date Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl p-2 shadow-sm transition-colors">
                <div className="flex items-center gap-2 text-[#64748B] min-w-0 px-2">
                  <FiFilter size={14} />
                  <span className="text-[12px] font-semibold truncate">Date range</span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden flex items-center px-2 py-1">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8] mr-2">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      className="bg-transparent border-none text-[12px] text-[#334155] outline-none focus:ring-0 p-0"
                    />
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden flex items-center px-2 py-1">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8] mr-2">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      className="bg-transparent border-none text-[12px] text-[#334155] outline-none focus:ring-0 p-0"
                    />
                  </div>
                </div>
                {(fromDate || toDate) && (
                  <button
                    onClick={() => { setFromDate(''); setToDate(''); }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {pastMeetings.length === 0 ? (
                <div className="text-center py-10 text-[#64748B] font-medium">No session history available.</div>
              ) : (
                <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-10">
                  {pastMeetings.map((meeting, idx) => {
                    const isToday = new Date(meeting.date).toDateString() === new Date().toDateString();
                    const isYesterday = new Date(meeting.date).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
                    const dateLabel = isToday ? 'Today' : isYesterday ? 'Yesterday' : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(meeting.date));

                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[35px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${meeting.attended ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                        <p className="text-[12px] font-bold text-[#64748B] mb-3 ml-2 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${meeting.attended ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {dateLabel}
                          <span className="text-[10px] font-normal uppercase tracking-widest ml-2 bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                            {meeting.attended ? 'Completed' : 'Absent'}
                          </span>
                        </p>

                        {/* Mini Workspace Card (Notion Style) */}
                        <div className="ml-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgb(0,0,0,0.05)] hover:shadow-md hover:border-[#CBD5E1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meeting.attended ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {meeting.attended ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
                              </div>
                              <h4 className="text-[16px] font-bold text-[#0F172A] truncate">
                                {meeting.topic || 'Session'}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#64748B] mt-4">
                              <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#F1F5F9]"><FiCalendar className="text-[#94A3B8]" /> {formatDateSafe(meeting.date)}</span>
                              <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#F1F5F9]"><FiClock className="text-[#94A3B8]" /> Start: {formatTimeSafe(meeting.date)}</span>
                              <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#F1F5F9]"><FiClock className="text-[#94A3B8]" /> End: {formatTimeSafe(meeting.endDate || meeting.date)}</span>
                              <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#F1F5F9]"><FiActivity className="text-[#94A3B8]" /> {meeting.duration || 120} mins</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export const WorkspaceCertificates = () => {
  const { user, courses, currentCourse, activeCourseId, setActiveCourseId, activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl, pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin, activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements, xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe, navigate } = useOutletContext();
  return (
    <div className="w-full h-full bg-[#FAFAFA]">
      <StudentCertificatesPage 
         activeCourseId={activeCourseId}
         globalCourseName={globalCourseName}
         globalInstructorName={globalInstructorName}
      />
    </div>
  );
};

export const WorkspacePlaceholder = ({ title, icon }) => {
  const { user, courses, currentCourse, activeCourseId, setActiveCourseId, activeCourseTab, setActiveCourseTab, pendingRecordingUrl, setPendingRecordingUrl, pendingRecordingTitle, setPendingRecordingTitle, heatmap, digitalTwin, activityFeed, pendingAssignments, upcomingMeetings: globalUpcomingMeetings, placement, achievements, xpData, globalCourseName, globalInstructorName, formatDateSafe, formatTimeSafe, navigate } = useOutletContext();
  return (
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
};

export const WorkspaceProjectsWrapper = () => {
  const { activeCourseId, user, globalCourseName } = useOutletContext();
  return <WorkspaceProjects activeCourseId={activeCourseId} user={user} globalCourseName={globalCourseName} />;
};

export const CourseViewerWrapper = () => {
  const { activeCourseId, user, pendingRecordingUrl, globalCourseName, pendingRecordingTitle, setPendingRecordingUrl, setPendingRecordingTitle } = useOutletContext();
  return (
    <CourseContent
      key={activeCourseId}
      id={activeCourseId}
      user={user}
      pendingRecordingUrl={pendingRecordingUrl}
      pendingRecordingTitle={pendingRecordingTitle}
      globalCourseName={globalCourseName}
      onRecordingPlayed={() => {
        setPendingRecordingUrl(null);
        setPendingRecordingTitle(null);
        localStorage.removeItem('pendingRecording');
      }}
    />
  );
};