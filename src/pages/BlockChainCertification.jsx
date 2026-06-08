import React,{useState} from "react";
import Certificate from "../assets/online-certification.avif";
import Herocertificate1 from "../assets/sideimageforcertificate.png";
import { Link } from "react-router-dom";
import side1 from "../assets/blueblueblock.png";
import side2 from "../assets/Success-factors.png";
import "../pages/Bootcamp.css";
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
      heading1: " ABOUT THE PROGRAM",
      paragraph:
        "Certification of Blockchain Development Program offers the blockchain developers an exciting opportunity to work with the Research & Development Engineers and Scientists of Kairaa Blockchain Academy on its live Blockchain projects. The program will help the Blockchain Developers to apply their theoretical and practical knowledge and gain real project exposure to all facets of Blockchain development activities.",
      heading2: " WHO IS IT FOR ?",
      paragraph2:
        " Certification of Blockchain Devlopment Program is open to candidates who’ve completed the Blockchain Development Online Courses(instructor-led/Self-paced) from Kairaa Blockchain Academy. The certification of Blockchain program will offer a platform for certified blockchain developers to apply their gained subject knowledge in making important decisions concerning the blockchain project they are working on.",
      heading3: " WHAT YOU WILL LEARN...",
      heading3List: [
        " Conceptual view to frame high-level blockchain architecture.",
        " Knowledge of designing blockchain-based solutions with best practices.",
        "Knowledge of security considerations and risks for blockchain integration.",
        " Understanding of integrating external services with blockchain architecture.",
      ],
    },
  ];

  const section3 = [
    {
      id: 1,
      heading: " DURATION, MODE OF DELIVERY",
      paragraph:
        "After successfully finishing the Blockchain Development online courses, You will be awarded a certificate of completion. This certificate serves as tangible proof of Your dedication, commitment, and newly acquired skills in the specific subject matter covered by the course. It signifies the culmination of their efforts in engaging with course materials, completing assignments, and mastering the concepts presented. The candidates will be assigned to a mentor throughout the duration.",
    },
  ];
  const section4 = [
    {
      id: 1,
      heading: " CERTIFICATION",
      paragraph:
        "Upon completing the live project training, The students are to submit an internship report to the mentor. The Blockchain Courses of certificate will be awarded based on the candidate’s performance during the internship.",
    },
  ];
  return (
    <>
     <Heading title="Blockchain Course | Kairaa Blockchain Academy" description="Learn blockchain technology with Kairaa Blockchain Academy's complete course. Here you can learn blockchain from fundamentals to expert level." keywords="blockchain course, blockchain certification, blockchain academy" />
    <Header 
    open={open}
    setOpen={setOpen}
    activeItem={activeItem}
    setRoute={setRoute}
    route={route}
    />
      <div className="md:px-12 p-2 max-w-screen-2xl  mx-auto mt-10   ">
        <div className=" rounded-xl bg-[#F7F4FD] ripple-background relative overflow-hidden rounded-br-[80px] md:p-9 px-4 ">
          <div className="text-center flex md:flex-row xs:flex-col items-center gap-10 ">
            <div className="text-center">
              <div className="circle xxlarge shade1 ml-50 "> </div>
              <div className=" circle xlarge shade2 ml-50 "></div>
              <div className=" circle large shade3 ml-50 "></div>
              <div className="circle mediun shade4 ml-50 "></div>
              <div className="circle small shade5 ml-50 "></div>
              <div className="flex justify-center items-center ">
                <div className="md:w-3/9">
                  <h2 className="sm:text-4xl md:text-[42px] p-5 text-xl font-headingFont font-bold">
                    Certification of Blockchain Development.
                  </h2>
                </div>
                <div className="md:w-1/4">
                  <img className="rounded-2xl" src={Herocertificate1} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ****************************************************************************** */}
      {section2.map((e) => {
        return (
          <>
            <div className=" mx-auto container py-3">
              <div className="mx-10">
                <h2 className="md:text-xl font-headingFont xs:text-lg font-bold py-3">
                  {e.heading1}
                </h2>
                <p className="text-lg">{e.paragraph}</p>
              </div>
              <div className="mx-auto">
                <div className="md:flex-row mx-10 flex flex-col py-3 leading-10">
                  <div className="md:w-1/2 mb-2 leading-10">
                    <h2 className="md:text-xl font-headingFont xs:text-lg font-bold py-3">
                      {e.heading2}
                    </h2>
                    <p className="text-lg mb-2">{e.paragraph2}</p>

                    <h2 className="md:text-xl font-headingFont xs:lg font-bold py-3 ">
                      {e.heading3}
                    </h2>
                    <ul className="list-disc text-lg">
                      {e.heading3List.map((e1) => (
                        <li>{e1}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/2  shadow-[#e1ffe1cc] ">
                    <img src={side1} alt="" className="" />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
      {/* ****************************************************************************** */}
      {section3.map((e) => {
        return (
          <>
            {" "}
            <div className="mx-auto container flex xs:flex-row flex-col-reverse">
              <div className="md:w-1/2 ">
                <img alt="" src={side2} />
              </div>
              <div className="md:w-3/4 p-14">
                <h2 className="md:text-xl font-headingFont xs:lg font-bold py-3">
                  {e.heading}
                </h2>
                <p className="text-lg">{e.paragraph}</p>
              </div>
            </div>
          </>
        );
      })}
      {/* ******************************************************************************* */}
      {section4.map((e) => {
        return (
          <>
            {" "}
            <div className="bg-[#F7F4FD] p-5 leading-10 m-10 rounded-xl flex md:flex-row flex-col-reverse border-l-2 border-b-gray-300">
              <div className=" container p-2 mx-auto">
                <h2 className="md:text-xl font-headingFont py-2 xs:text-lg font-bold">
                  {e.heading}
                </h2>
                <p className="text-lg">{e.paragraph}</p>
                <div className="py-3">
                  <Link to="/course-registration">
                    {" "}
                    <button className="p-3 hover:bg-[#fff] text-white py-3 font-medium hover:animate-wiggle rounded-2xl text-lg bg-gradient-to-r from-cyan-500 to-[#CB77F7]">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
              <div className="xs:w-1/4 w-full px-4  mx-auto">
                <img className="rounded-2xl" src={Certificate} alt="" />
              </div>
            </div>
          </>
        );
      })}
      <Footer/>
    </>
  );
}

export default BlockChainCertification;
