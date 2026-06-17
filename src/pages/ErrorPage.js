import { useRouteError, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { HiOutlineAcademicCap, HiOutlineArrowNarrowLeft } from "react-icons/hi";

export default function ErrorPage() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const error = useRouteError();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      {/* Light Academic Background with Blockchain-esque glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>
      </div>
      
      <div className="relative z-50">
        <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
      </div>
      
      <main className="flex-grow flex items-center justify-center pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-3xl w-full flex flex-col items-center text-center">
          
          {/* Unique Academy 404 Visual */}
          <div className="relative w-48 h-48 mb-12">
            {/* Orbital Rings */}
            <div className="absolute inset-0 border-[1px] border-neutral-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-4 border-r-[2px] border-b-[2px] border-primary-500/60 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
            <div className="absolute inset-8 border-l-[2px] border-t-[2px] border-[#1C1678]/40 rounded-full animate-[spin_8s_linear_infinite]"></div>
            
            {/* Center Cap */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/80 backdrop-blur-md border border-primary-200 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(28,22,120,0.1)]">
                <HiOutlineAcademicCap className="text-[#1C1678] w-10 h-10" />
              </div>
            </div>
            
            {/* 404 Floating Badge */}
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-primary-500 to-[#1C1678] px-5 py-1.5 rounded-full shadow-lg border border-white">
              <span className="text-white font-bold font-headingFont tracking-widest text-sm">404</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1C1678] mb-6 font-headingFont tracking-tight leading-tight">
            Not in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Curriculum</span>
          </h1>
          
          <p className="text-neutral-500 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            It appears the page you are looking for has been removed or doesn't exist in our academic archives. Let's get you back on your learning path.
          </p>
          
          <Link 
            to="/" 
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white border border-neutral-200 text-[#1C1678] rounded-full font-bold hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <HiOutlineArrowNarrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-300 relative z-10 text-primary-500" />
            <span className="relative z-10 tracking-wide">Return to Academy</span>
          </Link>
        </div>
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
