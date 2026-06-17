import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { SelfData } from "../../src/pages/Top_courses/Data/SelfpacedBlockchainData1";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

function SelfBlockChainDev() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const { id } = useParams();
  
  // Find self-paced course by ID
  const Self = SelfData.find((course) => course.id === parseInt(id));

  // Curriculum states
  const Self4 = Self.SelfData2;
  const Self5 = Self4.map((e) => e.data).flat();
  const [list] = React.useState(Self5);
  const [filteredList, setFilteredList] = React.useState([]);

  const handleChange1 = (id) => {
    let filteredList = list.filter((item) => item.id === id);
    setFilteredList(filteredList);
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!Self) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-[#F7F4FD]">
        <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <div className="flex-grow bg-white relative overflow-x-hidden pb-10">
        <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

        <div className="relative z-10 max-w-screen-2xl mx-auto md:px-12 p-4 py-6 mt-6">
          <div className="w-full flex flex-col-reverse 1100px:flex-row gap-8 mt-6">
            
            {/* Left Column (Details and Tab panels) - Rounded premium card */}
            <div className="w-full 1100px:w-[68%]">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="pl-4 border-l-4 border-[#1C1678] mb-6">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1678] leading-tight font-headingFont">
                    {Self.heading2}
                  </h1>
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-slate-650 italic mb-8 font-paraFont">
                  ❝{Self.Subnewhead}❞
                </h2>

                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "rgba(28,22,120,0.15)" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="course tabs"
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: "#1C1678",
                          },
                        }}
                      >
                        <Tab
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "#475569",
                            textTransform: "none",
                            "&.Mui-selected": {
                              color: "#1C1678",
                            },
                          }}
                          label="Overview"
                          value="1"
                        />
                        <Tab
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "#475569",
                            textTransform: "none",
                            "&.Mui-selected": {
                              color: "#1C1678",
                            },
                          }}
                          label="Curriculum"
                          value="2"
                        />
                      </TabList>
                    </Box>

                    {/* Overview Tab Panel */}
                    <TabPanel value="1" sx={{ px: 0, py: 4 }}>
                      <div className="space-y-8 font-paraFont">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                            {Self.heading3}
                          </h2>
                          <h3 className="font-bold text-lg text-indigo-950 mt-4 mb-2">
                            {Self.heading4}
                          </h3>
                          <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{Self.paragraph1}</p>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                            {Self.heading5}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {Self.paragraph2.map((item, index) => (
                              <div className="flex items-start p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all duration-300" key={index}>
                                <div className="mt-1 flex-shrink-0 p-1 rounded-full bg-[#1C1678]/10 text-[#1C1678]">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="pl-3 text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 font-headingFont">
                            {Self.heading7}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {Self.paragraph4.map((item, index) => (
                              <div className="flex items-start p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all duration-300" key={index}>
                                <div className="mt-1 flex-shrink-0 p-1 rounded-full bg-[#1C1678]/10 text-[#1C1678]">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="pl-3 text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    {/* Curriculum Tab Panel */}
                    <TabPanel value="2" sx={{ px: 0, py: 4 }}>
                      <div className="flex flex-wrap gap-2.5 mb-8">
                        <button
                          onClick={() => setFilteredList([])}
                          className={`px-5 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer border-none rounded-full ${filteredList.length === 0 ? "bg-[#1C1678] text-white shadow-md" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                          All Modules
                        </button>
                        {Self4.map((module) =>
                          module.data.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleChange1(item.id)}
                              className={`px-5 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer border-none rounded-full ${filteredList.length > 0 && filteredList[0].id === item.id ? "bg-[#1C1678] text-white shadow-md" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                            >
                              {item.mainheading}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="space-y-6">
                        {filteredList.length > 0 ? (
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                            {filteredList.map((e2) => (
                              <div key={e2.id} className="space-y-3 font-paraFont">
                                <h3 className="text-[#1C1678] font-extrabold text-xl pb-2 border-b border-slate-200 font-headingFont">
                                  {e2.mainheading}
                                </h3>
                                <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed">{e2.description}</p>
                                <h4 className="text-[#1C1678] font-bold text-lg">
                                  {e2.heading}
                                </h4>
                                <ul className="list-disc pl-5 text-slate-600 font-medium text-sm sm:text-[15px]">
                                  <li>{e2.list}</li>
                                </ul>
                                {e2.heading1 && (
                                  <>
                                    <h4 className="text-[#1C1678] font-bold text-lg mt-4">
                                      {e2.heading1}
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 font-medium text-sm sm:text-[15px]">
                                      <li>{e2.list1}</li>
                                    </ul>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {Self.SelfData1.map((e, index) => (
                              <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-[#1C1678] font-extrabold text-xl mb-4 pb-2 border-b border-slate-200 font-headingFont">
                                  {e.mainheading}
                                </h3>
                                {e.description.map((desc, dIdx) => (
                                  <p key={dIdx} className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed mb-4 font-paraFont">{desc}</p>
                                ))}
                                {e.heading && (
                                  <div className="font-paraFont">
                                    <h4 className="text-[#1C1678] font-bold text-lg mb-3">
                                      {e.heading}
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 font-medium text-sm sm:text-[15px]">
                                      {e.list.map((lItem, lIdx) => (
                                        <li key={lIdx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 hover:bg-slate-100 transition-colors shadow-sm">
                                          <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                          <span>{lItem}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </div>

            {/* Right Column (Booking Widget & Batch Details) - Sticky stacked widgets */}
            <div className="w-full 1100px:w-[32%] space-y-6 sticky top-[100px] z-20 h-fit">
              {/* Primary Booking card */}
              <div className="relative group/card bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xl overflow-hidden">
                
                {/* Gold/Purple top glowing strip */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 to-[#CB77F7] opacity-80" />

                {/* Course Thumbnail Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md bg-white border border-slate-100">
                  <img
                    src={Self.image1}
                    className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover/card:scale-105"
                    alt="Course Thumbnail"
                  />
                </div>

                {/* Register Action CTA */}
                <div className="px-2">
                  <Link to="/course-registration" className="block w-full">
                    <button className="w-full py-4 bg-[#1C1678] hover:bg-orange-500 text-white font-bold rounded-full shadow-lg transition-colors duration-300 uppercase tracking-wider text-xs border-none cursor-pointer">
                      {Self.button1 || "Begin Journey"}
                    </button>
                  </Link>
                  {Self.button2 && (
                    <p className="mt-3 text-center text-sm text-slate-500 font-bold italic">
                      ⭒⭒ {Self.button2} ⭒⭒
                    </p>
                  )}
                </div>
              </div>

              {/* Batch/Course details card */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xl">
                <h4 className="text-lg font-bold text-[#1C1678] mb-4 pb-2 border-b border-slate-200 text-center font-headingFont">
                  {Self.heading6}
                </h4>
                <ul className="space-y-4 font-paraFont font-semibold">
                  {Self.paragraph3.map((item, index) => (
                    <li key={index} className="text-base text-slate-650 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SelfBlockChainDev;
