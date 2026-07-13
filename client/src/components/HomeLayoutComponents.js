import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLaptopCode, FaBookOpen, FaUserTie, FaArrowRight, FaCertificate, FaGraduationCap } from "react-icons/fa";

// Images from existing assets
import heroBg from "../carouselimages/newBanner1.png";
import infoBg from "../assets/whychoose2.png";
import block1 from "../carouselimages/001-blockchain.png";
import block2 from "../carouselimages/002-blockchain-1.png";
import block3 from "../carouselimages/003-online-course.png";

// Add missing imports for course images
import icon1 from "../assets/HomeBlock1.png";
import icon2 from "../assets/HomeProffessional.png";
import icon4 from "../assets/HomeExpert.png";
import icon5 from "../assets/HomeSolidity.png";
import icon6 from "../assets/HomeTrainer.png";
import icon7 from "../assets/HomeC1.png";

// New hero images
import slide1Img from "../assets/HomeC1.png";
import slide2Img from "../assets/HomeC1.png";
import block4 from "../carouselimages/technology.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMapPin, FiPhoneCall, FiMail } from "react-icons/fi";

// Add these imports at the top
import secondImg from "../carouselimages/layer.png";
import thirdImg from "../assets/third.png";

import slide1 from "../assets/slide1.mp4";
import slide2 from "../assets/slide1.mp4";
import slide3 from "../assets/slide1.mp4";
// Custom Arrows
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white text-white hover:text-[#1C1678] w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg"
  >
    <FaChevronLeft size={20} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white text-white hover:text-[#1C1678] w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg"
  >
    <FaChevronRight size={20} />
  </button>
);

export const ProvettaHero = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: dots => (
      <div style={{ position: "absolute", bottom: "20px" }}>
        <ul className="m-0 p-0 flex justify-center space-x-2"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2 h-2 bg-white rounded-full opacity-50 hover:opacity-100 transition duration-300"></div>
    )
  };

  return (
    <div className="w-full h-[600px] bg-gray-100 overflow-hidden relative">
      {/* Global CSS for slick active dots */}
      <style>{`
        .slick-dots li.slick-active div { opacity: 1; transform: scale(1.2); background-color: #ffffff; }
      `}</style>

      <Slider {...settings} className="w-full h-full">

        {/* Slide 1: Hexagon Layout */}
        <div className="w-full h-[600px] focus:outline-none relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              className="w-full h-full object-cover scale-[1.25]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={slide1} type="video/mp4" />
            </video>
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"></div>

            {/* Optional Glow Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 30%)",
              }}
            />
          </div>
          <div className="container mx-auto px-16 md:px-24 relative z-10 h-full flex flex-col md:flex-row items-center justify-between">
            <div className="text-white md:w-1/2 pt-20 md:pt-0 space-y-6">
              <p className="text-sm font-semibold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 inline-block">
                Excellence, Dedicated, and Experienced Academy!
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-headingFont whitespace-pre-line block">
                Welcome to <br /> Kairaa Blockchain Academy!
              </h1>
              <p className="text-lg font-paraFont max-w-lg block">
                Kairaa Blockchain Academy is a leading online platform specializing in blockchain education.
              </p>
              <div className="flex space-x-4 pt-4">
                <Link to="/course/blockchain">
                  <button className="bg-white text-[#1C1678] font-bold py-3 px-6 rounded hover:bg-gray-100 flex items-center transition">
                    Explore Courses <FaArrowRight className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex md:w-1/2 relative justify-center h-[400px] items-center">
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 -translate-y-20 -translate-x-24 z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaLaptopCode className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Live Projects</span>
              </div>
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 -translate-y-20 translate-x-24 z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaCertificate className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Global Certification</span>
              </div>
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 translate-y-24 z-20" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaUserTie className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Professional Grooming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2: Image Right Layout */}
        <div className="w-full h-[600px] focus:outline-none relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://media.istockphoto.com/id/640964810/video/late-at-night-in-the-engineering-bureau-female-designer-works-on-a-personal-computer-that.mp4?s=mp4-640x640-is&k=20&c=KOsUjZb3Tm4e1K5qAvxh4X_aPeUqRH5zPNuziqM6oaY=" type="video/mp4" />
            </video>
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"></div>

            {/* Optional Glow Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 30%)",
              }}
            />
          </div>
          <div className="container mx-auto px-16 md:px-24 relative z-10 h-full flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="text-white md:w-1/2 pt-20 md:pt-0 space-y-6 md:pl-10">
              <p className="text-sm font-semibold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 inline-block">
                Learn from the Best in the Industry!
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-headingFont whitespace-pre-line block">
                Enroll in Our <br /> Internship Program!
              </h1>
              <p className="text-lg font-paraFont max-w-lg text-gray-300 block">
                Advance your career with hands-on experience. Work on live projects and get certified globally.
              </p>
              <div className="flex space-x-4 pt-4">
                <Link to="/course/internship-program">
                  <button className="bg-white text-[#1C1678] font-bold py-3 px-6 rounded hover:bg-gray-100 flex items-center transition">
                    Join Program <FaArrowRight className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex md:w-1/2 relative justify-center h-[400px] items-center">
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 -translate-y-20 -translate-x-24 z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaGraduationCap className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Mentorship</span>
              </div>
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 -translate-y-20 translate-x-24 z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaLaptopCode className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Hands-On</span>
              </div>
              <div className="absolute bg-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-4 text-center w-40 h-44 translate-y-24 z-20" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <FaCheckCircle className="text-4xl text-cyan-300 mb-2" />
                <span className="text-sm font-bold text-white">Job Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3: Center Text Layout */}
        <div className="w-full h-[600px] focus:outline-none relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://media.istockphoto.com/id/2197107553/video/futuristic-network-workflow-and-data-connection-diagram.mp4?s=mp4-640x640-is&k=20&c=z4xV3yVLPOglXKBsr0-o38_4JUY6lV4fUxsmkTK9VKY=" type="video/mp4" />
            </video>
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
          </div>
          <div className="container mx-auto px-16 md:px-24 relative z-10 h-full flex flex-col items-center justify-center text-center">
            <p className="text-sm font-semibold tracking-wider uppercase text-yellow-300 mb-4">
              Your Gateway to a Better Career!
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white font-headingFont mb-6">
              Learn In-Demand Tech Skills Today!
            </h1>
            <p className="text-lg md:text-xl font-paraFont max-w-2xl text-blue-100 mb-8">
              Tap into the power of the latest technologies. From Blockchain to Web3, we have you covered with expertly crafted curriculums.
            </p>
            <Link to="/course/selfpaced-course">
              <button className="bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition shadow-xl text-lg">
                Start Learning Now
              </button>
            </Link>
          </div>
        </div>

      </Slider>
    </div>
  );
};

