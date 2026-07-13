import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBlock from '../../assets/TopCourses.jpg';
import { courses1 } from '../Top_courses/Data/OthercoursesData';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Heading from '../../components/Heading';

function OtherCourse() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading
        title="Top Programming Courses | Kairaa Blockchain Academy"
        description="Kairaa Blockchain Academy offers top programming courses like C, C++, Advanced Java, PHP, Flutter, and SQL. Learn and enhance your programming skills."
        keywords="C, C++, Advanced Java, PHP, Flutter,SQL"
      />
      <div className="flex-grow bg-white relative overflow-x-hidden pb-16">
        <Header
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />

{/* Hero Section */}
<section className="bg-[#1C1678] pt-20 pb-32 px-6 md:px-12 relative text-white overflow-hidden">
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <p className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6">Elite Training Programs</p>

    <div className="flex flex-row gap-12 lg:gap-24 items-center justify-between">

      {/* LEFT - Text */}
      <div className="w-3/5">
        <h1 className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight mb-6">
          Courses Offered in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">
            Programming Languages
          </span>
        </h1>
        <p className="text-blue-100 text-lg leading-relaxed font-paraFont">
          Master modern software development languages with a world-class curriculum designed for industry relevance, direct expert support, and practical building blocks.
        </p>
      </div>

      {/* RIGHT - Image */}
      <div className="w-2/5 flex justify-end">
        <div className="relative group p-1 bg-white/10 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <img
            className="max-h-[260px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            src={TopBlock}
            alt="Programming Courses Offered"
          />
        </div>
      </div>

    </div>
  </div>
</section>

        {/* Section Divider & Header */}
        <section className="py-24 bg-white">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C1678] tracking-wide uppercase mb-4 font-headingFont">
              Our Top Most <span className="text-orange-500 font-extrabold">Other Popular Courses</span>
            </h2>
            <p className="text-slate-650 text-lg max-w-xl mx-auto font-paraFont">
              Accelerate your engineering scope with our premium interactive course registry.
            </p>
          </div>
        </section>

        {/* Course list cards block */}
        <section className="pb-24 bg-white">
          <div className="container mx-auto max-w-5xl px-6 space-y-12">
            {courses1.map((e) => {
              return (
                <div
                  key={e.id}
                  className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center"
                >
                  {/* Card Thumbnail Image */}
                  <div className="md:w-[40%] w-full h-64 md:h-72 overflow-hidden rounded-2xl shadow-md bg-white flex-shrink-0">
                    <img
                      src={e.image}
                      className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                      alt={e.title}
                    />
                  </div>

                  {/* Card content details */}
                  <div className="md:w-[60%] w-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold text-[#1C1678] mb-4 font-headingFont leading-snug">
                        {e.title}
                      </h3>

                      <p className="text-slate-650 text-base leading-relaxed mb-6 font-paraFont">
                        {e.paragraph1}
                      </p>
                    </div>

                    <div>
                      <Link to={`/top-courses/${e.id}`}>
                        <button className="bg-[#1C1678] hover:bg-orange-500 text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-colors duration-300 uppercase text-xs tracking-wider border-none">
                          Explore Program
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default OtherCourse;