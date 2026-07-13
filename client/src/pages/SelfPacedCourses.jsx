import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import mainhero from "../assets/bgHero.jpg";
import image1 from "../assets/Certification.png";
import image2 from "../assets/block.jpg";
import image3 from "../assets/ContactUsAnytime.png";
import image4 from "../assets/StartYourLife.png";
import icon1 from "../assets/newblockchain.jpg";
import icon2 from "../assets/blockchaindevprofessional.jpg";
import Heading from "../components/Heading";
import icon4 from "../assets/blocktechnology.webp";
import icon5 from "../assets/Solidity-Programming-Language.jpg";
import icon6 from "../assets/blockchain-trainer.png";
import icon7 from "../assets/newc.jpg";
import icon8 from "../assets/newc.jpg";
import icon9 from "../assets/newjava.jpg";
import icon10 from "../assets/newFlutter.jpg";
import mobile from "../assets/Mobile-Internet.jpg";
import Footer from "../components/Footer";

function SelfPacedCourses() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const data1 = [
    {
      id: 1,
      image: icon1,
      title: "Blockchain Developer Fundamental",
    },
    {
      id: 2,
      image: icon2,
      title: "Blockchain Developer Professional ",
    },
    {
      id: 3,
      image: icon4,
      title: "Blockchain Developer Expert",
    },
    {
      id: 4,
      image: icon5,
      title: "A Complete Solidity for Smart Programming",
    },
    {
      id: 5,
      image: icon6,
      title: "Certified Blockchain Trainer ",
    },
    {
      id: 6,
      image: icon7,
      title: "C programming Course in online",
    },
    {
      id: 7,
      image: icon8,
      title: "CPP Course in Online",
    },
    {
      id: 8,
      image: icon9,
      title: "Advanced java Course ",
    },
    {
      id: 9,
      image: icon10,
      title: "Flutter Online Course",
    },
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading title="Self-Paced Courses | Kairaa Blockchain Academy" description="Join Kairaa Blockchain Academy’s self-paced courses. Master blockchain, smart contracts, and cryptocurrency at your own pace." keywords="blockchain course, blockchain certification, blockchain academy" />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      {/* Hero Section */}
<section className="bg-[#1C1678] pt-16 pb-24 px-6 md:px-12 relative text-white overflow-hidden">
  {/* Decorative background shapes */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Elite Self-Paced Programs</p>

    <div className="flex flex-row gap-12 lg:gap-24 items-center justify-between">
      
      {/* LEFT SIDE - Text Content */}
      <div className="w-3/5">
        <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
          Develop your skills with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">
            Absolute Mastery
          </span>
        </h1>
        <p className="text-blue-100 text-lg leading-relaxed mb-8 font-paraFont">
          Kairaa Academy is the premier destination for advanced online blockchain training. We deliver meticulously crafted curricula to empower students, from ambitious beginners to seasoned professionals, with industry-defining expertise.
        </p>
        <Link to="/course-registration">
          <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <span className="relative z-10 flex items-center text-lg">Begin Your Journey</span>
          </button>
        </Link>
      </div>

      {/* RIGHT SIDE - Image */}
      <div className="w-2/5 flex justify-end">
        <div className="max-w-[400px] w-full relative group p-1 bg-white/10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <img
            className="w-full max-h-[320px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            src={mainhero}
            alt="Elite Blockchain Training"
          />
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Value Proposition Header */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C1678] mb-6 leading-tight font-headingFont">
            Advance Your Professional Legacy with <span className="text-orange-500">Kairaa Blockchain Academy</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-655 mb-6 leading-relaxed max-w-4xl mx-auto font-paraFont">
            Empower your vision without physical constraints. Our elite curriculum is delivered 100% online, combining theoretical mastery with immersive practical application.
          </p>
          <p className="text-base text-slate-500 mb-12 font-medium italic max-w-4xl mx-auto">
            Join a global network of blockchain pioneers. Over 80% of our graduates report significant career acceleration, including elite placements and promotion pathways.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-extrabold text-[#1C1678] font-headingFont">80%+</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-3 font-bold">Career Growth</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-extrabold text-[#1C1678] font-headingFont">100%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-3 font-bold">Online & Flexible</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-extrabold text-[#1C1678] font-headingFont">75%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-3 font-bold">Comprehension</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-extrabold text-[#1C1678] font-headingFont">Elite</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-3 font-bold">Accreditation</div>
            </div>
          </div>
        </div>
      </section>

{/* Feature Blocks (Alternating Row Layout) */}
<section className="py-20 bg-[#F0F4FF]">
  <div className="container mx-auto max-w-6xl px-6 space-y-20">

    {/* Feature 1 — Image LEFT, Text RIGHT */}
    <div className="flex flex-row items-center gap-16">
      <div className="w-2/5 flex-shrink-0">
        <div className="group bg-white p-3 rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <img
            src={image1}
            className="w-full h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            alt="Career Certification"
          />
        </div>
      </div>
      <div className="w-3/5 flex flex-col justify-center">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
          Professional Prestige
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1C1678] mb-4 leading-snug font-headingFont">
          Get Certified, Get Ahead In Your Career
        </h3>
        <p className="text-slate-500 text-base leading-relaxed mb-3 font-paraFont">
          Learn and earn blockchain-powered digital certificates that validate your expertise worldwide.
        </p>
        <p className="text-slate-500 text-base leading-relaxed font-paraFont">
          Master job-ready skills through a cutting-edge curriculum designed with industry leaders and academic pioneers — comprising real-world datasets, virtual labs, and hands-on exercises.
        </p>
      </div>
    </div>

    {/* Divider */}
    <div className="w-full h-px bg-slate-100" />

    {/* Feature 2 — Text LEFT, Image RIGHT */}
    <div className="flex flex-row items-center gap-16">
      <div className="w-3/5 flex flex-col justify-center">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
          Academic Liberty
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1C1678] mb-4 leading-snug font-headingFont">
          Learn Future Skills in a Flexible Way
        </h3>
        <p className="text-slate-500 text-base leading-relaxed mb-3 font-paraFont">
          Set your own schedule, design your educational pathways, and study precisely when you are at your best.
        </p>
        <p className="text-slate-500 text-base leading-relaxed font-paraFont">
          Our framework is built for busy professionals — access top-tier learning tools, interactive templates, and smart contract architectures on a schedule that adapts to your lifestyle.
        </p>
      </div>
      <div className="w-2/5 flex-shrink-0">
        <div className="group bg-white p-3 rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <img
            src={image2}
            className="w-full h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            alt="Flexible Schedules"
          />
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="w-full h-px bg-slate-100" />

    {/* Feature 3 — Image LEFT, Text RIGHT */}
    <div className="flex flex-row items-center gap-16">
      <div className="w-2/5 flex-shrink-0">
        <div className="group bg-white p-3 rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <img
            src={image3}
            className="w-full h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            alt="Mentorship Support"
          />
        </div>
      </div>
      <div className="w-3/5 flex flex-col justify-center">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
          Elite Partnership
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1C1678] mb-4 leading-snug font-headingFont">
          Your Reliable Partner, Wherever You Are
        </h3>
        <p className="text-slate-500 text-base leading-relaxed mb-3 font-paraFont">
          Receive top-tier academic support from industry mentors and connect with a like-minded global student community.
        </p>
        <p className="text-slate-500 text-base leading-relaxed font-paraFont">
          Leverage dedicated discussion forums to resolve doubts and secure uninterrupted learning. Our premier support network ensures complete understanding and long-term retention of critical skills.
        </p>
      </div>
    </div>

  </div>
