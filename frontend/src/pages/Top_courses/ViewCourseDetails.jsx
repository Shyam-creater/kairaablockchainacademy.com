import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { courses1 } from "../Top_courses/Data/OthercoursesData"; // OtherCourses
import "../Top_courses/ViewCourseDetails.css";
import Footer from "../../components/Footer";


function ViewCourseDetails() {
  const [open,setOpen]=useState(false);
 
  const [route, setRoute]=useState("Login")
  const { id } = useParams();

  const course = courses1.find((course) => course.id === parseInt(id));

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
    <div>
    <Header
     open={open}
     setOpen={setOpen}
     
     setRoute={setRoute}
     route={route}
    />
      {/* *************************************************************************************************** */}
      <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-4 animate-fadeInUp context ">
        <div className=" rounded-xl rounded-br-[80px]  md:p-9 px-4 py-9 area bg-gradient-to-r to-[#002062] bg-blue-600 from-blue-500  ">
          <div className="flex flex-col md:flex-row justify-between items-center circles   gap-10 ">
            {/* *********************************************************************************** */}

            <div className="md:w-3/4 xs:ml-10 xs:mt-2 xs:mr-2 xs:overflow-hidden md:ml-20">
              
              <h2 className="md:text-[40px] font-headingFont xs:text-2xl font-bold  text-[#fff] py-3">
                {course.name}
                
              </h2>
              <p className="md:text-xl xs:text-lg py-3 text-[#fff] font-bold ">
                {course.description}{" "}
              </p>

              <div className="py-3">
                <Link to="/course-registration">
                  <button className="hover:bg-white cursor-pointer text-center  p-2 animate-shake text-blue-700 font-medium bg-gray-50 py-3 rounded-md">
                    START NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    

      {/* ************************************************************************************************************* */}
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
            <div className="mx-auto  flex md:flex-row flex-col gap-10">
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
            </div>
          </TabPanel>

          {/* ************************************************************************************************** */}
          <TabPanel value="2">
            <div className="container bg-gradient-to-t from-blue-400 to-blue-100  mx-auto p-5  md:mt-8  border-2 border-gray-300">
              <div className="border-2 p-2 border-b-gray-200">
                <h1 className="md:text-3xl font-headingFont xs:text-xl font-bold py-2">
                  {course.syllabusheading}
                </h1>
                <p className="text-lg font-medium">{course.syllabus}</p>
              </div>
              {course.topics.map((ctop, i) => {
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
                        className="mx-20 font-bold "
                        onClick={() => ViewOrNot(ctop.id)}
                      >
                        {index1 === ctop.id ? "⊝" : "⊕"}
                      </button>
                    </div>

                    {index1 === ctop.id && (
                      <ul className="  px-20 leading-10 text-lg text-[#2e2d2d]  border-b-2 border-b-gray-300">
                        {ctop.content.map((e) => {
                          return <li key={i + 100}>🌠{e}</li>;
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

export default ViewCourseDetails;
