import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experience: "",
    learningStyle: ""
  });

  const nextStep = (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      toast.success("Registered successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-white/10"}`}></div>
        ))}
      </div>

      <form onSubmit={nextStep} className="w-full space-y-6">
        
        {/* STEP 1: Experience Level */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-2">What is your experience level?</h2>
            <p className="text-sm text-slate-400 mb-6">We'll tailor course difficulty to match your skills.</p>
            <div className="flex flex-col gap-3">
              {[
                { level: "Beginner", desc: "I'm new to Web3 and Blockchain" },
                { level: "Intermediate", desc: "I know the basics, looking to build projects" },
                { level: "Advanced", desc: "I'm looking for complex, expert-level content" }
              ].map(exp => (
                <label
                  key={exp.level}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    formData.experience === exp.level 
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <input type="radio" name="experience" value={exp.level} checked={formData.experience === exp.level} onChange={e => setFormData({...formData, experience: e.target.value})} className="hidden" />
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.experience === exp.level ? "border-accent" : "border-slate-500"}`}>
                    {formData.experience === exp.level && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
                  </div>
                  <div>
                    <span className={`block font-bold text-sm ${formData.experience === exp.level ? "text-accent" : "text-white"}`}>{exp.level}</span>
                    <span className="block text-xs text-slate-400 mt-1">{exp.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Learning Style */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-2">How do you prefer to learn?</h2>
            <p className="text-sm text-slate-400 mb-6">Choose the style that fits your schedule.</p>
            <div className="flex flex-col gap-3">
              {[
                { style: "Self Paced", desc: "Learn on my own time, at my own speed" },
                { style: "Live Sessions", desc: "Structured classes with live instructors" },
                { style: "Hybrid", desc: "A mix of self-paced content and live mentoring" }
              ].map(ls => (
                <label
                  key={ls.style}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    formData.learningStyle === ls.style 
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <input type="radio" name="learningStyle" value={ls.style} checked={formData.learningStyle === ls.style} onChange={e => setFormData({...formData, learningStyle: e.target.value})} className="hidden" />
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.learningStyle === ls.style ? "border-accent" : "border-slate-500"}`}>
                    {formData.learningStyle === ls.style && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
                  </div>
                  <div>
                    <span className={`block font-bold text-sm ${formData.learningStyle === ls.style ? "text-accent" : "text-white"}`}>{ls.style}</span>
                    <span className="block text-xs text-slate-400 mt-1">{ls.desc}</span>
                  </div>
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
          <button 
            type="submit" 
            disabled={step === 1 && !formData.experience}
            className={`flex-1 py-4 font-extrabold rounded-xl transition-all ${
              (step === 1 && formData.experience) || (step === 2 && formData.learningStyle)
                ? "bg-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]" 
                : "bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            }`}
          >
            {step === 2 ? "Login to Continue" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