</section>

     {/* Second Hero/Promo Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto max-w-6xl px-6">
    <div className="bg-[#F0F4FF] border border-slate-100 rounded-3xl p-8 md:p-14 shadow-xl">
      <div className="flex flex-row justify-between items-center gap-12">
        
        {/* LEFT - Image */}
        <div className="w-2/5 flex-shrink-0">
          <div className="group bg-white p-3 rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <img
              className="object-cover rounded-xl w-full h-64 transition-transform duration-500 group-hover:scale-105"
              src={image4}
              alt="Prestige Journey Banner"
            />
          </div>
        </div>

        {/* RIGHT - Text */}
        <div className="w-3/5">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
            Elite Program
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1C1678] mb-4 leading-tight font-headingFont">
            Start Your Elite Career Journey With Us
          </h2>
          <p className="text-base text-slate-500 mb-8 leading-relaxed font-paraFont">
            Unlock a transformative turning point for your professional life. Our immersive, multi-media curricula keep you highly engaged, while our elite mentor groups offer continuous personalized reviews.
          </p>
          <Link to="/course-registration">
            <button className="relative overflow-hidden bg-[#1C1678] hover:bg-orange-500 text-white font-bold py-3.5 px-10 rounded-full shadow-lg transition-colors duration-300">
              Join Our Ranks
            </button>
          </Link>
        </div>

      </div>
    </div>
  </div>
