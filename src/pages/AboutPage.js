import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "../carouselimages/blockchainbanner.png";
import Mission from "../assets/mission3.jpg";
import Vision from "../assets/vision2.png";
import Header from "../components/Header";
import star from "../carouselimages/element-02.png";
import backgroundImg from "../carouselimages/backgroundimg.png";
import "../pages/Contact.css";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { branchDetails } from "../utils/branchDetails";

const AboutPage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState("Login");

  const info = [
    {
      id: 1,
      heading: "Language Inclusivity",
      para: "We offer courses in Tamil, breaking down language barriers and making tech education more accessible to a wider audience.",
    },
    {
      id: 2,
      heading: "Practical Learning Approach",
      para: "Our curriculum is designed with a practical approach, allowing students to learn by doing and gain hands-on experience.",
    },
    {
      id: 3,
      heading: "Wide Range of Courses",
      para: "We offer a variety of courses on popular programming languages such as Python, JavaScript, Java, and C++, catering to all levels of expertise.",
    },
    {
      id: 4,
      heading: "Experienced Instructors",
      para: "Our instructors are industry professionals with years of experience, providing students with insights into real-world applications of their learning.",
    },
    {
      id: 5,
      heading: "Community Support",
      para: "We foster a supportive and collaborative learning environment, encouraging students to learn from each other and grow together.",
    },
  ];

  

  const section3 = [
    {
      id: 1,
      paragraph:
        " At Kairaa Blockchain Academy, we believe in the power of technology and the importance of making it accessible to everyone. We are proud to offer a range of courses on programming languages, all taught in Tamil.",
    },
    {
      id: 2,
      paragraph:
        " Our mission is to break down language barriers in tech education and empower our students to gain the skills they need to succeed in the rapidly evolving tech industry. We understand that learning in one’s native language can make complex concepts more digestible and enjoyable.",
    },
    {
      id: 3,
      paragraph:
        "Our curriculum includes courses on popular programming languages such as Python, JavaScript, Java, and C++, among others. Each course is designed with a practical approach, allowing students to learn by doing. ",
    },
    {
      id: 4,
      paragraph:
        " Whether you are a beginner looking to start your coding journey or an experienced programmer aiming to enhance your skills, our courses cater to all levels of expertise.",
    },
    {
      id: 5,
      paragraph:
        "Join us at Kairaa Blockchain Academy and take the first step towards a promising career in technology, all in the comfort of your mother tongue, Tamil. Let’s code தமிழில்!",
    },
  ];
  return (
    <>
      <Heading
        title="About Kairaa Blockchain Academy | Kairaa Blockchain Academy"
        description="Discover the story behind Kairaa Blockchain Academy. Explore our courses on blockchain, smart contracts, and cryptocurrency and advance your career."
        keywords="blockchain course, blockchain certification, blockchain academy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      {/* section1 */}

      <div className="flex gap-8 md:px-24 px:8 md:py-12 py-8 flex-col xs:flex-row items-center bg-[#F7F4FD]">
        <div className="w-5/6">
          {" "}
          <img src={Image} alt="" />
        </div>
        <div className="flex flex-col gap-4 w-5/6  leading-10 text-md font-medium items-center   font-paraFont ">
          <h1 className="leading-10 font-bold xs:text-3xl text-xl   text-[#15265D] font-headingFont">
            Kairaa Blockchain Academy
            <span className="text-gradient text-center">
              {" "}
              Your Gateway to Blockchain Mastery
            </span>
          </h1>

          <p className="md:text-xl xs:text-lg xs:leading-10 md:leading-10">
            Kairaa Blockchain is an Online Learning and Development Academy
            based in Coimbatore, Tamilnadu, founded in 2023. The company, led by
            a team of professionals, aims to empower college graduates and
            corporate employees with essential Technical, Communication, and
            Leadership skills to enhance employability and readiness for the
            industry. With a focus on practical, hands-on learning and
            mentorship from experienced professionals, we strive to not just
            educate, but to inspire and empower the leaders of tomorrow.
          </p>
          <p className="md:text-xl xs:text-lg leading-10">
            We guarantee to unlock the full potential of your skills, paving a
            path towards success.
          </p>

          <button className="text-white w-fit md:px-6 px-2 md:py-3 py-2 my-2 text-2xl rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7]  animate-shake cursor-pointer ">
            Explore Courses
          </button>
        </div>
      </div>

      {/* section2 */}
      <div className="md:px-12 p-4 max-w-screen-2xl  mx-auto mt-5 animate-fadeInUp ">
        <div className="rounded-xl rounded-br-[80px] md:p-9 px-10 py-10">
          <div className="flex flex-col-reverse xs:mx-10 xs:flex-row md:flex-row justify-around items-center gap-10">
            <div className="xs:w-1/2">
              <h2 className="font-bold  md:text-3xl text-xl font-headingFont py-4">
                OUR <span className="text-gradient">VISION</span>
              </h2>
              <p className="  md:text-xl leading-10  md:leading-10">
                To be a leading force in shaping a blockchain-powered world
                through education and innovation. By fostering a deep
                understanding of blockchain technology and driving
                groundbreaking advancements, we aim to empower individuals and
                organizations to harness its full potential for transformative
                impact.
              </p>
            </div>

            <div className="md:w-1/3 w-full">
              <img src={Vision} alt="" className=" rounded-xl object-fit " />
            </div>
          </div>

          <div className="flex  flex-col xs:mx-10 xs:flex-row md:flex-row justify-around items-center gap-10">
            <div className="xs:w-1/3">
              <img src={Mission} alt=" " className="rounded-3xl object-fit " />
            </div>
            <div className="xs:w-1/2">
              <h2 className="font-bold  md:text-3xl text-xl font-headingFont py-4">
                OUR <span className="text-gradient">MISSION</span>
              </h2>
              <p className="  md:text-xl leading-10 md:leading-10">
                To bridge the knowledge gap in blockchain technology by offering
                high-quality, industry-relevant education to a global audience.
                Through innovative learning experiences and expert-led courses,
                we aim to equip individuals with the skills and insights needed
                to excel in the evolving blockchain landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* section3 */}

      <div className="flex gap-8 xs:px-24 px-8 md:py-12 py-8  md:flex-row items-center bg-[#F7F4FD]">
        <div className="flex flex-col gap-4 md:w-3/3 w-full text-md font-medium items-center md:text-xl text-lg md:px-8 font-paraFont leading-10 text-center">
          <h1 className=" font-bold md:text-3xl text-xl text-center text-[#15265D] font-headingFont md:p-4">
            Learn in-demand{" "}
            <span className="font-extrabold text-gradient">tech skills</span>
          </h1>

          {section3.map((e) => (
            <p className="leading-10">{e.paragraph}</p>
          ))}

          <Link to="/course/othercourse">
            <button className="text-white w-fit px-6 py-3 my-2 text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7]  cursor-pointer ">
              Explore Courses
            </button>
          </Link>
        </div>
      </div>

      {/* section 4 */}

      <div className="flex gap-8 xs:px-24 md:py-12 px-5 flex-col md:flex-row items-center ">
        <div className="w-3/6">
          {" "}
          <img
            src={backgroundImg}
            alt=""
            className="hover:rotate-45 animate-spin "
          />
        </div>
        <div className="flex flex-col gap-4 md:w-5/6 w-full  font-medium items-center md:text-2xl px-8 font-paraFont">
          <h1 className=" font-bold md:text-3xl text-2xl text-center text-[#15265D] font-headingFont">
            What sets{" "}
            <span className="text-gradient">Kairaa Blockchain Academy</span>{" "}
            apart?
          </h1>

          <div>
            {info.map((e) => {
              return (
                <div className="flex gap-2 py-4">
                  <img src={star} alt=" " className="w-6 h-6" />{" "}
                  <p className="xs:text-xl leading-10">
                    <span className="text-gradient text-xl font-bold pr-2">
                      {e.heading} :
                    </span>
                    {e.para}
                  </p>
                </div>
              );
            })}
          </div>

          <Link to="/course/blockchain">
            <button className="text-white w-fit px-6 py-3 my-2 text-xl hover:animate-wiggle rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7]  cursor-pointer">
              Know More
            </button>
          </Link>
        </div>
      </div>

      {/* section5 */}
      <div className="mt-6 text-center justify-center items-center flex">
        <div className="section4 min-h-full xs:p-5 h-fit md:w-screen  md:h-[700px] justify-center bg-gradient-to-r from-cyan-500 to-[#CB77F7]  relative">
          <div className="text-[#15265D]">
            <h2 className="md:text-3xl px-2 font-headingFont text-xl font-bold text-center text-gray-900">
              OUR BRANCHES AROUND
              <span className="text-[#fff]"> INDIA</span>
            </h2>
            <p className="md:text-xl text-lg font-medium line-clamp-3 p-4 text-center text-black py-2">
              Embark on an exciting journey with Kairaa Blockchain Academy,
              nestled in dynamic cities across India!
            </p>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 items-center justify-center mb-36">
              {branchDetails.map((details, i) => {
                return (
                  <div
                    key={details.id}
                    className="p-5 flex flex-col text-center"
                  >
                    <h3 className="font-bold md:text-2xl text-lg text-[whitesmoke]">
                      {details.city}
                    </h3>
                    <p className="font-medium text-black text-lg">
                      {details.address}
                    </p>
                  </div>
                );
              })}
            </div>




            <div className="air air1"></div>
            <div className="air air2"></div>
            <div className="air air3"></div>
            <div className="air air4"></div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;
