import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "../pages/SelfBlockchainDev.css";
import { Link } from "react-router-dom";
import Header from "../components/Header"
import { SelfData } from "../../src/pages/Top_courses/Data/SelfpacedBlockchainData1";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";


function SelfBlockChainDev() {
  const [open,setOpen]=useState(false);
 
  const [route, setRoute]=useState("Login")
  const { id } = useParams();
  const Self = SelfData.find((course) => course.id === parseInt(id));
  // _____________________________CURRICULAM_____________________________________________ //
  const Self4 = Self.SelfData2;
  const Self5 = Self4.map((e) => e.data).flat();
  const [list] = React.useState(Self5);
  const [filteredList, setFilteredList] = React.useState([]);

  const handleChange1 = (id) => {
    let filteredList = list.filter((item) => item.id === id);
    setFilteredList(filteredList);
  };

  React.useEffect(() => {
    console.log("Filtered list updated", filteredList);
  }, [filteredList]);
  // ____________________________________________________________________________   //

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const listItemStyle = {
    margin: "10px 0",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
  };
  const listItemHoverStyle = {
    transform: "scale(1.02)",
  };

  return (
    <>
    <Header
     open={open}
     setOpen={setOpen}
     
     setRoute={setRoute}
     route={route}
    />
      <div className="my-2  xs:p-3 md:p-4 border rounded-lg bg-gradient-to-r from-blue-800 to-[#002062] text-white shadow-md">
        <div className="flex md:flex-row flex-col bg-gradient-to-r from-[#002062] bg-blue-600 to-blue-500 shadow-gray-200 shadow-xl md:p-14 mt-2 p-2 animate-typing rounded ">
          <div className="flex flex-col gap-3 ">
            <div className="md:w-1/2">
              <h2 className="md:text-[40px] xs:text-xl font-headingFont font-bold ml-5   border-l-4  md:whitespace-nowrap letter-spacing tracking-wider border-black p-4 animate-blinkCaret">
                {Self.heading2}
              </h2>
            </div>
            <div className="mx-auto flex md:flex-row flex-col   px-2">
              <div className="md:w-1/2">
                <h2 className="md:text-2xl xs:text-lg text-2xl p-5 leading-9 font-bold ml-5">
                  ❝{Self.Subnewhead}❞
                </h2>
              </div>
              <div className="md:w-1/4 xs:justify-center xs:text-center p-5 ">
                <Link to="/course-registration">
                  <button className="button font-headingFont relative py-3 px-8 xs:text-lg  md:text-3xl  font-bold text-extrabold border-2 border-white text-white  rounded-lg shadow transition-all duration-300 ease-in-out cursor-pointer hover:bg-transparent hover:text-[#fec195] hover:shadow-lg">
                    <span className="star-1 animate-wiggle  absolute top-1/6 left-1/5 w-5 h-auto filter drop-shadow-0 transition-all duration-1000 ease-[cubic-bezier(0.05,0.83,0.43,0.96)]">
                      ⚝
                    </span>
                    <span className="star-2 animate-spin absolute top-[45%] left-[45%] w-1 h-auto filter drop-shadow-0 transition-all duration-1000 ease-[cubic-bezier(0,0.4,0,1.01)]"></span>
                    <span className="star-3 animate-shake absolute top-2/5 left-2/5 w-1 h-auto filter drop-shadow-0 transition-all duration-1000 ease-[cubic-bezier(0,0.4,0,1.01)]"></span>
                    <span className="star-4 animate-spin absolute top-1/5 left-2/5 w-2 h-auto filter drop-shadow-0 transition-all duration-800 ease-[cubic-bezier(0,0.4,0,1.01)]">
                      ✰
                    </span>
                    <span className="star-5 animate-wiggle absolute top-1/4 left-[45%] w-3 h-auto filter drop-shadow-0 transition-all duration-600 ease-[cubic-bezier(0,0.4,0,1.01)]">
                      ⚝
                    </span>
                    <span className="star-6 absolute top-1/20 left-1/2 w-1 h-auto filter drop-shadow-0 transition-all duration-800 ease"></span>
                    <svg className="hidden">
                      <defs>
                        <filter id="drop-shadow" height="130%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                          <feOffset dx="2" dy="2" result="offsetblur" />
                          <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                    </svg>
                    {Self.button1}
                  </button>{" "}
                </Link>
                <p className="mt-3 py-3">⭒⭒{Self.button2}⭒⭒</p>
              </div>
            </div>{" "}
          </div>
          <div className="md:w-1/2  md:h-85  card">
            <div className="bg md:w-[335px] xs:w-[300px] w-[300px] h-65 xs:h-65  md:h-67 xs:text-center overflow-hidden">
              {" "}
              <img
                className="rounded-xl object-cover overflow-hidden"
                src={Self.image1}
                alt=" "
              />
            </div>
            <div className="blob"></div>
          </div>
        </div>
      </div>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              className="justify-center text-center"
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab
                sx={{
                  marginLeft: { xs: 10, sm: 5, md: 40 },

                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1.1rem" },
                  fontWeight: { xs: "normal", sm: "bold", md: "bolder" },
                }}
                label="Overview"
                value="1"
              />
              <Tab
                sx={{
                  marginLeft: { xs: 10, sm: 5, md: 40 },
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1.1rem" },
                  fontWeight: { xs: "noraml", sm: "bold", md: "bolder" },
                }}
                label="Curriculum"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="flex xs:p-3 md:flex-row flex-col mx-auto container ">
              <div className="md:w-3/4  ">
                <h2 className=" text-xl md:text-2xl font-headingFont font-bold py-3 border-b-2 border-b-gray-300">
                  {Self.heading3}
                </h2>
                <h2 className="font-bold font-headingFont text-xl md:text-2xl py-3 ">
                  {Self.heading4}
                </h2>
                <p className=" py-3">{Self.paragraph1}</p>
                <h2 className="text-2xl font-headingFont font-bold py-3">
                  {Self.heading5}
                </h2>
                <ul className="list-disc leading-7">
                  {Self.paragraph2.map((e1) => {
                    return <li>{e1}</li>;
                  })}{" "}
                </ul>

                <h2 className="text-2xl font-headingFont font-bold py-4">
                  {Self.heading7}
                </h2>
                <ul className="list-disc  py-2">
                  {Self.paragraph4.map((e4) => {
                    return <li>{e4}</li>;
                  })}
                </ul>
              </div>

              <div className=" rounded-lg h-auto md:mt-20 mt-5 p-3 text-lg ">
                <div className=" leading-7 rounded-xl bg-gradient-to-r  to-blue-50 from-blue-300">
                  <h2 className="text-xl text-center font-headingFont  font-bold">
                    {Self.heading6}
                  </h2>

                  {Self.paragraph3.map((e2) => {
                    return (
                      <p className="py-3 p-2  border-b-2 border-b-gray-100">
                        {e2}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* <div className=" md:w-3/4">
              <h2 className="text-2xl font-bold py-4">{Self.heading7}</h2>
              <ul className="list-disc  py-2">
                {Self.paragraph4.map((e4) => {
                  return <li>{e4}</li>;
                })}
              </ul> */}
            {/* <h2 className="text-2xl font-bold py-3">{Self.heading8}</h2>
              <ul className="list-disc  py-3">
                {Self.paragraph5.map((e5) => {
                  return (
                    <>
                      <li>{e5}</li>
                    </>
                  );
                })}
              </ul> 
            </div>*/}
          </TabPanel>
          <TabPanel value="2">
            <div className="mx-auto container flex md:flex-row  flex-col ">
              {/* ************************************************************************************* */}

              {filteredList.length > 0 ? (
                <div className="md:w-3/4 rounded-lg bg-gradient-to-tr from-blue-200 to-slate-50 p-3 leading-10 ">
                  {filteredList.map((e2) => (
                    <div key={e2.id} className=" p-3  leading-10">
                      <h1 className="text-black  font-bold md:text-2xl mb-3 py-3 xs:text-lg ">
                        {e2.mainheading}
                      </h1>
                      <p>{e2.description}</p>
                      <h2 className="text-black font-bold text-lg my-3 mb-3">
                        {e2.heading}
                      </h2>
                      <ul>
                        <li>{e2.list}</li>
                      </ul>
                      <h2 className="text-black font-bold text-lg my-3 mb-3">
                        {e2.heading1}
                      </h2>
                      <ul>
                        <li>{e2.list1}</li>
                      </ul>
                    </div>
                  ))}{" "}
                </div>
              ) : (
                <>
                  {Self.SelfData1.map((e) => {
                    return (
                      <>
                        <div className="md:w-3/4 gap-5 p-5 leading-10">
                          <h2 className="md:text-2xl font-headingFont xs:text-xl font-bold mb-2">
                            {e.mainheading}
                          </h2>
                          {e.description.map((e) => (
                            <p>{e}</p>
                          ))}
                          <h2 className="font-bold font-headingFont text-xl mb-2 py-2">
                            {e.heading}
                          </h2>

                          <div
                            style={listItemStyle}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform =
                                listItemHoverStyle.transform)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            <ul className=" p-4">
                              {e.list.map((e) => (
                                <li>💫🌟{e}</li>
                              ))}
                            </ul>
                          </div>
                        </div>{" "}
                      </>
                    );
                  })}
                </>
              )}

              {/* *************************************************************************** */}

              {Self4.map((e) => {
                return (
                  <>
                    <div className="md:w-1/4 p-3 mt-2">
                      <div className="gap-1 leading-7 overflow-hidden ">
                        <h2 className="font-bold font-headingFont text-lg mb-2">
                          {e.start}
                        </h2>

                        <ul className="leading-10 border-2 border-gray-400 p-2 bg-blue-50 ">
                          {e.data.map((e) => {
                            return (
                              <li
                                key={e.id}
                                onClick={() => {
                                  handleChange1(e.id);
                                }}
                                className="  cursor-pointer hover:text-blue-600"
                              >
                                ⚝𓇻{e.mainheading}
                              </li>
                            );
                          })}
                        </ul>
                      </div>{" "}
                    </div>{" "}
                  </>
                );
              })}
            </div>
          </TabPanel>
        </TabContext>
      </Box>
      <Footer/>
    </>
  );
}

export default SelfBlockChainDev;
