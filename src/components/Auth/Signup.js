import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRegisterMutation } from "../../redux/features/auth/authApi.js";
import logo2 from "../../carouselimages/Blockchain-Academy-Logo.png";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
  phoneNumber: Yup.string().required("Please enter your phone number!").min(10),
});

const Signup = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isError }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful!";
      toast.success(message);
      setRoute("Verification");
    }
    if (error && "data" in error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, setRoute, error, isError, data]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", phoneNumber: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password, phoneNumber }) => {
      const payload = { name, email, password, phoneNumber };
      await register(payload);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;
  
  return (
    <div className="flex flex-col md:flex-row w-full h-[550px] animate-fade-in">
      
      {/* Redesigned Left Side: Premium Tech/Academy Look */}
      <div className="hidden md:flex flex-col md:w-[45%] relative overflow-hidden p-10 justify-center items-center text-center">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
        
        {/* Animated Gradient Orbs matching Academy Theme */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#CB77F7]/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center h-full space-y-8">
          <img src={logo2} className="h-12 object-contain filter brightness-0 invert" alt="Kairaa Blockchain Academy" />
          
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-headingFont leading-tight">
              Start Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">Journey</span>
            </h2>
            <p className="text-sm text-blue-100 font-paraFont font-medium leading-relaxed max-w-[280px] mx-auto">
              Join thousands of learners worldwide. Your journey to mastering blockchain starts today.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-[280px] mt-8">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center rounded-2xl shadow-xl">
                <p className="text-2xl font-bold text-white mb-1 font-headingFont">7K+</p>
                <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">Students</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center rounded-2xl shadow-xl">
                <p className="text-2xl font-bold text-white mb-1 font-headingFont">1K+</p>
                <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">Courses</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Clean Form */}
      <div className="w-full md:w-[55%] flex flex-col justify-start p-6 sm:p-10 bg-white relative h-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 text-left mt-auto md:mt-0 pt-4 md:pt-0">
          <h1 className="text-2xl font-bold text-slate-800 mb-1 font-headingFont tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 text-sm">Sign up to kickstart your career.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                errors.name && touched.name ? "border-red-400 focus:ring-red-500/20" : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-cyan-400"
              }`}
            />
            {errors.name && touched.name && (
              <span className="text-red-500 text-[10px] font-medium pt-0.5 block animate-fade-in">{errors.name}</span>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                errors.phoneNumber && touched.phoneNumber ? "border-red-400 focus:ring-red-500/20" : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-cyan-400"
              }`}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <span className="text-red-500 text-[10px] font-medium pt-0.5 block animate-fade-in">{errors.phoneNumber}</span>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                errors.email && touched.email ? "border-red-400 focus:ring-red-500/20" : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-cyan-400"
              }`}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 text-[10px] font-medium pt-0.5 block animate-fade-in">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={!show ? "password" : "text"}
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 pr-12 ${
                  errors.password && touched.password ? "border-red-400 focus:ring-red-500/20" : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-cyan-400"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                onClick={() => setShow(!show)}
              >
                {!show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="text-red-500 text-[10px] font-medium pt-0.5 block animate-fade-in">{errors.password}</span>
            )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>

          <p className="text-center pt-2 text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
              onClick={() => setRoute("Login")}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
