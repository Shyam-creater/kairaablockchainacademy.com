import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ErrorPage() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans">
      <Header hideQuickBar={true} open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
      
      <main className="flex-grow flex items-center justify-center px-6 relative overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-w-[520px] w-full flex flex-col items-center text-center relative z-10"
        >
          {/* Large subtle 404 with minimal grid behind */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Subtle Abstract Grid behind */}
            <div 
              className="absolute inset-0 -m-16 opacity-30 pointer-events-none" 
              style={{ 
                backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)'
              }}
            ></div>
            
            <h1 className="text-[120px] md:text-[160px] font-semibold leading-none text-[#F3F4F6] tracking-tighter select-none z-10">
              404
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-[#111827] tracking-tight mb-4 z-10">
            Page Not Found
          </h2>
          
          <p className="text-[#6B7280] text-base mb-10 leading-relaxed z-10 max-w-sm">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto z-10">
            <Link 
              to="/student-dashboard" 
              className="w-full sm:w-auto h-[48px] px-8 bg-primary hover:bg-primary-600 text-[#0B0F19] font-bold text-sm rounded-[14px] flex items-center justify-center transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
            
            <button 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto h-[48px] px-8 bg-transparent text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 font-medium text-sm rounded-[14px] flex items-center justify-center transition-colors duration-200"
            >
              Back to Previous Page
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
