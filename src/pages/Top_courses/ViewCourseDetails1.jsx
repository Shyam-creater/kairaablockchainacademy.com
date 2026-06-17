import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { courses } from "../Top_courses/Data/BlockchainData";
import Header from "../../components/Header";

function ViewCourseDetails1() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const { id } = useParams();

  const course = courses.find((course) => course.id === parseInt(id));

  const [index1, setIndex] = React.useState(null);

  function ViewOrNot(i) {
    if (index1 === i) {
      setIndex(null);
    } else {
      setIndex(i);
    }
  }

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!course) {
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
      <div className="flex-grow bg-white relative overflow-x-hidden pb-16">
        <Header
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />

        {/* Hero Section */}
        <section className="bg-[#1C1678] pt-32 pb-48 px-6 md:px-12 relative text-white overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Elite Training Course</p>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
              <div className="lg:w-3/4">
                <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
                  {course.name}
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 font-paraFont">
                  {course.description}
                </p>
                <div className="py-2">
                  <Link to="/course-registration">
                    <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <span className="relative z-10 flex items-center text-lg">Register Now</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="container mx-auto max-w-5xl px-6 py-16">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "rgba(28,22,120,0.15)", display: "flex", justifyContent: "center", mb: 4 }}>
                <TabList
                  onChange={handleChange}
                  aria-label="course details tabs"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1C1678",
                    },
                  }}
                >
                  <Tab
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      color: "#475569",
                      textTransform: "none",
                      px: 4,
                      "&.Mui-selected": {
                        color: "#1C1678",
                      },
                    }}
                    label="Overview"
                    value="1"
                  />
                  <Tab
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      color: "#475569",
                      textTransform: "none",
                      px: 4,
                      "&.Mui-selected": {
                        color: "#1C1678",
                      },
                    }}
                    label="Syllabus"
                    value="2"
                  />
                </TabList>
              </Box>

              {/* Overview panel */}
              <TabPanel value="1" sx={{ px: 0, py: 2 }}>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column info */}
                  <div className="w-full md:w-[68%] bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1678] mb-6 pb-2 border-b border-slate-200 font-headingFont">
                      {course.heading}
                    </h2>
                    <p className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed mb-8 font-paraFont">
                      {course.deshead}
                    </p>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1678] mb-6 pb-2 border-b border-slate-200 font-headingFont">
                      {course.heading1 || "Skills You Will Gain"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {course.desheading1.map((item, index) => (
                        <div className="flex items-start p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm" key={index}>
                          <div className="mt-1 flex-shrink-0 p-1 rounded-full bg-[#1C1678]/10 text-[#1C1678]">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="pl-3 text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed font-paraFont">
                            {item.replace('⍟', '').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right features sidebar */}
                  <div className="w-full md:w-[32%] bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xl h-fit">
                    <h2 className="text-lg font-bold text-[#1C1678] mb-6 pb-2 border-b border-slate-200 text-center font-headingFont">
                      Course Features
                    </h2>
                    <ul className="space-y-4 font-paraFont font-semibold">
                      {course.heroSec.map((e, i) => (
                        <li className="flex items-center gap-3 text-slate-600 font-medium text-sm sm:text-[15px] border-b border-slate-200 pb-3 last:border-0 last:pb-0" key={i}>
                          <span className="text-2xl">{e.symbol}</span>
                          <span>{e.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabPanel>

              {/* Syllabus panel */}
              <TabPanel value="2" sx={{ px: 0, py: 2 }}>
                <div className="w-full">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="pb-4 mb-6 border-b border-slate-200">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1678] font-headingFont">
                        {course.syllabusheading}
                      </h2>
                      <p className="text-slate-500 font-bold mt-1">{course.syllabus}</p>
                    </div>

                    <div className="space-y-4">
                      {(course.content || []).map((ctop, i) => {
                        const isOpen = index1 === ctop.id;
                        return (
                          <div key={ctop.id || i} className="border border-slate-150 rounded-2xl overflow-hidden bg-white hover:bg-slate-50 transition-colors">
                            <button
                              onClick={() => ViewOrNot(ctop.id)}
                              className="w-full flex justify-between items-center p-5 text-left font-bold text-[#1C1678] transition-colors border-none bg-transparent cursor-pointer font-headingFont"
                            >
                              <span className="text-lg md:text-xl">{ctop.name}</span>
                              <span className="text-xl text-[#1C1678]">
                                {isOpen ? (
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                  </svg>
                                )}
                              </span>
                            </button>

                            {isOpen && (
                              <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                                <ul className="space-y-3 font-paraFont">
                                  {ctop.content.map((subItem, idx) => (
                                    <li className="flex items-start gap-2.5 text-slate-600 font-medium text-sm sm:text-[15px]" key={idx}>
                                      <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                                      <span>{subItem}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewCourseDetails1;
