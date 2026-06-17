import React, { useState } from "react";
import Certificate from "../assets/online-certification.avif";
import Herocertificate1 from "../assets/sideimageforcertificate.png";
import { Link } from "react-router-dom";
import side1 from "../assets/blueblueblock.png";
import side2 from "../assets/Success-factors.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

function BlockChainCertification() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const section2 = [
    {
      id: 1,
      heading1: "About The Program",
      paragraph:
        "The Certification of Blockchain Development Program offers developers an exciting opportunity to work with the Research & Development Engineers and Scientists of Kairaa Blockchain Academy on live Blockchain projects. The program will help you apply your theoretical and practical knowledge while gaining real-world project exposure to all facets of Blockchain development activities.",
      heading2: "Who Is It For?",
      paragraph2:
        "This program is open to candidates who have completed the Blockchain Development Online Courses (instructor-led or self-paced) from Kairaa Blockchain Academy. It offers a platform for certified blockchain developers to apply their subject knowledge in making important design and architectural decisions concerning their active projects.",
      heading3: "What You Will Learn",
      heading3List: [
        "Conceptual view to frame high-level blockchain architecture.",
        "Knowledge of designing blockchain-based solutions with industry best practices.",
        "In-depth security considerations and risk assessments for blockchain integration.",
        "Methods of integrating external services and APIs with distributed ledger architecture.",
      ],
    },
  ];

  const section3 = [
    {
      id: 1,
      heading: "Duration & Mode of Delivery",
      paragraph:
        "After successfully finishing the Blockchain Development online courses, you will be awarded a certificate of completion. This certificate serves as tangible proof of your dedication, commitment, and newly acquired skills. It signifies the culmination of your efforts in engaging with course materials, completing assignments, and mastering the concepts. Candidates will also be assigned to a dedicated mentor throughout the program.",
    },
  ];

  const section4 = [
    {
      id: 1,
      heading: "Internship & Certification",
      paragraph:
        "Upon completing the live project training, students submit a detailed internship report to their mentor. The Blockchain Course Certificate will be officially awarded based on the candidate's performance and contributions during the internship project.",
    },
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading
        title="Blockchain Course | Kairaa Blockchain Academy"
        description="Learn blockchain technology with Kairaa Blockchain Academy's complete course."
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

        {/* Hero — Text LEFT, Image RIGHT */}
        <section className="bg-[#1C1678] pt-20 pb-32 px-6 md:px-12 relative text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Elite Certification Program</p>
            <div className="flex flex-row gap-12 lg:gap-24 items-center justify-between">

              {/* LEFT - Text */}
              <div className="w-3/5">
                <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
                  Certification of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">
                    Blockchain Development
                  </span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed font-paraFont">
                  Gain industry-recognized blockchain credentials. Master smart contracts, decentralized architecture, and distributed systems under expert mentorship.
                </p>
              </div>

              {/* RIGHT - Image */}
              <div className="w-2/5 flex justify-end">
                <div className="relative group p-1 bg-white/10 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    className="max-h-[260px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    src={Herocertificate1}
                    alt="Blockchain Certification"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2 */}
        {section2.map((e) => (
          <div key={e.id}>

            {/* About The Program */}
            <section className="py-16 bg-white">
              <div className="container mx-auto max-w-5xl px-6">
                <div className="bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg mb-12">
                  <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                    {e.heading1}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed font-paraFont">
                    {e.paragraph}
                  </p>
                </div>

                {/* Who Is It For — Text LEFT, Image RIGHT */}
                <div className="flex flex-row items-center gap-16 mt-12">

                  {/* LEFT - Text */}
                  <div className="w-3/5 flex flex-col justify-center">
                    <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                      {e.heading2}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed mb-8 font-paraFont">
                      {e.paragraph2}
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                      {e.heading3}
                    </h3>
                    <ul className="space-y-3 text-slate-500 text-base font-paraFont font-semibold">
                      {e.heading3List.map((item, idx) => (
                        <li className="flex items-start gap-3" key={idx}>
                          <span className="text-orange-500 mt-1 font-bold flex-shrink-0">•</span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RIGHT - Image */}
                  <div className="w-2/5 flex-shrink-0">
                    <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 overflow-hidden group">
                      <img
                        src={side1}
                        className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                        alt="Success Factors"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>
        ))}

        {/* Section 3 — Image LEFT, Text RIGHT */}
        {section3.map((e) => (
          <section key={e.id} className="py-16 bg-[#F0F4FF]">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="flex flex-row items-center gap-16">

                {/* LEFT - Image */}
                <div className="w-2/5 flex-shrink-0">
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 overflow-hidden group">
                    <img
                      src={side2}
                      className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                      alt="Duration & Mode"
                    />
                  </div>
                </div>

                {/* RIGHT - Text */}
                <div className="w-3/5 flex flex-col justify-center bg-white border border-slate-100 rounded-xl p-8 shadow-lg">
                  <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">Program Details</span>
                  <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                    {e.heading}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed font-paraFont">
                    {e.paragraph}
                  </p>
                </div>

              </div>
            </div>
          </section>
        ))}

        {/* Section 4 — Text LEFT, Image RIGHT */}
        {section4.map((e) => (
          <section key={e.id} className="py-16 bg-white">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="bg-[#1C1678] rounded-2xl p-8 md:p-14 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600 rounded-full opacity-20 blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500 rounded-full opacity-20 blur-[80px] -translate-x-1/2 translate-y-1/2"></div>

                <div className="flex flex-row justify-between items-center gap-12 relative z-10">

                  {/* LEFT - Text */}
                  <div className="w-3/5">
                    <span className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-3 block">Verified Certification</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-white mb-4 font-headingFont">
                      {e.heading}
                    </h2>
                    <p className="text-blue-100 text-base leading-relaxed mb-8 font-paraFont">
                      {e.paragraph}
                    </p>
                    <Link to="/course-registration">
                      <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-3.5 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <span className="relative z-10 flex items-center text-base">Get Started</span>
                      </button>
                    </Link>
                  </div>

                  {/* RIGHT - Image */}
                  <div className="w-2/5 flex justify-end">
                    <div className="relative p-2 bg-white/10 rounded-xl shadow-2xl border border-white/20 group overflow-hidden">
                      <img
                        className="w-full h-auto object-cover rounded-lg max-h-[180px] group-hover:scale-105 transition-transform duration-500"
                        src={Certificate}
                        alt="Blockchain Certification"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        ))}

      </div>
      <Footer />
    </div>
  );
}

export default BlockChainCertification;