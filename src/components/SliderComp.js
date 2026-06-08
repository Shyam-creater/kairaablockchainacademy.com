import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import aboutImg from "../carouselimages/newblock.png";
import secondImg from "../carouselimages/layer.png";
import thirdImg from "../assets/third.png";
import {Link} from "react-router-dom";

const SliderComp = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 900,
    autoplaySpeed: 4000,
    cssEase: "linear",
  };

  return (
    <>
  
      <div className="slider-container ">
      

        <Slider {...settings} className="">
          <div>
           
            <div className="flex h-[60vh] md:h-[80vh] lg:h-[60vh] bg-[#F7F4FD] items-center justify-center gap-4">
              <div className=" md:w-2/3 w-full px-8 text-center md:px-16 font-bold text-[#1C1678]  z-10 ">
                <h1 className="md:text-[40px] text-2xl font-headingFont  md:p-2 md:m-4 m-2 md:leading-[60px]">
                  Discover Blockchain Technology with
                  <span className="px-3 text-gradient">
                    Kairaa Blockchain Academy&#x27;s
                  </span>{" "}
                  Online Course.
                </h1>
                <p className=" font-medium  m-4 md:text-2xl text-xl font-paraFont ">
                  Kairaa Blockchain Academy is a leading online platform
                  specializing in blockchain education.
                </p>
                <Link to="/course/selfpaced-course">
                <button   className="  text-white w-fit md:px-6 md:py-3 p-2 my-2 md:text-xl text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer z-20 hover:scale-110 duration-300">
                  Get Started
                </button>
                </Link>
              </div>
              <div className="w-1/2  z-10 hidden md:block">
                <img
                  alt="banner"
                  className="w-[400px] h-[400px]"
                  src={aboutImg}
                />
              </div>

              <div></div>
            </div>
          </div>
          <div>
            <div className="flex h-[60vh] md:h-[80vh] lg:h-[60vh] bg-[#F7F4FD] items-center justify-center">
              <div className=" md:w-2/3 w-full px-8 text-center md:px-16 font-bold text-[#1C1678]  z-10 ">
                <h1 className="md:text-[40px] text-2xl font-headingFont md:p-4 md:m-4 m-2 md:leading-[60px]">
                  Enroll in
                  <span className="px-3 text-gradient">
                    Kairaa Blockchain Academy&#x27;s
                  </span>
                  Internship Program and Advance Your Career.
                </h1>
                <p className=" font-medium  m-4 md:text-2xl text-xl font-paraFont">
                  Kairaa Blockchain Academy is a leading online platform
                  specializing in blockchain education.
                </p>
                <Link to="/course/selfpaced-course">
                <button   className="  text-white w-fit md:px-6 md:py-3 p-2 my-2 md:text-xl text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer z-20 hover:scale-110 duration-300">
                  Get Started
                </button>
                </Link>
              </div>
              <div className="w-1/2 z-10 hidden md:block">
                <img
                  alt="banner"
                  className="w-[600px] h-[400px] pr-12"
                  src={secondImg}
                />
              </div>

              <div></div>
            </div>
          </div>

          <div>
            <div className="flex h-[60vh] md:h-[80vh] lg:h-[60vh] bg-[#F7F4FD] items-center justify-center">
              <div className=" md:w-2/3 w-full px-8 text-center md:px-16 font-bold text-[#1C1678]  z-10 ">
                <h1 className="md:text-[40px] text-2xl font-headingFont md:p-4 md:m-4 m-2 md:leading-[60px]">
                  Learn in-demand tech skills and tap into the{" "}
                  <span className="px-3 text-gradient">
                    power of the latest technologies.
                  </span>
                </h1>
                <p className=" font-medium  m-4 md:text-2xl text-xl font-paraFont">
                  Kairaa Blockchain Academy is a leading online platform
                  specializing in blockchain education.
                </p>
                <Link to="/course/selfpaced-course">
                <button   className="  text-white w-fit md:px-6 md:py-3 p-2 my-2 md:text-xl text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer z-20 hover:scale-110 duration-300">
                  Get Started
                </button>
                </Link>
              </div>
              <div className="w-1/2  z-10 hidden md:block">
                <img
                  alt="banner"
                  className="w-[400px] h-[400px]"
                  src={thirdImg}
                />
              </div>

              <div></div>
            </div>
          </div>
        </Slider>
      </div>
    </>
  );
};
export default SliderComp;