export const ProvettaInfoSection = () => {
  return (
    <div className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16">

        {/* Left column */}
        <div className="lg:w-1/2 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="rounded-full bg-orange-100 p-8 flex items-center justify-center absolute -top-10 -left-10 w-40 h-40 -z-10"></div>
            <img src={infoBg} alt="Tech Skills" className="w-full rounded-2xl shadow-xl object-cover h-80" />
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white p-6 shadow-xl w-64 rounded-xl border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 leading-snug">
                A Trusted Academy Partner Providing You With High Quality Tech Skills!
              </h3>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <p className="text-gray-600">
              With a belief that knowledge is power, we connect our students directly with their results so they have valuable tech information when they need it most, care about our people and are committed to excellence in the work we do.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
                <FaCheckCircle className="text-blue-700 text-xl" />
                <span className="font-semibold text-gray-800">100% Assured Job Support</span>
              </div>
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
                <FaCheckCircle className="text-blue-700 text-xl" />
                <span className="font-semibold text-gray-800">Professional Grooming</span>
              </div>
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
                <FaCheckCircle className="text-blue-700 text-xl" />
                <span className="font-semibold text-gray-800">Global Certification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:w-1/2 text-center lg:text-left mb-10">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 font-headingFont">Providing the Diverse Needs of Your Tech Community</h2>
          <p className="text-gray-600 mt-4 text-lg">Find the Right Course for Your Needs!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
              <img src={block1} alt="Blockchain Courses" className="w-16 h-16 mb-4 object-contain" />
              <h4 className="font-bold text-gray-800 mb-2">Blockchain Courses</h4>
              <p className="text-sm text-gray-500 mb-4">Master blockchain technology and unlock potential.</p>
              <Link to="/course/blockchain" className="text-orange-500 font-bold text-sm">Read More →</Link>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-gray-100 shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
              <img src={block2} alt="Internships" className="w-16 h-16 mb-4 object-contain" />
              <h4 className="font-bold text-gray-800 mb-2">Internship Programs</h4>
              <p className="text-sm text-gray-500 mb-4">Gain hands-on skills working on live projects.</p>
              <Link to="/course/internship-program" className="text-orange-500 font-bold text-sm">Read More →</Link>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-gray-100 shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
              <img src={block3} alt="Other Courses" className="w-16 h-16 mb-4 object-contain" />
              <h4 className="font-bold text-gray-800 mb-2">Other Courses</h4>
              <p className="text-sm text-gray-500 mb-4">Learn in-demand tech skills from industry experts.</p>
              <Link to="/course/othercourse" className="text-orange-500 font-bold text-sm">Read More →</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const ProvettaBannerSection = () => {
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

  return (
    <div className="bg-[#1C1678] py-24 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left text */}
        <div className="lg:w-1/3 text-white">
          <h2 className="text-4xl md:text-5xl font-medium text-white font-headingFont leading-tight">Commitment to the Highest Quality of our Education.</h2>
          <p className="text-blue-100 mt-4 text-lg leading-relaxed mb-8">
            We process more than 2,000 student enrollments per month and help professionals make important career decisions.
          </p>
          <Link to="/about-kairaa-blockchain-academy">
            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300">
              Values and Culture <FaArrowRight className="inline ml-2" />
            </button>
          </Link>
        </div>

        {/* Right cards */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.map((card) => (
            <div key={card.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col justify-between h-full hover:-translate-y-2 hover:bg-white/20 transition duration-300 group">
              <div>
                <div className="bg-white p-3 rounded-xl inline-block mb-6 shadow-md">
                  <img src={card.img} alt={card.heading} className="w-12 h-12 object-contain group-hover:scale-110 transition duration-300" />
                </div>
                <h4 className="font-bold text-white text-xl mb-4 leading-snug">{card.heading}</h4>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed line-clamp-3">{card.para}</p>
              </div>
              <Link to={card.link} className="flex items-center text-sm font-bold text-orange-400 group-hover:text-white transition">
                <div className="w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center mr-3 transition">→</div>
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProvettaCoursesSection = () => {
  const data1 = [
    { id: 1, title: "Blockchain Developer Fundamental Course", image: icon1 },
    { id: 2, title: "Blockchain Developer Professional Course", image: icon2 },
    { id: 3, title: "Blockchain Developer Expert Course", image: icon4 },
    { id: 4, title: "Solidity for Smart Programming", image: icon5 },
    { id: 5, title: "Certified Blockchain Trainer Online Course", image: icon6 },
    { id: 6, title: "C programming Language Online Course", image: icon7 }
  ];

  return (
    <div className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 font-headingFont">Explore Our Courses</h2>
          <p className="text-gray-600 mt-4 text-lg">Master the skills of tomorrow. Choose from our expertly curated courses and start your journey toward a successful tech career.</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-12 md:mb-16">
          {data1.map(e => (
            <Link 
              key={e.id} 
              to={`/course/selfpaced-course/${e.id}`}
              className="group flex flex-col h-full cursor-pointer"
            >
              {/* Image Container */}
              <div className="w-full aspect-video overflow-hidden bg-gray-100 mb-4">
                <img
                  src={e.image}
                  alt={e.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#1C1678] transition-colors line-clamp-2 font-headingFont">
                {e.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/course/selfpaced-course">
            <button className="relative overflow-hidden bg-[#1C1678] text-white font-bold py-3 md:py-4 px-8 md:px-12 rounded-full shadow-lg hover:shadow-xl group text-sm md:text-base transition-shadow">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore All Courses
                <FaArrowRight className="group-hover:translate-x-2 transition" />
              </span>
              <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-cyan-500 to-[#CB77F7] transition-all duration-500 ease-out group-hover:w-full z-0"></div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ProvettaWhyChooseUsSection = () => {
  const data2 = [
    { content: "Live Project", desc: "Gain hands-on experience with real-world blockchain projects." },
    { content: "Global Certification", desc: "Earn internationally recognized certificates upon completion." },
    { content: "Professional Grooming", desc: "Get ready for the industry with expert guidance and tips." },
    { content: "100% Assured Job", desc: "We provide dedicated placement support to land your dream job." }
  ];

  return (
    <div className="py-20 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 font-headingFont">Why Choose Us?</h2>
          <p className="text-gray-600 mt-4 text-lg">Discover what makes our academy the best choice for your learning.</p>
        </div>

        {/* Why Choose Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {data2.map((e, idx) => (
            <div
              key={idx}
              className="h-full p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:-translate-y-2 transition duration-300 border border-blue-100 shadow-sm hover:shadow-md flex flex-col"
            >
              {/* Icon */}
              <div className="text-[#CB77F7] text-4xl md:text-5xl mb-4 md:mb-6 flex justify-center">
                <FaCheckCircle />
              </div>

              {/* Content */}
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3 text-center">
                {e.content}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 text-center leading-relaxed">
                {e.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProvettaTestimonialsSection = () => {
  const sliderRef = React.useRef(null);

  const testimonials = [
    { name: "Suresh Kumar", role: "Blockchain Student", text: "I had a great experience with the Blockchain Fundamental courses at Kairaa Blockchain Academy. It helped me develop a solid understanding of core blockchain concepts." },
    { name: "Priya Rajan", role: "Professional Learner", text: "I am here for the Blockchain Professional course. The trainer is experienced and actively working on projects, which helped me gain both practical and theoretical knowledge." },
    { name: "Karthik N", role: "Java Programming Student", text: "The classes were good, and the explanation of all concepts was precise and to the point. Overall, it provides a good environment for learning." },
    { name: "Anitha Devi", role: "Web3 Developer", text: "Kairaa gave our career the push it needed - clear strategy, fast execution, and real results. We're finally moving in the right direction." }
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="py-24 bg-[#f4f3ef] relative">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-6 font-headingFont">
              Student <span className="bg-[#e4d4ff] px-2 py-1 font-medium">Reviews</span>
            </h2>
            <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed mt-4">
              Think Kairaa Blockchain Academy is just another platform? Read how real learners went from beginners to industry-ready professionals.
            </p>
          </div>
          <div className="flex space-x-4 shrink-0">
            <button onClick={() => sliderRef.current?.slickPrev()} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#b28cff] text-[#8b5cf6] flex items-center justify-center hover:bg-[#e4d4ff] hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => sliderRef.current?.slickNext()} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#b28cff] text-[#8b5cf6] flex items-center justify-center hover:bg-[#e4d4ff] hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="-mx-4">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="px-4 h-full py-4">
                <div className="bg-white p-8 md:p-10 h-full flex flex-col justify-between hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent group">
                  <div>
                    <span className="text-5xl text-[#8b5cf6] font-serif leading-none block mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">“</span>
                    <p className="text-gray-900 text-base font-medium leading-relaxed mb-8">
                      {t.text}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center mb-6">
                      <div className="h-px bg-gray-500 flex-grow transition-colors duration-500 group-hover:bg-[#8b5cf6]"></div>
                      <span className="ml-2 text-2xl text-black leading-none transition-colors duration-500 group-hover:text-[#8b5cf6]">✦</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-[15px]">{t.name}</h4>
                        <p className="text-[12px] text-gray-600 mt-1 uppercase tracking-wide">{t.role}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#e4d4ff] flex items-center justify-center text-[#8b5cf6] font-bold shrink-0 shadow-sm">
                        {t.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

      </div>
    </div>
  );
};

export const ProvettaFAQSection = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqData = [
    { question: "What courses does Kairaa Blockchain Academy offer?", answer: "Kairaa Blockchain Academy offers a wide range of courses covering blockchain technology, cryptocurrency, smart contracts, decentralized finance (DeFi), and more." },
    { question: "Are the courses suitable for beginners?", answer: "Yes, our courses are structured to accommodate learners at all levels, including beginners. We provide comprehensive introductory material." },
    { question: "Is financial aid available?", answer: "We offer financial aid options, scholarships, and flexible payment plans to make our courses more accessible to deserving candidates." },
    { question: "Do you offer mentorship or career guidance?", answer: "Currently we have career roadmaps which cater to different goals. Coming soon we will include both mentorship and career guidance." }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 font-headingFont">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-4 text-lg">Everything you need to know about our academy and courses.</p>
        </div>

        <div className="flex flex-col">
          {faqData.map((faq, idx) => (
            <div key={idx} className={`border-b border-gray-200 transition-colors duration-300 ${openIndex === idx ? 'bg-[#f7f5fa]' : 'bg-transparent'}`}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center py-6 px-4 md:px-8 text-left focus:outline-none group"
              >
                <span className="font-medium text-lg md:text-xl text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{faq.question}</span>
                <span className="text-[#8b5cf6] flex-shrink-0 ml-4 transition-transform duration-300">
                  {openIndex === idx ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  )}
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-4 md:px-8 pb-8 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProvettaContactSection = () => {
  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full opacity-40 blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-100 rounded-full opacity-40 blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left Side: Contact Information */}
          <div className="lg:w-5/12 text-center lg:text-left mb-10 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 font-headingFont">Get In Touch</h2>
            <p className="text-gray-600 mt-4 text-lg mb-10 leading-relaxed">
              Have questions or want to learn more about our courses? We'd love to hear from you. Send us a message and our team will respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center mr-4 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1C1678]">Our Location</h4>
                  <p className="text-slate-600">131, 2nd floor, DB Road, RS Puram, Coimbatore - 641002</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center mr-4 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <FiPhoneCall className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1C1678]">Phone Number</h4>
                  <p className="text-slate-600">+91 7092774077</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center mr-4 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1C1678]">Email Address</h4>
                  <p className="text-slate-600">support@kairaaacademy.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:w-7/12 w-full">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative z-20">
              <form action="https://getform.io/f/pbmqqggb" method="POST" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input type="text" name="name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C1678] focus:bg-white transition" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                    <input type="email" name="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C1678] focus:bg-white transition" placeholder="john@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C1678] focus:bg-white transition" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea name="message" rows="4" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C1678] focus:bg-white transition resize-none" placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" className="w-full relative overflow-hidden bg-[#1C1678] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <span className="relative z-10 flex justify-center items-center text-lg">
                    Send Message <FaArrowRight className="ml-2 group-hover:translate-x-2 transition" />
                  </span>
                  <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-cyan-500 to-[#CB77F7] transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const ProvettaWelcomeSection = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">

        {/* Left Side: Image with premium design */}
        <div className="lg:w-1/2 relative flex justify-center">
          <div className="relative w-[350px] h-[350px]">

            {/* Front Image */}
            <div className="peer absolute top-0 left-0 w-[70%] h-[70%] rounded-3xl overflow-hidden shadow-2xl rotate-[-6deg] hover:rotate-0 transition-all duration-500 z-20">
              <img
                src={slide1Img}
                alt="About Kairaa Academy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Back Image */}
            <div className="absolute bottom-0 right-0 w-[70%] h-[70%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-[6deg] hover:rotate-0 transition-all duration-500 hover:z-30 hover:scale-105 hover:[&~.peer]:opacity-0">
              <img
                src={slide2Img}
                alt="Students Learning"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
        {/* Right Side: Content */}
        <div className="lg:w-1/2 space-y-8 z-10">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3 block">About Our Academy</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1C1678] font-headingFont leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-[#CB77F7]">Kairaa Blockchain Academy</span>
            </h2>
          </div>

          <p className="text-lg text-gray-600 font-paraFont leading-relaxed">
            Kairaa Blockchain is an Online Learning and Development Academy based in Coimbatore, Tamilnadu, founded in 2023. The company, led by a team of professionals, aims to empower college graduates and corporate employees with essential Technical, Communication, and Leadership skills to enhance employability and readiness for the industry.
          </p>

          <p className="text-lg text-gray-600 font-paraFont leading-relaxed">
            With a focus on practical, hands-on learning and mentorship from experienced professionals, we strive to not just educate, but to inspire and empower the leaders of tomorrow.
          </p>

          <div className="pt-4">
            <Link to="/about-kairaa-blockchain-academy">
              <button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <span className="relative z-10 flex items-center text-lg">
                  Get More Details <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
