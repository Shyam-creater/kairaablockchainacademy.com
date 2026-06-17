import React, { useState, useEffect } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Modal, Box } from "@mui/material";
import { FiBookOpen, FiAward, FiClock, FiSmartphone, FiUsers, FiShield, FiCompass, FiX } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import scannerImage from "../../assets/kba_scanner.jpeg";

import CourseContentList from "./CourseContentList";
import CustomModel from "../../utils/CustomModel";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import Verification from "../Auth/Verification";
import Footer from "../Footer";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";

const CourseDetails = ({ data, currentUser }) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const { data: userData, refetch } = useLoadUserQuery(undefined, {});

  // ── Check purchase status ──────────────────────────────────
  useEffect(() => {
    if (userData?.user) {
      setIsPurchased(userData.user.courses.some((c) => c._id === data._id));
    } else {
      setIsPurchased(false);
    }
  }, [userData, data]);

  // ── Price calculations ─────────────────────────────────────
  const isFree = data?.price === 0;
  const discountPct =
    data?.estimatedPrice > data?.price
      ? Math.round(((data.estimatedPrice - data.price) / data.estimatedPrice) * 100)
      : 0;

  // ── Total lesson count ─────────────────────────────────────
  const totalLessons = data?.courseContentData?.length ?? 0;

  // ── UPI Payment handler ──────────────────────────────────
  const paymentHandler = (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to purchase the course.");
      setOpen(true);
      return;
    }

    setQrModalOpen(true);
  };

  const handleQrPaymentSubmit = async (e) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error("Please enter a valid Transaction ID.");
      return;
    }

    try {
      setSubmittingPayment(true);
      await axios.post(
        `${process.env.REACT_APP_PUBLIC_SERVER_URI}/create-manual-order`,
        {
          courseId: data._id,
          transactionId: transactionId.trim(),
        },
        { withCredentials: true }
      );
      toast.success("Payment verification details submitted! Admin will activate your course after verifying the UTR.");
      setQrModalOpen(false);
      setTransactionId("");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to submit verification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen font-sans bg-slate-50/50 text-slate-900">
      <div className="flex-grow relative overflow-x-hidden pb-16">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#0a0820] via-[#1C1678] to-[#1e1b4b] pt-28 pb-44 px-6 md:px-12 relative text-white overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-600 rounded-full opacity-[0.18] blur-[120px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-500 rounded-full opacity-[0.15] blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-orange-300 font-bold text-[11px] uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              Interactive Live Program
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 max-w-4xl">
              {data?.name}
            </h1>

            {/* Short description */}
            <p className="text-blue-100/85 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
              {data?.description
                ? data.description.substring(0, 200) + (data.description.length > 200 ? "…" : "")
                : "Master blockchain technology with our industry-led certificate program."}
            </p>

            {/* Meta row — only lesson count */}
            <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">
              {totalLessons > 0 && (
                <div className="flex items-center gap-2 text-blue-100/80 text-sm font-medium">
                  <FiBookOpen className="opacity-70" />
                  <span>{totalLessons} {totalLessons === 1 ? "Lesson" : "Lessons"}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MAIN BODY ────────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-8 -mt-24">
          <div className="w-full flex flex-col-reverse xl:flex-row gap-8 items-start">

            {/* ── LEFT: Course content ─────────────────────── */}
            <div className="w-full xl:w-[65%] flex flex-col gap-6">

              {/* Benefits */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg">
                <SectionHeading bar="bg-[#1C1678]" title="What you will learn from this course" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data?.benefits?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 bg-slate-50/60 hover:bg-indigo-50/30 border border-slate-100 hover:border-[#1C1678]/10 rounded-2xl transition-all duration-200"
                    >
                      <div className="mt-0.5 flex-shrink-0 p-1 rounded-full bg-emerald-500/10 text-emerald-600">
                        <IoCheckmarkDoneOutline size={15} />
                      </div>
                      <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg">
                <SectionHeading bar="bg-orange-500" title="Prerequisites for this course" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data?.prerequisites?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 bg-orange-50/40 hover:bg-orange-50 border border-orange-100/60 hover:border-orange-200/60 rounded-2xl transition-all duration-200"
                    >
                      <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-full bg-orange-500/10 text-orange-600">
                        <FiCompass size={13} />
                      </div>
                      <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg">
                <SectionHeading bar="bg-purple-500" title="Course Curriculum" />
                <p className="text-slate-500 font-medium text-sm sm:text-[15px] leading-relaxed mb-4 ml-1">
                  Explore the modules and sessions prepared in this curriculum.
                </p>
                <CourseContentList data={data?.courseContentData} isDemo={true} />
              </div>

              {/* Description */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg">
                <SectionHeading bar="bg-cyan-500" title="Course Description" />
                <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-100">
                  {data?.description}
                </p>
              </div>

            </div>

            {/* ── RIGHT: Sticky purchase card ──────────────── */}
            <div className="w-full xl:w-[35%]">
              <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden sticky top-[88px]">

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-[#1C1678] to-purple-600" />

                <div className="p-5 sm:p-6">

                  {/* Course thumbnail — static, no play button */}
                  {data?.thumbnail?.url && (
                    <div className="relative rounded-2xl overflow-hidden mb-5 border border-slate-100 aspect-video">
                      <img
                        src={data.thumbnail.url}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2.5 flex-wrap mb-5">
                    <span className="text-3xl font-black text-[#1C1678] tracking-tight">
                      {isFree ? "Free" : `₹${(data?.price ?? 0).toLocaleString("en-IN")}`}
                    </span>
                    {!isFree && data?.estimatedPrice > data?.price && (
                      <>
                        <span className="text-slate-400 line-through text-sm font-medium">
                          ₹{(data?.estimatedPrice ?? 0).toLocaleString("en-IN")}
                        </span>
                        <span className="ml-auto px-2.5 py-1 text-[10px] font-extrabold text-orange-700 bg-orange-500/10 border border-orange-400/20 rounded-full animate-pulse">
                          {discountPct}% Off
                        </span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mb-5">
                    {isPurchased ? (
                      <Link
                        to={`/course-access/${data?._id}`}
                        className="block w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-full text-center transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-emerald-200/50"
                      >
                        Start Course
                      </Link>
                    ) : (
                      <button
                        onClick={paymentHandler}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-[#1C1678] hover:from-orange-600 hover:to-[#0f0c3d] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200/40 disabled:opacity-75 disabled:cursor-not-allowed disabled:translate-y-0"
                      >
                        {isFree
                          ? "Enroll for Free"
                          : `Buy Now — ₹${(data?.price ?? 0).toLocaleString("en-IN")}`}
                      </button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-4" />

                  {/* Course inclusions */}
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    This Course Includes:
                  </p>
                  <ul className="space-y-4 text-slate-700 text-sm sm:text-[15px] font-semibold">
                    <li className="flex items-center gap-3">
                      <FiClock className="text-[#1C1678] text-base flex-shrink-0" />
                      Full Lifetime Access
                    </li>
                    <li className="flex items-center gap-3">
                      <FiAward className="text-[#1C1678] text-base flex-shrink-0" />
                      Certificate of Completion
                    </li>
                    <li className="flex items-center gap-3">
                      <FiSmartphone className="text-[#1C1678] text-base flex-shrink-0" />
                      Access on Mobile and Desktop
                    </li>
                    <li className="flex items-center gap-3">
                      <FiBookOpen className="text-[#1C1678] text-base flex-shrink-0" />
                      Hands-on Projects &amp; Assignments
                    </li>
                    <li className="flex items-center gap-3">
                      <FiUsers className="text-[#1C1678] text-base flex-shrink-0" />
                      Live Doubt-Clearing Sessions
                    </li>
                  </ul>

                  {/* Secure payment note */}
                  <div className="flex flex-col items-center gap-1.5 pt-5 mt-4 border-t border-slate-100 text-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <FiShield className="text-emerald-500" />
                      100% Secure Transaction
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium max-w-[200px]">
                      Enrollment processed securely through UPI Transfer
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* UPI QR Scanner Payment Modal */}
      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        style={{ overflow: "scroll" }}
      >
        <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 800px:w-[450px] w-[92%] max-w-[450px] bg-white rounded-3xl outline-none shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-[#1C1678] to-purple-600" />
          
          <button
            onClick={() => setQrModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
          >
            <FiX size={18} />
          </button>

          <div className="p-6 sm:p-8 flex flex-col items-center max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-[#1C1678] text-center mb-1 font-headingFont">
              Scan &amp; Pay to Enroll
            </h3>
            <p className="text-xs text-slate-500 font-semibold text-center mb-6 font-paraFont">
              {data?.name}
            </p>

            {/* QR Image Container */}
            <div className="w-56 h-56 p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-6">
              <img
                src={scannerImage}
                alt="UPI Payment QR Code Scanner"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<div class="text-center p-4"><span class="text-3xl">📱</span><p class="text-xs text-slate-400 font-bold mt-2">Place your scanner image as src/assets/kba_scanner.jpeg</p></div>`;
                }}
              />
            </div>

            {/* Price Details */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-6 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-paraFont">Total Amount:</span>
              <span className="text-xl font-black text-[#1C1678] font-headingFont">
                ₹{(data?.price ?? 0).toLocaleString("en-IN")}.00
              </span>
            </div>

            {/* Payment Verification Form */}
            <form onSubmit={handleQrPaymentSubmit} className="w-full space-y-4 font-paraFont">
              <div>
                <label htmlFor="userEmail" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registering Account
                </label>
                <input
                  type="text"
                  id="userEmail"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-500 text-xs font-bold outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="transactionId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  UPI Transaction ID / UTR <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit UTR number"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#1C1678] focus:ring-2 focus:ring-[#1C1678]/10 rounded-xl text-slate-800 text-sm font-medium outline-none transition-all duration-200"
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Enter the reference number from your GPay, PhonePe, or Paytm receipt.
                </p>
              </div>

              <div className="flex gap-3 pt-3 w-full">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(false)}
                  className="flex-grow py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-full font-bold text-xs uppercase tracking-widest text-slate-500 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="flex-grow py-3 bg-gradient-to-r from-orange-500 to-[#1C1678] text-white font-bold rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-orange-200/50 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:translate-y-0 cursor-pointer border-none"
                >
                  {submittingPayment ? "Submitting..." : "Submit Verification"}
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      {/* Auth modals */}
      {route === "Login" && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} component={Login} />
      )}
      {route === "Sign-Up" && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} component={Signup} />
      )}
      {route === "Verification" && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} component={Verification} />
      )}
    </div>
  );
};

/* ── Small reusable heading with colored left bar ── */
const SectionHeading = ({ bar, title }) => (
  <h2 className="text-base sm:text-lg font-extrabold text-[#1C1678] mb-5 flex items-center gap-3">
    <span className={`w-1 h-6 rounded-full flex-shrink-0 ${bar}`} />
    {title}
  </h2>
);

export default CourseDetails;
