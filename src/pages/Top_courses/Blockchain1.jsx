import React, { useState } from "react";
import { Link } from "react-router-dom";
import Blockchain from "../../assets/blockchainview.jpg";
import { FaLinkedin } from "react-icons/fa";
import Certificate from "../../assets/online-certification.avif";
import skill from "../../assets/skills.png";
import Header from "../../components/Header";
import { PiNotePencilDuotone } from "react-icons/pi";
import Heading from "../../components/Heading";
import Footer from "../../components/Footer";

function InternshipProgram() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading
        title="Blockchain Internship Program | Kairaa Blockchain Academy"
        description="Enhance your skills with Kairaa Blockchain Academy's Internship Program."
        keywords="blockchain course, blockchain certification, blockchain academy"
      />
      <div className="flex-grow bg-white relative overflow-x-hidden pb-16">
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />

        {/* Hero Section — Content LEFT, Image RIGHT */}
        <section className="bg-[#1C1678] pt-20 pb-32 px-6 md:px-12 relative text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Practical Experience Program</p>
            <div className="flex flex-row gap-12 lg:gap-24 items-center justify-between">

              {/* LEFT - Text */}
              <div className="w-3/5">
                <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
                  Blockchain{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">
                    Internship Program
                  </span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 font-paraFont">
                  Acquire hands-on blockchain expertise. Work on real-world systems, configure nodes, write production smart contracts, and build your technical resume under industry mentorship.
                </p>
                <Link to="/course-registration">
                  <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="relative z-10 flex items-center text-lg">Get Started</span>
                  </button>
                </Link>
              </div>

              {/* RIGHT - Image */}
              <div className="w-2/5 flex justify-end">
                <div className="relative group p-1 bg-white/10 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    className="max-h-[260px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    src={Blockchain}
                    alt="Blockchain Internship"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Program Details */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Left Details Block */}
              <div className="bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1C1678] mb-5 pb-2 border-b border-slate-200 font-headingFont">
                    About The Program
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-8 font-paraFont">
                    Kairaa Blockchain Academy is inviting applications for the Blockchain Development and Internship Program. This elite curriculum combines foundational theoretical structures with direct real-world application, available in both online and offline learning configurations.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Details to Know
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#1C1678]/10 text-[#1C1678] rounded-xl">
                        <FaLinkedin size={22} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1C1678]">Shareable certificate</p>
                        <p className="text-xs text-slate-500 font-bold">Add to LinkedIn profile</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#1C1678]/10 text-[#1C1678] rounded-xl">
                        <PiNotePencilDuotone size={22} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1C1678]">Assessments</p>
                        <p className="text-xs text-slate-500 font-bold">20 comprehensive quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Mode Block */}
              <div className="bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1C1678] mb-5 pb-2 border-b border-slate-200 font-headingFont">
                    Online & Offline Mode
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-6 font-paraFont">
                    Blockchain technology can enhance the educational experience by providing secure, efficient, and accessible learning opportunities, while offering verifiable credentials and streamlined processes.
                  </p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-[#1C1678] uppercase tracking-wider mb-4">
                    Program Structure
                  </h4>
                  <ul className="space-y-3 text-slate-500 text-base font-paraFont font-semibold">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                      <span>Beginner-friendly entry level</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                      <span>Recommended coding experience</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                      <span>Flexible Duration: 1 to 3 months</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Expertise Section — Image LEFT, Text RIGHT */}
        <section className="py-16 bg-[#F0F4FF]">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="flex flex-row items-center gap-16">

              {/* LEFT - Image */}
              <div className="w-2/5 flex-shrink-0">
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 overflow-hidden group">
                  <img
                    src={skill}
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    alt="Expertise Development"
                  />
                </div>
              </div>

              {/* RIGHT - Text */}
              <div className="w-3/5 flex flex-col justify-center">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">Expertise</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#1C1678] mb-4 leading-tight font-headingFont">
                  Build Your Subject-Matter Expertise
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-5 font-paraFont">
                  This course is part of the Blockchain Specialization. When you enroll in this program, you will be systematically equipped with professional skills and credentials.
                </p>
                <ul className="space-y-3 text-slate-500 text-base font-paraFont font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1 font-bold flex-shrink-0">•</span>
                    <span>Learn new concepts from industry experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1 font-bold flex-shrink-0">•</span>
                    <span>Gain a foundational understanding of blockchain tooling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1 font-bold flex-shrink-0">•</span>
                    <span>Develop job-relevant skills with hands-on projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1 font-bold flex-shrink-0">•</span>
                    <span>Earn a shareable career certificate</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Skills Gain */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[#1C1678] mb-6 font-headingFont">
                Skills you'll gain
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Blockchain", "Ethereum", "Cryptography", "Bitcoin"].map((s, idx) => (
                  <span
                    key={idx}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-[#1C1678] font-bold text-sm rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Career Certificate */}
        <section className="pb-16 bg-white">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="bg-[#1C1678] rounded-2xl p-8 md:p-14 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600 rounded-full opacity-20 blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500 rounded-full opacity-20 blur-[80px] -translate-x-1/2 translate-y-1/2"></div>

              <div className="flex flex-row justify-between items-center gap-12 relative z-10">

                {/* LEFT - Text */}
                <div className="w-3/5">
                  <span className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-3 block">Verified Certification</span>
                  <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-white mb-4 font-headingFont">
                    Earn a Career Certificate
                  </h2>
                  <p className="text-blue-100 text-base leading-relaxed font-paraFont">
                    Add this prestigious credential to your LinkedIn profile, professional resume, or CV. Share your achievement on social media and showcase your proven skills in performance reviews.
                  </p>
                </div>

                {/* RIGHT - Image */}
                <div className="w-2/5 flex justify-end">
                  <div className="relative p-2 bg-white/10 rounded-xl shadow-2xl border border-white/20 group overflow-hidden">
                    <img
                      className="w-full h-auto object-cover rounded-lg max-h-[180px] group-hover:scale-105 transition-transform duration-500"
                      src={Certificate}
                      alt="Verified Career Certificate"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

export default InternshipProgram;