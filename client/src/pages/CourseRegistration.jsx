import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Registration from "../assets/registration.jpg";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRegisterCourseMutation } from "../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";

function CourseRegistration() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const [registerCourse, { isSuccess, error, isLoading }] = useRegisterCourseMutation();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    firstName:   Yup.string().required("Please enter your first name"),
    lastName:    Yup.string().required("Please enter your last name"),
    email:       Yup.string().email("Invalid email!").required("Please enter your email!"),
    phoneNumber: Yup.string().required("Please enter your phone number").min(10),
    course:      Yup.string().required("Please select a course"),
  });

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", email: "", phoneNumber: "", course: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await registerCourse(values);
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Form Submitted!");
      navigate(-1);
    }
    if (error && "data" in error) {
      toast.error(typeof (error.data.message) === "string" ? (error.data.message) : JSON.stringify(error.data.message) || "An error occurred");
    }
  }, [error, isSuccess, isLoading]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <div className="flex-grow relative overflow-x-hidden pb-16">

        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />

        {/* ── HERO ─────────────────────────────────────────────────────
            Background: deep navy-to-slate diagonal — not plain blue.
            Layout:  text LEFT  |  image RIGHT  (as requested)
        ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pb-28 px-6 md:px-12"
          style={{ background: "linear-gradient(135deg, #0a0820 0%, #1C1678 50%, #0f172a 100%)" }}
        >
          {/* Subtle geometric grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Glow blobs */}
          <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)" }} />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-16">

              {/* ── LEFT: Text content ── */}
              <div className="order-1 md:order-1 md:w-1/2 text-white">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/8 mb-6"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-orange-300 font-bold text-[11px] uppercase tracking-widest">
                    Course Registration
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                  Register Your{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(90deg, #06d6a0, #3b82f6)" }}
                  >
                    Interest
                  </span>
                </h1>

                <p className="text-blue-100/80 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  Submit your details to request access or register your interest for our
                  upcoming blockchain certification cohorts. We'll notify you by email or
                  phone once a new batch is scheduled.
                </p>

                {/* Quick-info pills */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: "🎓", text: "Certified Programs" },
                    { icon: "📅", text: "New Batches Monthly" },
                    { icon: "📞", text: "Personalised Callback" },
                  ].map((pill) => (
                    <div
                      key={pill.text}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold text-white/80 border border-white/10"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <span>{pill.icon}</span>
                      <span>{pill.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Image ── */}
              <div className="order-2 md:order-2 md:w-1/2 w-full flex justify-end">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 w-full max-w-[480px]"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {/* Decorative top-bar accent */}
                  <div className="h-1 w-full"
                    style={{ background: "linear-gradient(90deg,#f97316,#1C1678,#7c3aed)" }} />
                  <img
                    src={Registration}
                    alt="Course Registration"
                    className="w-full object-cover max-h-[320px] hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* Overlay caption */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-5 py-4"
                    style={{ background: "linear-gradient(to top, rgba(10,8,32,0.85) 0%, transparent 100%)" }}
                  >
                    <p className="text-white font-bold text-sm">Kairaa Blockchain Academy</p>
                    <p className="text-blue-200/70 text-xs">Coimbatore, Tamil Nadu</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FORM SECTION ──────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 py-16">

          {/* Section heading */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1C1678] mb-2">
              Step 1 of 1
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Complete Your{" "}
              <span className="text-orange-500">Registration</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              All fields marked <span className="text-red-500 font-bold">*</span> are required.
              We'll never share your details with third parties.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden">

            {/* Card top accent */}
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg,#f97316,#1C1678,#7c3aed)" }} />

            <form className="p-7 sm:p-10 space-y-6" onSubmit={handleSubmit}>

              {/* First name + Last name — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="First Name"
                  id="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  touched={touched.firstName}
                  required
                />
                <FormField
                  label="Last Name"
                  id="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  touched={touched.lastName}
                  required
                />
              </div>

              {/* Email */}
              <FormField
                label="Email Address"
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                touched={touched.email}
                required
              />

              {/* Phone */}
              <FormField
                label="Mobile Number"
                id="phoneNumber"
                type="number"
                value={values.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
                required
              />

              {/* Course select */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2"
                >
                  Referred Course <span className="text-red-500">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={values.course}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl
                    focus:border-[#1C1678] focus:ring-2 focus:ring-[#1C1678]/10
                    text-slate-800 text-sm font-medium outline-none cursor-pointer transition-all duration-200"
                >
                  <option value="">Select a Course</option>
                  <option value="Blockchain Developer Fundamentals">Blockchain Developer Fundamentals</option>
                  <option value="Blockchain Developer Professional">Blockchain Developer Professional</option>
                  <option value="Blockchain Developer Expert">Blockchain Developer Expert</option>
                  <option value="A Complete Solidity for Smart Programming">A Complete Solidity for Smart Programming</option>
                  <option value="Certified Blockchain Trainer">Certified Blockchain Trainer</option>
                  <option value="Other course">Other Courses</option>
                </select>
                {errors.course && touched.course && (
                  <span className="text-red-500 text-xs pt-1.5 block">{errors.course}</span>
                )}
              </div>

              {/* Privacy note */}
              <p className="text-xs text-slate-400 text-center">
                🔒 Your information is safe. We'll only use it to contact you about this registration.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest text-white
                  transition-all duration-300 flex items-center justify-center gap-2
                  hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{
                  background: isLoading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #f97316 0%, #1C1678 100%)",
                  boxShadow: isLoading ? "none" : "0 4px 20px rgba(249,115,22,0.3), 0 2px 8px rgba(28,22,120,0.2)",
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit Registration →"
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

/* ── Reusable text input field ────────────────────────────────── */
const FormField = ({ label, id, type, value, onChange, error, touched, required }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl
        focus:border-[#1C1678] focus:ring-2 focus:ring-[#1C1678]/10
        text-slate-800 text-sm font-medium placeholder-slate-400 outline-none
        transition-all duration-200"
    />
    {error && touched && (
      <span className="text-red-500 text-xs pt-1.5 block">{error}</span>
    )}
  </div>
);

export default CourseRegistration;
