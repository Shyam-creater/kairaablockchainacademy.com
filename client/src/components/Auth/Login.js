import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { useLoginMutation, useSocialAuthMutation } from "../../redux/features/auth/authApi";
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login = ({ setRoute, setOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [loginMode, setLoginMode] = useState("password"); // "password" or "magic"
  const [login, { isSuccess, error, isLoading }] = useLoginMutation();
  const [socialAuth, { isLoading: isSocialLoading }] = useSocialAuthMutation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await socialAuth({
          access_token: tokenResponse.access_token,
          provider: "google"
        }).unwrap();
        toast.success("Login Successful!");
        let nextPath = "/profile";
        if (result?.user?.role === "admin" || result?.user?.role === "staff") nextPath = "/admin/dashboard";
        navigate(nextPath, { replace: true });
      } catch (err) {
        toast.error("Google Login failed");
      }
    },
    onError: () => {
      toast.error("Google Login failed");
    }
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        const result = await login({ email, password }).unwrap();
        toast.success("Login Successful!");
        let nextPath = "/profile";
        if (result?.user?.role === "admin" || result?.user?.role === "staff") nextPath = "/admin/dashboard";
        navigate(nextPath, { replace: true });
      } catch (err) {
        // error handled in effect
      }
    },
  });

  useEffect(() => {
    if (error && "data" in error) {
      toast.error(typeof (error.data.message) === "string" ? (error.data.message) : JSON.stringify(error.data.message) || "An error occurred");
    }
  }, [error]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;
  
  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        
        {/* Floating Label Email Input */}
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            placeholder=" "
            className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/5 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.email && touched.email ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-primary/50 focus:border-primary"
            }`}
          />
          <label 
            htmlFor="email"
            className="absolute left-4 top-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
          >
            Email Address
          </label>
          {errors.email && touched.email && (
            <span className="text-red-500 text-xs font-medium pt-1 block absolute -bottom-5">{errors.email}</span>
          )}
        </div>

        {/* Floating Label Password Input */}
        {loginMode === "password" && (
          <div className="relative mt-2">
            <input
              type={!show ? "password" : "text"}
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              placeholder=" "
              className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/5 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.password && touched.password ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-primary/50 focus:border-primary"
              }`}
            />
            <label 
              htmlFor="password"
              className="absolute left-4 top-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              onClick={() => setShow(!show)}
            >
              {!show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            {errors.password && touched.password && (
              <span className="text-red-500 text-xs font-medium pt-1 block absolute -bottom-5">{errors.password}</span>
            )}
          </div>
        )}

        {/* Remember Me & Forgot Password */}
        {loginMode === "password" && (
          <div className="flex items-center justify-between text-sm mt-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="font-bold text-primary hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-primary text-[#0B0F19] font-extrabold rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2"
          >
            {isLoading ? "Signing in..." : "Continue to Academy"}
            {!isLoading && <span className="text-xl leading-none">&rarr;</span>}
          </button>
          
        
        </div>

        {/* Social Logins */}
        <div className="pt-6 border-t border-white/10 mt-6 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B0F19] px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Or continue with</span>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              type="button" 
              onClick={() => handleGoogleLogin()}
              disabled={isSocialLoading}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <FcGoogle size={20} /> <span className="text-sm font-bold text-white">{isSocialLoading ? "Loading..." : "Google"}</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <FaGithub size={20} className="text-white" /> <span className="text-sm font-bold text-white">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center pt-8 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-extrabold hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
