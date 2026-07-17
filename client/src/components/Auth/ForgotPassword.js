import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { error, isLoading }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async ({ email }) => {
      try {
        await forgotPassword({ email }).unwrap();
        toast.success("OTP sent to your email successfully");
        navigate("/reset-password", { state: { email } });
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
        
        <p className="text-slate-400 text-sm text-center mb-6">
          Enter your registered email address and we'll send you an OTP to reset your password.
        </p>

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

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-primary text-[#0B0F19] font-extrabold rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
            {!isLoading && <span className="text-xl leading-none">&rarr;</span>}
          </button>
        </div>

        <p className="text-center pt-8 text-sm text-slate-400">
          Remember your password?{" "}
          <Link to="/login" className="text-white font-extrabold hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
