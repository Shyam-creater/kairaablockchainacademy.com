import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShieldCheck, HiOutlinePencilAlt, HiOutlineRefresh } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useActivationMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

const Verification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const { token } = useSelector((state) => state.auth || {});
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/onboarding");
    }
    if (error) {
      toast.error(error?.data?.message || "Invalid or expired OTP");
    }
  }, [isSuccess, error, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // allow only numbers
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    // auto submit if complete
    if (index === 5 && value !== "") {
      activation({
        activation_token: token,
        activation_code: newOtp.join(""),
      });
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (!isNaN(char) && i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      // focus last filled input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs[lastIndex].current.focus();
      if (pastedData.length === 6) {
        activation({
          activation_token: token,
          activation_code: pastedData.join(""),
        });
      }
    }
  };

  return (
    <div className="w-full animate-fade-in text-center">
      {/* Verification Progress */}
      <div className="flex items-center justify-center gap-2 mb-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Step 3 of 4</span>
        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
        <span className="text-primary flex items-center gap-1"><HiOutlineShieldCheck className="w-4 h-4" /> Account Security</span>
      </div>

      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,242,254,0.2)]">
        <HiOutlineShieldCheck className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2">Verify your email</h2>
      <p className="text-sm text-slate-400 mb-6">
        We've sent a 6-digit verification code to
        <br />
        <span className="font-bold text-white mt-1 inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          user@example.com 
          <button type="button" className="text-primary hover:text-white transition-colors ml-2" title="Change Email"><HiOutlinePencilAlt size={16} /></button>
        </span>
      </p>

      <form className="w-full max-w-sm mx-auto space-y-8" onPaste={handlePaste}>
        {/* Animated OTP Inputs */}
        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-16 text-center text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner transition-all"
            />
          ))}
        </div>

        <button 
          type="button" 
          disabled={isLoading}
          onClick={() => {
            if (otp.join("").length === 6) {
              activation({
                activation_token: token,
                activation_code: otp.join(""),
              });
            }
          }}
          className={`w-full py-4 font-extrabold rounded-xl transition-all duration-300 ${
            otp.join("").length === 6 
              ? "bg-primary text-[#0B0F19] shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)]" 
              : "bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Verifying..." : (otp.join("").length === 6 ? "Verify Code" : "Enter Code")}
        </button>
      </form>

      <div className="mt-8 text-sm">
        {countdown > 0 ? (
          <p className="text-slate-500 flex items-center justify-center gap-2">
            <HiOutlineRefresh className="animate-spin" /> Resend code in <span className="font-bold text-white">{countdown}s</span>
          </p>
        ) : (
          <button type="button" className="text-primary font-bold hover:text-white transition-colors underline decoration-primary/30 underline-offset-4">
            Resend Verification Code
          </button>
        )}
      </div>

    </div>
  );
};

export default Verification;