</section>

{/* Course Grid Section */}
<section className="py-16 bg-[#F0F4FF]">
  <div className="container mx-auto max-w-6xl px-6">
    <div className="text-center mb-12">
      <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
        Our Curriculum
      </span>
      <h2 className="text-2xl md:text-4xl font-extrabold text-[#1C1678] mb-3 font-headingFont">
        Browse Our <span className="text-orange-500">Elite Courses</span>
      </h2>
      <p className="text-slate-500 text-base max-w-xl mx-auto font-paraFont">
        Select a luxury curriculum engineered to accelerate your command over emerging technologies.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data1.map((e) => (
        <div
          key={e.id}
          className="group relative flex flex-col justify-between p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
        >
          <div>
            <div className="relative rounded-xl overflow-hidden mb-4 h-44 border border-slate-100 bg-slate-50">
              <Link to={`/course/selfpaced-course/${e.id}`}>
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={e.image}
                  alt={e.title}
                />
              </Link>
            </div>
            <h3 className="text-base font-bold text-[#1C1678] mb-4 text-center leading-snug px-1 font-headingFont">
              {e.title}
            </h3>
          </div>

          <div className="pt-3 border-t border-slate-100 w-full">
            <Link to={`/course/selfpaced-course/${e.id}`} className="block w-full">
              <button className="w-full bg-[#1C1678] hover:bg-orange-500 text-white font-semibold py-3 rounded-full shadow-md transition-colors duration-300 uppercase text-xs tracking-wider">
                Access Curriculum
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Flexibility Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto max-w-6xl px-6">
    <div className="bg-[#F0F4FF] border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl">
      <div className="flex flex-row justify-between items-center gap-12">

        {/* LEFT - Image */}
        <div className="w-1/4 flex-shrink-0">
          <div className="group p-1 rounded-full bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden max-w-[160px]">
            <img
              className="rounded-full object-cover aspect-square w-full transition-transform duration-500 group-hover:scale-105"
              src={mobile}
              alt="Prestigious Academic Flexibility"
            />
          </div>
        </div>

        {/* RIGHT - Text */}
        <div className="w-3/4">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1678] mb-5 font-headingFont">
            Prestige & Flexibility
          </h2>
          <ul className="space-y-3 text-slate-500 text-base font-paraFont">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 mt-1 font-bold">•</span>
              <span>Study at your own pace, on your own terms, without physical limits.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 mt-1 font-bold">•</span>
              <span>Consolidated knowledge base — access elite curriculum resources in one unified hub.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 mt-1 font-bold">•</span>
              <span>Optimized on-the-go access — consume educational material seamlessly from any mobile devices.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
}

export default SelfPacedCourses;
