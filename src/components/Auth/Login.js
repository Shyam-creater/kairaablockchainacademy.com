import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo2 from "../../carouselimages/Blockchain-Academy-Logo.png";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login = ({ setRoute, setOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        const result = await login({ email, password }).unwrap();
        toast.success("Login Successful!");
        setOpen(false);
        const nextPath = result?.user?.role === "admin" ? "/admin/dashboard" : "/profile";
        navigate(nextPath, { replace: true });
      } catch (err) {
        // error handled in effect
      }
    },
  });

  useEffect(() => {
    if (error && "data" in error) {
      toast.error(error.data.message);
    }
  }, [error]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;
  
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
              Unlock Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">True Potential</span>
            </h2>
            <p className="text-sm text-blue-100 font-paraFont font-medium leading-relaxed max-w-[280px] mx-auto">
              Access world-class courses, expert mentors, and hands-on projects designed to advance your career.
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
      <div className="w-full md:w-[55%] flex flex-col justify-center p-6 sm:p-10 bg-white relative h-full">
        <div className="mb-6 text-left mt-2">
          <h1 className="text-2xl font-bold text-slate-800 mb-1 font-headingFont tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">Sign in to continue your learning journey.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                errors.email && touched.email ? "border-red-400 focus:ring-red-500/20" : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-cyan-400"
              }`}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 text-xs font-medium pt-1 block animate-fade-in">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
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
                className={`w-full px-4 py-3 rounded-xl border bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 pr-12 ${
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
              <span className="text-red-500 text-xs font-medium pt-1 block animate-fade-in">{errors.password}</span>
            )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Sign In
            </button>
          </div>

          <p className="text-center pt-3 text-sm text-slate-500">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
              onClick={() => setRoute("Sign-Up")}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
