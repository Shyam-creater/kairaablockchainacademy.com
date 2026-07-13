import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const schema = Yup.object().shape({
  otp: Yup.string().required("Please enter the 6-digit OTP!").length(6, "OTP must be exactly 6 digits"),
  newPassword: Yup.string().required("Please enter your new password!").min(8, "Password must be at least 8 characters!"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [show, setShow] = useState(false);
  const [resetPassword, { error, isLoading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: { otp: "", newPassword: "" },
    validationSchema: schema,
    onSubmit: async ({ otp, newPassword }) => {
      try {
        await resetPassword({ email, otp, newPassword }).unwrap();
        toast.success("Password reset successfully!");
        navigate("/login", { replace: true });
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

  // Protect route if someone navigates directly without an email state
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }
  
  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        
        <div className="text-center mb-6">
          <p className="text-slate-400 text-sm">
            We've sent a 6-digit OTP to:
          </p>
          <p className="text-white font-bold">{email}</p>
        </div>

        {/* Floating Label OTP Input */}
        <div className="relative">
          <input
            type="text"
            name="otp"
            id="otp"
            maxLength={6}
            value={values.otp}
            onChange={handleChange}
            placeholder=" "
            className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/5 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 tracking-widest font-mono text-center text-lg ${
              errors.otp && touched.otp ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-primary/50 focus:border-primary"
            }`}
          />
          <label 
            htmlFor="otp"
            className="absolute left-4 top-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
          >
            6-Digit OTP
          </label>
          {errors.otp && touched.otp && (
            <span className="text-red-500 text-xs font-medium pt-1 block absolute -bottom-5">{errors.otp}</span>
          )}
        </div>

        {/* Floating Label New Password Input */}
        <div className="relative mt-2">
          <input
            type={!show ? "password" : "text"}
            name="newPassword"
            id="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            placeholder=" "
            className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white/5 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.newPassword && touched.newPassword ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-primary/50 focus:border-primary"
            }`}
          />
          <label 
            htmlFor="newPassword"
            className="absolute left-4 top-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary"
          >
            New Password
          </label>
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
            onClick={() => setShow(!show)}
          >
            {!show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
          {errors.newPassword && touched.newPassword && (
            <span className="text-red-500 text-xs font-medium pt-1 block absolute -bottom-5">{errors.newPassword}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-primary text-[#0B0F19] font-extrabold rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
            {!isLoading && <span className="text-xl leading-none">&rarr;</span>}
          </button>
        </div>

        <p className="text-center pt-8 text-sm text-slate-400">
          <Link to="/login" className="text-white font-extrabold hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
