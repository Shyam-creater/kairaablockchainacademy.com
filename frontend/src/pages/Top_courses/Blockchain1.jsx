import React,{useState} from "react";
import { Link } from "react-router-dom";
import Blockchain from "../../assets/blockchainview.jpg";
import { FaLinkedin } from "react-icons/fa";
import Certificate from "../../assets/online-certification.avif";
import skill from "../../assets/skills.png";
import Header from "../../components/Header";
import { PiNotePencilDuotone } from "react-icons/pi";
import Heading from "../../components/Heading";
function InternshipProgram() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <>
     <Heading title="Blockchain Internship Program | Kairaa Blockchain Academy" description="Join Kairaa Blockchain Academy's internship program and gain hands-on experience in blockchain, Web3, and crypto technologies. Boost your career with real-world skills." keywords="Blockchain internship, Web3 internship, Crypto internship, Blockchain training, Internship in blockchain India, Kairaa internship program, Tech internship Coimbatore" />
    <Header 
    open={open}
    setOpen={setOpen}
    activeItem={activeItem}
    setRoute={setRoute}
    route={route}
    />
      <div className="px-10 py-10 mx-auto container max-w-screen-2xl mt-10 animate-fadeInUp">
        <div className="bg-[#F7F4FD] rounded-xl rounded-br-[80px] ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/5 p-10">
              <h2 className="sm:text-4xl md:text-5xl font-headingFont  xs:text-3xl text-black font-bold mb-5 ">
                Internship Program
              </h2>
              <div className="md:py-3 xs:py-1">
                <Link to="/course-registration">
                  <button className="p-3 bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-black rounded-2xl text-lg shadow-2xl shadow-black animate-shake hover:bg-blue-300">
                    Get Started
                  </button>
                </Link>
              </div>{" "}
            </div>

            <div className="md:w-1/4 md:p-1 xs:p-10 ">
              <img className="rounded-2xl" src={Blockchain} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* ******************************************************** */}
      <div className="mx-auto container  justify-between ">
        <div className="justify-center mx-10 items-center flex md:flex-row gap-6 py-3 flex-col">
          <div className="md:w-1/2 animate-fadeInRight">
            <h2 className="md:text-2xl xs:text-xl font-bold font-headingFont py-2">
              About The Program
            </h2>
            <p className="text-lg">
              Kairaa Blockchain Academy is inviting applications for the
              Blockchain Development and Internship Program.This Internship
              Program and It's Availability Both Online and Offline Mode.
            </p>

            <h2 className="md:text-2xl xs:text-xl font-headingFont font-bold py-3 mb-2">
              Details to know
            </h2>
            <div className="flex justify-between gap-5">
              <div className="gap-2">
                <p className="text-xl font-bold">
                  <span>
                    <FaLinkedin size={25} />
                  </span>
                  Shareable certificate
                </p>
                <p className="text-lg">Add to your LinkedIn profile</p>
              </div>

              <div>
                <p className="text-xl font-bold">
                  <span>
                    <PiNotePencilDuotone size={25} />
                  </span>
                  Assessments
                </p>
                <p className="text-lg">20 quizzes</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 animate-fadeInLeft">
            <div className="">
              <h2 className="md:text-2xl xs:text-xl font-headingFont font-bold py-2">
                Internship Online&Offline
              </h2>
              <p className="text-lg">
                Blockchain technology can enhance the educational experience by
                providing secure, efficient, and accessible learning
                opportunities, while offering verifiable credentials and
                streamlined processes.
              </p>
            </div>

            <div className="py-2 text-lg pt-2 font-medium">
              <p className="">
                <span className="mr-2 ml-1">✿</span>Beginner level
              </p>
              <p className="">
                <span className="mr-2 ml-1">✿</span>Recommended experience
              </p>

              <p className="">
                <span className="mr-2 ml-1">✿ Duration:</span> 1 to 3 months.
              </p>

              {/* <p className=''><span className='mr-2 ml-1'>✿</span>Flexible schedule</p>
                        <p className=''><span className='mr-2 ml-1'>✿</span>Learn at your own pace</p>
                     */}
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* ************************************************************* */}
      <div className="container gap-3 mx-auto py-4 animate-fadeInLeft">
        <div className="justify-center mx-10 items-center flex md:flex-row gap-6 py-3 flex-col">
          <div className="md:w-1/2 leading-10 py-4 ">
            <h2 className="md:text-2xl xs:text-xl font-bold font-headingFont  py-2">
              Build your subject-matter expertise
            </h2>
            <p className="text-lg ">
              This course is part of the Blockchain Specialization When you
              enroll in this course, you'll also be enrolled in this
              Specialization.
            </p>
            <ul className="font-medium text-lg leading-8 py-4">
              <li>Learn new concepts from industry experts</li>
              <li>Gain a foundational understanding of a subject or tool</li>
              <li>Develop job-relevant skills with hands-on projects</li>
              <li>Earn a shareable career certificate</li>
            </ul>
          </div>
          <div className="md:w-1/2 p-3 py-8">
            <img src={skill} className="rounded-xl" alt="" />
          </div>
        </div>
      </div>
      {/* *********************************************************************** */}
      <div className="mx-auto container">
        <div className="mx-10 flex flex-col md:flex-row justify-between items-center">
          <div className="">
            <h2 className="md:text-2xl xs:text-xl font-headingFont font-bold mb-2 py-2">
              Skills you'll gain
            </h2>
            <ul className="flex xs:flex-row flex-col gap-3">
              <li className="border-2 border-black p-2 rounded">Blockchain</li>
              <li className="border-2 border-black p-2 rounded">Ethereum</li>
              <li className="border-2 border-black p-2 rounded">
                Cryptography
              </li>
              <li className="border-2 border-black p-2 rounded">Bitcoin</li>
            </ul>
          </div>
          {/* <h2 className='md:text-3xl xs:text-xl font-bold py-2'>Who Is It For?</h2>
                <p className='text-lg'>The course is suitable for anyone interested in technology and have basic
                    knowledge of Javascript or HTML.</p> */}
        </div>{" "}
      </div>
      {/* ***************************************************************** */}
      <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-10 ">
        <div className="border-[#CADDFE] border-2 rounded-xl rounded-br-[80px] md:p-9 px-4 py-9">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/5">
              <h2 className="sm:text-4xl  md:text-3xl text-2xl font-headingFont text-black font-bold mb-5 ">
                Earn a career certificate
              </h2>
              <p className="text-lg">
                Add this credential to your LinkedIn profile, resume, or CV
                Share it on social media and in your performance review
              </p>
            </div>

            <div className="md:w-1/4 w-1/2">
              <img className="rounded" src={Certificate} alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* **************************************************** */}
    </>
  );
}

export default InternshipProgram;
