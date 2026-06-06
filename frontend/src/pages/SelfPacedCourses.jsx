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

  // ************************************************************************************//

  return (
    <>
      <Heading
        title="Self-Paced Courses | Kairaa Blockchain Academy"
        description="Enroll in Kairaa Blockchain Academy's self-paced courses to master blockchain, smart contracts, and cryptocurrency at your own pace. Start your journey today."
        keywords="Self-paced blockchain course, Web3 online training, Learn blockchain, Crypto education, Flexible learning, Kairaa Blockchain Academy, Online blockchain class"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div className="md:px-12 p-4 max-w-screen-2xl  mx-auto mt-5 animate-fadeInUp ">
        <div className="bg-[#F7F4FD] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9">
          <div className="flex flex-col xs:mx-10 xs:flex-col-reverse md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/4">
              <h2 className="sm:text-4xl md:text-[42px] text-3xl font-headingFont text-black font-bold mb-5 ">
                Develop your skills without diligence.
              </h2>
              <p className="text-lg text-black">
                Kairaa Academy is the leading provider of online blockchain
                courses. We offer a wide range of courses to meet the needs of
                students of all levels of experience, from beginners to advanced
                learners.
              </p>

              <div className="py-3">
                <Link to="/course-registration">
                  <button className="p-4 animate-wiggle text-[#fff] bg-gradient-to-r from-cyan-300 to-[#CB77F7]  rounded-2xl text-lg hover:animate-wave hover:bg-blue-400 my-7">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-[20%] w-full ">
              <img
                className="rounded-2xl animate-shake"
                src={mainhero}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* ********************************************************************************************* */}
      <div className="my-12 animate-fadeInUp mx-10 ">
        <div className="text-center">
          <div className="sm:text-3xl text-2xl font-headingFont font-bold mb-5">
            <div>
              Advance in your professional goals with{" "}
              <span className="text-gradient">Kairaa Blockchain Academy</span>
            </div>
          </div>
          <p className="fontstyle4 leading-7 max-w[700px] mx-auto">
            Never constrain your learning in this pandemic situation. We offer
            our courses 100% online so that you are not left behind.
          </p>
          <p className="fontstyle4 leading-7 max-w[700px] mx-auto">
            Start your blockchain journey hassle-free with our online courses.
          </p>
          <p>
            Great career benefits with 80% report including new jobs and
            promotions And 75% report for easily understanding structure.
          </p>
        </div>
      </div>
      {/* ********************************************************************************* */}
      <div className="container mx-auto py-10 px-10  gap-8 animate-fadeInRight">
        <div className="flex  xs:flex-row flex-col gap-10   justify-center items-center">
          <div className="md:w-1/2  animate-zoomIn ">
            <img src={image1} className="" alt="" />
          </div>
          <div className="md:w-3/4">
            <h1 className="sm:text-3xl text-2xl font-headingFont font-bold mb-5">
              Get Certified,Get Ahead In Your Career
            </h1>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto">
              Learn and earn blockchain-powered digital certificates.
            </p>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto py-3">
              Master job-ready skills through cutting-edge curriculum designed
              in guidance with industry and academia.image-feature-5-min 100%
              online courses comprising real-world data sets, virtual labs, case
              studies, and hands-on exercises.
            </p>
          </div>
        </div>
      </div>
      {/* ************************************************ */}
      <div className="container mx-auto animate-fadeInLeft ">
        <div className="gap-10 mx-10 flex flex-col xs:flex-row justify-center items-center ">
          <div className="md:w-3/4">
            <h1 className="sm:text-3xl text-2xl font-headingFont  font-bold mb-5">
              Learn and earn blockchain-powered digital certificates.
            </h1>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto">
              Learn Future Skills In A Flexible Way Set your own schedule and
              study when you have time.
            </p>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto py-3">
              Master job-ready skills through cutting-edge curriculum designed
              in guidance with industry and academia.image-feature-5-min 100%
              online courses comprising real-world data sets, virtual labs, case
              studies, and hands-on exercises.
            </p>
          </div>
          <div className="md:w-1/2  animate-zoomIn">
            <img src={image2} alt="" />
          </div>
        </div>
      </div>

      {/* ************************************************ */}
      <div className="container mx-auto py-10 px-6 animate-fadeInRight">
        <div className="flex mx-10 flex-col xs:flex-row  gap-8    justify-center items-center">
          <div className="md:w-1/2  animate-zoomIn">
            <img src={image3} alt="" />
          </div>

          <div className="md:w-3/4">
            <h1 className="sm:text-3xl text-2xl font-headingFont  font-bold mb-5">
              Your Reliable Partner , Wherever You are!
            </h1>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto">
              Learning support from mentors and like-minded peers.
            </p>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto py-3">
              Discussion forums to resolve conceptual doubts ensuring
              uninterrupted learning experience.
            </p>
            <p className="fontstyle4 leading-7 max-w[700px] mx-auto py-3">
              Kairaa Blockchain Academy&#x27;s outstanding feature and support
              is its wide range of educational materials, designed to assist
              students in understanding and retaining the subject by offering a
              diverse collection.
            </p>
          </div>
        </div>
      </div>

      {/* ************************************************************************ ***********************/}
      <div className="  max-w-screen-2xl mx-10 my-10  animate-rotateAndSlideIn ">
        <div className="bg-[#F7F4FD] rounded-xl rounded-br-[80px] px-10">
          <div className="flex flex-col md:flex-row justify-between items-center xs:gap-3 md:gap-10">
            <div className="md:w-3/5 py-3">
              <h2 className="sm:text-3xl text-2xl font-bold font-headingFont  mb-5 text-black ">
                Start Your Career Journey With Us.
              </h2>
              <p className="text-lg font-medium ">
                To get a new way of improvement and Wonderful turning point of
                your Life. We have Interactive and multimedia elements keep you
                engaged and make learning enjoyable and finally you Receive
                continuous support and feedback from our expert team.So, coders,
                don't hesitate!
              </p>

              <div className="py-3">
                <Link to="/courseregistration">
                  <button className="p-3 bg-gradient-to-r from-cyan-400 to-[#d18ff5] hover:w-[150px] rounded-2xl text-lg hover:bg-blue-300">
                    Join with Us
                  </button>{" "}
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 xs:mx-10">
              <img className="rounded-2xl" src={image4} alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* ************************************************************************************************** */}
      <div className="md:mx-20 px-5 py-5 xs:mx-10">
        <div className="text-center leading-7">
          <h2 className="sm:text-3xl text-2xl font-bold font-headingFont  py-3">
            BROWSE OUR COURSES
          </h2>
          <p className="fontstyle4">
            Choose the course that's right for your career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-col-2 gap-5 mt-10 justify-center  text-center">
          {data1.map((e) => (
            <div
              key={e.id}
              className="p-2 shadow-lg min-w-[15rem] bg-slate-100 rounded-md transition-transform duration-1000 ease-in-out hover:scale-110 group-hover:filter"
            >
              <div className="p-2   overflow-hidden">
                <Link to={`/course/selfpaced-course/${e.id}`}>
                  {" "}
                  <img className="rounded" src={e.image} alt="" />
                </Link>
              </div>
              <h2 className="text-lg font-medium">{e.title}</h2>
              <Link key={e.id} to={`/course/selfpaced-course/${e.id}`}>
                {" "}
                <button className="bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-lg text-white rounded p-3 hover:bg-blue-600">
                  Learn Now
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ********************************************************************************************** */}
      <div className=" md:px-10, p-4 max-w-screen-2xl mx-auto  ">
        <div className="bg-[#F7F4FD] rounded-xl rounded-bl-[90px] md:p-9 px-4 py-9">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-1/4 w-1/2 ml-10 ">
              <img
                className="rounded-full "
                src={mobile}
                alt=""
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="sm:text-3xl text-2xl font-bold font-headingFont ">
                Flexiblity
              </h2>
              <p className="text-lg font-medium py-3">
                Study at your own pace and on your own schedule, Access all your
                materials in one place, anytime you need them, and Utilize your
                time effectively by accessing learning resources on-the-go.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SelfPacedCourses;
