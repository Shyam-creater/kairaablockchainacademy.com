import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlinePhone } from "react-icons/hi";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";

const Signup = ({ setRoute, setOpen }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    interests: [],
    goal: ""
  });

  const [register, { data, isSuccess, error, isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Registration successful");
      navigate("/verify");
    }
    if (error) {
      toast.error(typeof (error?.data?.message || "Registration failed") === "string" ? (error?.data?.message || "Registration failed") : JSON.stringify(error?.data?.message || "Registration failed") || "An error occurred");
    }
  }, [isSuccess, error, data, navigate]);

  const nextStep = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final submit
      await register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        gender: formData.gender,
      });
    }
  };

  const handleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary shadow-[0_0_10px_rgba(0,242,254,0.5)]" : "bg-white/10"}`}></div>
        ))}
      </div>

      <form onSubmit={nextStep} className="w-full space-y-6">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="relative">
              <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="tel" placeholder="Mobile Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" placeholder="Password (min 8 chars)" required minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className={`w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer ${formData.gender ? 'text-white' : 'text-slate-400'}`}>
                <option value="" disabled className="text-slate-900">Select Gender</option>
                <option value="Male" className="text-slate-900">Male</option>
                <option value="Female" className="text-slate-900">Female</option>
                <option value="Other" className="text-slate-900">Other</option>
                <option value="Prefer not to say" className="text-slate-900">Prefer not to say</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Interests */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-2">What are you interested in?</h2>
            <p className="text-sm text-slate-400 mb-6">Select all that apply to personalize your journey.</p>
            <div className="grid grid-cols-2 gap-3">
              {["Blockchain", "Web3", "Smart Contracts", "DeFi", "NFTs", "Full Stack"].map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterest(interest)}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-between ${
                    formData.interests.includes(interest) 
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,242,254,0.2)]" 
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  {interest}
                  {formData.interests.includes(interest) && <HiOutlineCheckCircle size={18} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Goal */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-2">What's your primary goal?</h2>
            <p className="text-sm text-slate-400 mb-6">This helps us recommend the right pathways.</p>
            <div className="flex flex-col gap-3">
              {["Career Change into Web3", "Skill Upgrade for Current Job", "Land an Internship", "Placement Preparation", "Freelance Development"].map(goal => (
                <label
                  key={goal}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    formData.goal === goal 
                      ? "border-accent bg-accent/10 text-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  <input type="radio" name="goal" value={goal} checked={formData.goal === goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.goal === goal ? "border-accent" : "border-slate-500"}`}>
                    {formData.goal === goal && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
                  </div>
                  <span className="font-bold text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 flex gap-3">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
              Back
            </button>
          )}
          <button disabled={isLoading} type="submit" className="flex-1 py-4 bg-primary text-[#0B0F19] font-extrabold rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all disabled:opacity-50">
            {isLoading ? "Registering..." : (step === 3 ? "Complete Registration" : "Continue")}
          </button>
        </div>

        {step === 1 && (
          <p className="text-center pt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-extrabold hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
              Sign in
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;
