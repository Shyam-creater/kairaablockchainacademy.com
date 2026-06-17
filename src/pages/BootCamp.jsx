import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import imagebanner from "../assets/bootcamp.png";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

function BootCamp() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const data = [
    {
      id: 1,
      one: "Introduction to Blockchain",
      two: "1 hour",
      paragraph: [
        "What is Blockchain?",
        "History and Evolution of Blockchain.",
        "Key Features and Benefits.",
      ],
    },
    {
      id: 2,
      one: "How Blockchain Works",
      two: "1.5 hours",
      paragraph: [
        "Structure of Blockchain.",
        "Cryptography in Blockchain.",
        "Consensus Mechanisms.",
        "Transaction Verification and Validation.",
      ],
    },
    {
      id: 3,
      one: "Blockchain Use Cases",
      two: "1.5 hours",
      paragraph: [
        "Cryptocurrencies (Bitcoin, Ethereum)",
        "Supply Chain Management.",
        "Healthcare and Identity Verification.",
        "Smart Contracts and Decentralized Applications.",
      ],
    },
    {
      id: 4,
      one: "Blockchain Ecosystem",
      two: "1 hour",
      paragraph: [
        "Public vs Private Blockchain.",
        "Ethereum and Smart Contracts.",
        "Other Major Blockchain Platforms",
        "Wallets and Exchanges.",
      ],
    },
    {
      id: 5,
      one: "Challenges and Future Trends",
      two: "0.5 hour",
      paragraph: [
        "Scalability and Energy Consumption.",
        "Regulatory and Legal Considerations.",
        "Emerging Trends & Security Standards.",
        "The Future of Blockchain.",
      ],
    },
    {
      id: 6,
      one: "Conclusion and Q&A",
      two: "0.5 hour",
      paragraph: [
        "Recap of Key Concepts.",
        "Final Assessment Review.",
        "Open Discussion and Participant Q&A.",
        "Certification Pathway Delivery.",
      ],
    },
  ];

  const section2 = [
    {
      id: 1,
      heading1: "About The Program",
      paragraph:
        "The Blockchain Developer Bootcamp aims to provide a fast-paced, immersive hands-on blockchain building experience to beginners. The sessions will guide you through the popular developer tools necessary for decentralized application (dApp) deployment, smart contract configuration, and integration from scratch.",
      heading2: "What You Will Learn",
      headingList: [
        "Blockchain Fundamentals",
        "Cryptocurrency Development",
        "Navigating Decentralized Ledgers",
        "Blockchain for Global Impact",
        "Bitcoin & Ethereum Protocols",
        "Cryptocurrency Beginner Guide",
      ],
      heading3: "What You Will Earn",
      heading3List: [
        "A verified Blockchain Certificate",
        "Hands-on portfolio of dApp projects",
        "Deep technical blockchain expertise",
        "Access to elite alumni developer circles",
      ],
    },
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading
        title="Blockchain Bootcamp | Kairaa Blockchain Academy"
        description="Join Kairaa Blockchain Academy's Bootcamp for extensive blockchain knowledge and practical experience."
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
            <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Elite Fast-Track Bootcamp</p>
            <div className="flex flex-row gap-12 lg:gap-24 items-center justify-between">

              {/* LEFT - Text */}
              <div className="w-3/5">
                <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
                  Blockchain{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">
                    Developer Bootcamp
                  </span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 font-paraFont">
                  Immerse yourself in a hands-on developer training ecosystem. Transition from a coding beginner to a blockchain engineering practitioner in weeks.
                </p>
                <Link to="/course-registration">
                  <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="relative z-10 flex items-center text-lg">Register Now</span>
                  </button>
                </Link>
              </div>

              {/* RIGHT - Image */}
              <div className="w-2/5 flex justify-end">
                <div className="relative group p-4 bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                  <img
                    className="max-h-[260px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    src={imagebanner}
                    alt="Blockchain Bootcamp"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2 */}
        {section2.map((e) => (
          <div key={e.id}>
            <section className="py-16 bg-white">
              <div className="container mx-auto max-w-5xl px-6">

                {/* About The Program */}
                <div className="bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg mb-10">
                  <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                    {e.heading1}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed font-paraFont">
                    {e.paragraph}
                  </p>
                </div>

                {/* What You Learn + Earn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col justify-center bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg">
                    <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                      {e.heading2}
                    </h3>
                    <ul className="space-y-3 text-slate-500 text-base font-paraFont font-semibold">
                      {e.headingList.map((item, idx) => (
                        <li className="flex items-center gap-3" key={idx}>
                          <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-center bg-[#F0F4FF] border border-slate-100 rounded-xl p-8 shadow-lg">
                    <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                      {e.heading3}
                    </h3>
                    <ul className="space-y-3 text-slate-500 text-base font-paraFont font-semibold">
                      {e.heading3List.map((item, idx) => (
                        <li className="flex items-center gap-3" key={idx}>
                          <span className="w-2 h-2 rounded-full bg-[#1C1678] flex-shrink-0"></span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </section>
          </div>
        ))}

        {/* Program Schedule Table */}
        <section className="py-16 bg-[#F0F4FF]">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="bg-white border border-slate-100 rounded-xl p-6 sm:p-10 shadow-lg overflow-hidden">
              <h2 className="text-2xl font-extrabold text-[#1C1678] mb-6 pb-3 border-b border-slate-200 font-headingFont">
                Program Schedule & Syllabus
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-100 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-[#1C1678] text-white">
                    <tr>
                      <th className="text-sm text-left p-4 md:p-5 font-bold uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="text-sm text-center p-4 md:p-5 font-bold uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="text-sm text-left p-4 md:p-5 font-bold uppercase tracking-wider">
                        Covered Topics
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 text-sm font-paraFont">
                    {data.map((e, index) => (
                      <tr key={index} className="hover:bg-[#F0F4FF] transition-colors duration-150">
                        <td className="p-4 md:p-5 font-bold text-[#1C1678]">{e.one}</td>
                        <td className="p-4 md:p-5 text-center font-bold text-orange-500">{e.two}</td>
                        <td className="p-4 md:p-5 font-medium text-slate-500">
                          <ul className="space-y-1.5">
                            {e.paragraph.map((e1, subIndex) => (
                              <li key={subIndex} className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                                <span>{e1}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

export default BootCamp;