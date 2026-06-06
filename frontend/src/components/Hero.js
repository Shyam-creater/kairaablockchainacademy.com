import React from "react";


import image from "../carouselimages/newBanner1.png";
import aboutImg from "../carouselimages/newblock.png";
import block1 from "../carouselimages/001-blockchain.png";
import block2 from "../carouselimages/002-blockchain-1.png";
import block3 from "../carouselimages/003-online-course.png";
import block4 from "../carouselimages/technology.png";
import { Link } from "react-router-dom";


import icon1 from "../assets/HomeBlock1.png";
import icon2 from "../assets/HomeProffessional.png";
import icon4 from "../assets/HomeExpert.png";
import icon5 from "../assets/HomeSolidity.png";
import icon6 from "../assets/HomeTrainer.png";
import icon7 from "../assets/HomeC1.png";
import image1 from "../assets/whychoose2.png";
import image2 from "../assets/whychoose3.png";
import image3 from "../assets/whychoose5.webp";
import image4 from "../assets/whychoose4.png";
const Hero = () => {
  const data1 = [
    {
      id: 1,
      image: icon1,
      title: "Blockchain Developer Fundamental Course",
    },
    {
      id: 2,
      image: icon2,
      title: "Blockchain Developer Professional Course",
    },


    {
      id: 3,
      image: icon4,
      title: "Blockchain Developer Expert Course",
    },
    {
      id: 4,
      image: icon5,
      title: "Solidity for Smart Programming",
    },
    {
      id: 5,
      image: icon6,
      title: "Certified Blockchain Trainer Online Course",
    },
    {
      id: 6,
      image: icon7,
      title: "C programming Language Online Course ",
    },
     ];


  const info = [
    {
      id: 1,
      img: block1,
      link: "/course/blockchain",
      heading: "Master Blockchain & Unlock Your Potential",
      para: "Blockchain is rapidly changing the game. Get the skills you need with us to achieve your goals and stay ahead of the curve.",
    },
    {
      id: 2,
      img: block2,
      link: "/course/internship-program",
      heading: "Internship Opportunities in Blockchain",
      para: "Gain Blockchain Skills and expertise. Unlock the opportunities to work on live projects. Don't miss out on this valuable opportunity!",
    },
    {
      id: 3,
      img: block3,
      link: "/course/othercourse",
      heading: "Learn in-demand tech skills from industry experts",
      para: "We provide comprehensive online courses on popular programming languages such as Python, JavaScript, Java, C++, etc.",
    },
    {
      id: 4,
      img: block4,
      link: "/course/bootcamp",
      heading: "Blockchain Developer Bootcamp",
      para: "This intensive training program equips participants with skills and knowledge needed to become blockchain developer.",
    },
  ];


  const borderStyle = {
    width: "150px",
    height: "60px",
    backgroundColor: "#ffffff",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 2px 5px -1px",
    borderRadius: "100px",
    overflow: "hidden",
    position: "relative",
  };


  const gradientBorderStyle = {
    width: "200px",
    height: "40px",
    background: "linear-gradient(45deg, #e94cdc, #4c28e4)",
    animationName: "rotate",
    animationDuration: "5s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  };
  const button = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "140px",
    height: "50px",
    border: "2px",
    borderColor: "blue",
    borderRadius: "100px",
    backgroundColor: "#fff",
  };


  const data2 = [
    {
      id: 1,
      image: image1,
      content: "Live Project",
    },
    {
      id: 2,
      image: image2,
      content: "Global Certification",
    },
    {
      id: 3,
      image: image3,
      content: "Professional Grooming",
    },
    {
      id: 4,
      image: image4,
      content: "100% Assured Job",
    },
  ];


  return (
    <>
      {/* 3 divs md:w-[20vw]  md:h-[550px] */}


      <div className="items-center flex md:mx-10 xs:mx-10">
        <div className="md:flex-row flex  flex-col gap-10 justify-center md:m-24  m-10">
          {info.map((dt) => {
            return (
              <div className="box border-2 border-blue-400 w-70 p-2 h-100  rounded-2xl  ">
                <img src={dt.img} alt={dt.heading} className="w-28 h-28" />
                <h2 className="md:text-xl text-lg font-bold p-2  font-headingFont">
                  {dt.heading}
                </h2>
                <hr />
                <p className="text-lg p-4 font-paraFont">{dt.para}</p>
                <Link to={dt.link}>
                  {" "}
                  <p className="md:text-lg  font-bold p-4  font-paraFont">
                    Learn More
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>


      {/* about */}
      <div className="justify-center items-center mx-10 my-10 flex">
        <div className="flex flex-col xs:flex-col-reverse gap-6 md:flex-row justify-center items-center">
          <div className="md:w-1/3 xs:mx-20">
            <img alt="about" className=" animate-shake" src={image} />
          </div>


          <div className="md:w-1/2  p-5">
            <h2 className="md:text-4xl text-xl md:leading-10 leading-7 font-bold  font-headingFont ">
              Welcome to{" "}
              <span className="text-gradient">Kairaa Blockchain Academy</span>
            </h2>
            <p className="md:text-xl md:leading-10 leading-7 py-3  font-paraFont font-medium ">
              Kairaa Blockchain is an Online Learning and Development Academy
              based in Coimbatore, Tamilnadu, founded in 2023. The company, led
              by a team of professionals, aims to empower college graduates and
              corporate employees with essential Technical, Communication, and
              Leadership skills to enhance employability and readiness for the
              industry. With a focus on practical, hands-on learning and
              mentorship from experienced professionals, we strive to not just
              educate, but to inspire and empower the leaders of tomorrow.
            </p>
            <p className="text-xl font-paraFont font-semibold"></p>
            <Link to="/about-kairaa-blockchain-academy">
            <div className="justify-center items-center flex">
              <button className="hover:animate-wiggle hover:  text-white  w-fit md:px-6 md:py-3 px-2 py-1 my-5 md:text-lg text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer z-2 ">
                Get More Details
              </button></div>
            </Link>
          </div>
        </div>
      </div>


      {/* ****************************************************************************************** */}


      <div className=" flex-col justify-center text-center items-center ">
        <div className="text-center leading-7 m-4">
          <h2 className="md:text-4xl text-3xl font-headingFont font-bold xs:text-2xl py-3">
            Explore Our Courses
          </h2>
          <p className="fontstyle4">
            Choose the course that's right for your career goals.
          </p>
        </div>


        <div class="flex justify-center  items-center px-10 py-10 xs:px-20 xs:py-10">
          <div class="grid md:grid-cols-3 grid-cols-1 xs:grid-cols-2 gap-10 justify-center items-center text-center">
            {data1.map((e) => (
              <div
                key={e.id}
                className=" shadow-xl  bg-slate-100 rounded-2xl transition-transform duration-1000 ease-in-out hover:scale-110"
              >
                <div className="  group-hover:filter  overflow-hidden">
                  <Link to={`/course/selfpaced-course/${e.id}`}>
                    {" "}
                    <img className="rounded-t-2xl " src={e.image} alt="" />
                  </Link>
                </div>
                <div className="bg-gradient-to-r shadow-inner shadow-black from-cyan-500 to-[#CB77F7] rounded   p-5">
                  <h2 className="xs:text-xl text-[#fff] font-bold">{e.title}</h2>
                </div>
                <div style={borderStyle} className="  my-5  mx-auto ">
                  <div
                    style={gradientBorderStyle}
                    className="borderbutton"
                  ></div>
                  <Link key={e.id} to={`/course/selfpaced-course/${e.id}`}>
                    {" "}
                    <button style={button} className="text-lg font-bold">
                      Learn more
                    </button>
                  </Link>
                </div>
                <style>
                  {`
                                    @keyframes rotate {
                                    from {
                                    transform: rotate(0deg);
                                    }
                                     to {
                                       transform: rotate(360deg);
                                       }
                                     }
                                    `}
                </style>
              </div>
            ))}
          </div>
        </div>
        {/* ************************ */}
        <div className="text-center mx-auto container   justify-center m-5 items-center flex">
          <Link to="/course/selfpaced-course">
            <button class="relative border-2 border-emerald-200  bg-gradient-to-r from-cyan-500 to-[#CB77F7] duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-56 rounded rounded-bl-[90px] rounded-tr-[90px] hover:bg-sky-800 p-2 flex justify-center items-center font-extrabold">
              <div class="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-75"></div>
              <div class="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-100"></div>
              <div class="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-150"></div>
              <div class="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-200"></div>
              <div class="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out  delay-150 group-hover:delay-300"></div>
              <p class="z-10">Explore More</p>
            </button>
          </Link>
        </div>
      </div>
      <div className="text-center justify-center items-center md:mx-10 xs:mx-10 xs:mt-10 md:mt-20 my5 xs:mb-10 md:mb-20">
        {/* <div className='bg-gradient-to-r p-2 w-80 h-auto py-5 mt-10 mx-auto container text-center md:text-3xl xs:text-xl font-bold from-cyan-500 to-[#CB77F7] rounded-xl rounded-bl-[90px] rounded-tr-[90px]'> */}
        <h2 className="md:text-4xl text-3xl font-headingFont font-bold xs:text-2xl ">
          Why choose us?
        </h2>
        {/* </div> */}
        <div className="grid md:grid-cols-4  grid-cols-1 my-9 mx-10  gap-4 xs:grid-cols-2">
          {data2.map((e) => {
            return (
              <>
                <div className="text-center ">
                  <img src={e.image} className=" xs:w-[700px] xs:h-[200px] " />
                  <p className="bg-gradient-to-r from-cyan-400 shadow-inner shadow-black text-[#fff] to-[#ce92ef] p-5 rounded-b-2xl md:text-lg font-medium">
                    {e.content}
                  </p>
                </div>{" "}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};


export default Hero;



