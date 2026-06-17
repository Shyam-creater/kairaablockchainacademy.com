import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useActivationMutation } from "../../redux/features/auth/authApi";
import logo2 from "../../carouselimages/Blockchain-Academy-Logo.png";

const Verification = ({ setRoute }) => {
  const { token } = useSelector((state) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [inValidError, setInvalidError] = useState(false);
  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully!");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        setInvalidError(true);
        toast.error(error.data.message);
      }
    }
  }, [isSuccess, error, setRoute]);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      setInvalidError(false);
      const newVerifyNumber = { ...verifyNumber, [index]: value };
      setVerifyNumber(newVerifyNumber);

      if (value === "" && index > 0) {
        inputRefs[index - 1].current?.focus();
      } else if (value.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

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
              Secure Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">Account</span>
            </h2>
            <p className="text-sm text-blue-100 font-paraFont font-medium leading-relaxed max-w-[280px] mx-auto">
              We prioritize your security. Verify your email to activate full access to the academy.
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
        <div className="w-full flex items-center justify-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-purple-50 flex items-center justify-center shadow-sm border border-cyan-100">
            <VscWorkspaceTrusted size={30} className="text-cyan-600" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 font-headingFont tracking-tight">
            Verify Your Account
          </h1>
          <p className="text-slate-500 text-sm px-4">
            We've sent a 4-digit OTP to your email. Enter it below to activate your account.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {Object.keys(verifyNumber).map((key, index) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              key={key}
              ref={inputRefs[index]}
              maxLength={1}
              value={verifyNumber[key]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`w-[60px] h-[70px] bg-white text-slate-900 border-2 rounded-xl flex items-center justify-center text-2xl font-bold font-sans outline-none text-center shadow-sm transition-all duration-300 ${
                inValidError ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-500/20 shake" : "border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 hover:border-cyan-400"
              }`}
              placeholder="-"
            />
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={verificationHandler}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Verify OTP
          </button>
        </div>

        <p className="text-center pt-5 text-sm text-slate-500">
          Go back to{" "}
          <button
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
            onClick={() => setRoute("Login")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Verification;
