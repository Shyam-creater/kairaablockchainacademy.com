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
import { courses } from "../Top_courses/Data/BlockchainData"; // // BlockchainData.jsx
import Header from "../../components/Header";


function ViewCourseDetails1() {
  const [open,setOpen]=useState(false);
 
  const [route, setRoute]=useState("Login")
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



  return (
    <div className="overflow-x-hidden">
  <Header
   open={open}
   setOpen={setOpen}
   
   setRoute={setRoute}
   route={route}
  />
    {/* *************************************************************************************************** */}
      <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-4 animate-fadeInUp ">
        <div className="bg-[#CADDFE] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/4">
              <h2 className="fontstyle2 font-headingFont py-3">{course.name}</h2>
              <p className="text-lg py-3 font-bold ">{course.description} </p>

              <div className="py-3">
                <Link to="/course-registration">
                  <button className="bg-white text-center text-lg p-2 animate-shake active:bg-blue-500 py-3 rounded-md">
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          
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
                label="Syllabus"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="flex mx-auto m-3 container md:flex-row flex-col justify-between">
              <div className="md:w-3/4">
                <h2 className="md:text-2xl font-headingFont xs:text-xl font-bold py-3">
                  {course.heading}
                </h2>
                <p className="md:text-lg">{course.deshead}</p>

                <h2 className="md:text-2xl font-headingFont xs:text-xl font-bold py-3">
                  {course.heading1}
                </h2>

                {course.desheading1.map((e) => {
                  return <p className="text-lg">{e}</p>;
                })}
              </div>
              <div className="md:w-1/4 p-5  bg-gradient-to-t from-blue-100 to-blue-400 rounded">
              <h2 className="md:text-xl font-headingFont xs:text-xl font-bold py-3">
                  Course Feature
                </h2>
                {course.heroSec.map((e, i) => {
                  return (
                    <p className="py-3 border-b-2 border-b-gray-200" key={i}>
                      {e.symbol}
                      {e.content}
                    </p>
                  );
                })}
              </div>{" "}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="container bg-gradient-to-t from-blue-400 to-blue-100  mx-auto p-5 md:mr-28 md:mt-8 md:ml-28 border-2 border-gray-300">
              <div className="border-2 p-2 border-b-gray-200">
                <h1 className="md:text-3xl xs:text-xl font-headingFont font-bold py-2">
                  {course.syllabusheading}
                </h1>
                <p className="md:text-lg  font-medium">{course.syllabus}</p>
              </div>
              {course.content.map((ctop, i) => {
                return (
                  <>
                    <div className="flex justify-between md:p-5">
                      <h1
                        className="md:text-xl  xs:font-medium md:font-bold py-2 "
                        key={ctop.id}
                      >
                        {ctop.name}
                      </h1>
                      <button
                        className="mx-20 font-bold md:text-xl "
                        onClick={() => ViewOrNot(ctop.id)}
                      >
                        {index1 === ctop.id ? "⊝" : "⊕"}
                      </button>
                    </div>

                    {index1 === ctop.id && (
                      <ul className="  px-20 leading-10 text-lg text-[#2e2d2d]  border-b-2 border-b-gray-300">
                        {ctop.content.map((e) => {
                          return <li className="" key={i + 100}>🌠{e}</li>;
                        })}
                      </ul>
                    )}
                  </>
                );
              })}
            </div>
          </TabPanel>
        </TabContext>
      </Box>
      <Footer/>
    </div>
  );
}

export default ViewCourseDetails1;
