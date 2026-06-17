import React, { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useRegisterCourseMutation } from "../redux/features/user/userApi";

const EnquiryForm = ({ setOpen }) => {
  const [registerCourse, { isSuccess, error, isLoading }] =
    useRegisterCourseMutation();

  const schema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your name"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),
    phoneNumber: Yup.string()
      .required("Please enter your phone number")
      .min(10, "Phone number must be at least 10 digits"),
    course: Yup.string().required("Please select a course"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      course: "",
    },
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
      toast.success("Enquiry Submitted Successfully!");
      if (setOpen) setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        toast.error(error.data.message);
      }
    }
  }, [error, isSuccess, setOpen]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8">
      
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-headingFont tracking-tight mb-2">
          Register for a <span className="text-blue-600">Free Demo</span>
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          Fill out the form below and our team will get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="firstName">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="John Doe"
            value={values.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
              errors.firstName && touched.firstName
                ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
            }`}
          />
          {errors.firstName && touched.firstName && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.firstName}</p>
          )}
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={values.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                errors.email && touched.email
                  ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                  : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="phoneNumber">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="e.g. 9876543210"
              value={values.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                errors.phoneNumber && touched.phoneNumber
                  ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                  : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Course Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="course">
            Interested Course <span className="text-red-500">*</span>
          </label>
          <select
            id="course"
            name="course"
            value={values.course}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
              errors.course && touched.course
                ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
            }`}
          >
            <option value="" disabled>Select a course</option>
            <option value="Blockchain Developer Fundamentals">Blockchain Developer Fundamentals</option>
            <option value="Blockchain Developer Professional">Blockchain Developer Professional</option>
            <option value="Blockchain Developer Expert">Blockchain Developer Expert</option>
            <option value="A Complete Solidity for Smart Programming">Solidity for Smart Programming</option>
            <option value="Certified Blockchain Trainer">Certified Blockchain Trainer</option>
            <option value="Other course">Other Courses</option>
          </select>
          {errors.course && touched.course && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.course}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm sm:text-base font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            {isLoading ? "Submitting Request..." : "Request Free Demo"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EnquiryForm;
