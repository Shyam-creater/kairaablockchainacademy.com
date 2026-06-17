import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineCode, HiOutlineBriefcase, HiOutlineBadgeCheck, HiOutlineAcademicCap, HiOutlineChevronDown, HiOutlineStar, HiOutlineViewGridAdd, HiOutlineArrowRight } from "react-icons/hi";

const MegaMenu = ({ isMobile }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredSubMenu, setHoveredSubMenu] = useState(null);

  // If clicking outside, close the mega menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mega-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { title: "Home", url: "/" },
    { title: "About Us", url: "/about-kairaa-blockchain-academy" },
    {
      title: "Courses",
      isMega: true,
      content: (
        <div className="grid grid-cols-3 gap-0 w-[900px] bg-white shadow-2xl" style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 25px -5px rgba(0, 0, 0, 0.08)'
        }}>
          
          {/* Left Section - Course Categories */}
          <div className="col-span-2 border-r border-gray-100 p-8 flex flex-col gap-8">
            {/* Main Course Categories */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {/* Self-Paced */}
                <Link 
                  to="/course/selfpaced-course" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-blue-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineAcademicCap size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        Independent Learning
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Learn at your own speed with lifetime access.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Instructor-Led */}
                <Link 
                  to="/courses" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-purple-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineCode size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                        Instructor-Led Courses
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Live classes with industry experts.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Certifications */}
                <Link 
                  to="/course/bockchaincertification" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-amber-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineBadgeCheck size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                        Certifications
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Become a Certified Blockchain Architect.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Bootcamps */}
                <Link 
                  to="/course/bootcamp" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-green-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineBriefcase size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        Bootcamps
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Intensive training to land your dream job.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Top Courses Section */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Featured Programs
              </p>
              <div className="grid grid-cols-2 gap-6">
                {/* Blockchain Dev */}
                <Link 
                  to="/course/blockchain" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-indigo-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineStar size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        Blockchain Development
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Master Web3 and smart contracts.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Other Courses */}
                <Link 
                  to="/course/othercourse" 
                  className="group block p-4 hover:bg-gradient-to-br hover:from-cyan-50 to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                      <HiOutlineViewGridAdd size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                        Other Courses
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Explore our tech expertise.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Featured Program */}
          <div className="p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                Spotlight Program
              </p>
              
              <div className="group cursor-pointer">
                {/* Program Image/Header */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
                  <div className="text-center">
                    <p className="text-white font-bold text-base">Blockchain</p>
                    <p className="text-blue-100 text-sm mt-1">Development</p>
                  </div>
                </div>

                {/* Program Content */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-base font-semibold text-gray-900">
                      Internship Programs
                    </h5>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      Gain real-world experience on live Web3 projects. Connect with industry leaders and build your portfolio.
                    </p>
                  </div>

                  <Link 
                    to="/course/internship-program" 
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 group/link transition-colors duration-300 mt-4"
                  >
                    <span>Explore Programs</span>
                    <HiOutlineArrowRight size={16} className="group-hover/link:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    },
    { title: "Blogs", url: "/blogs" },
    { title: "Gallery", url: "/gallery" },
    { title: "Contact Us", url: "/contact" },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-0 divide-y divide-gray-100">
        {menuItems.map((item, index) => (
          <div key={index} className="py-4">
            {item.isMega ? (
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                  className="flex items-center justify-between py-3 text-base font-semibold text-gray-900 w-full text-left"
                >
                  <span>{item.title}</span>
                  <HiOutlineChevronDown 
                    className={`transition-transform duration-500 ${activeMenu === index ? "rotate-180 text-blue-600" : "text-gray-400"}`} 
                    size={20}
                  />
                </button>
                
                {/* Mobile Accordion */}
                {activeMenu === index && (
                  <div className="pl-4 border-l-2 border-blue-500 flex flex-col space-y-3 py-4 mt-2">
                    <Link to="/course/selfpaced-course" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                      Self-Paced Courses
                    </Link>
                    <Link to="/courses" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                      Instructor-Led Courses
                    </Link>
                    <Link to="/course/bockchaincertification" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                      Certifications
                    </Link>
                    <Link to="/course/bootcamp" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                      Bootcamps
                    </Link>
                    
                    <div className="pt-3 border-t border-gray-200 mt-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Featured</p>
                      <div className="flex flex-col space-y-2 pl-0">
                        <Link to="/course/blockchain" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                          Blockchain Development
                        </Link>
                        <Link to="/course/othercourse" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                          Other Courses
                        </Link>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 mt-3">
                      <Link to="/course/internship-program" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 transition-colors duration-300">
                        <span>Internship Programs</span>
                        <HiOutlineArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.url} className="block py-3 text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Desktop Menu
  return (
    <ul className="flex items-center space-x-2 mega-menu-container h-full">
      {menuItems.map((item, index) => (
        <li 
          key={index} 
          className="relative h-full flex items-center"
          onMouseEnter={() => item.isMega && setActiveMenu(index)}
          onMouseLeave={() => item.isMega && setActiveMenu(null)}
        >
          {item.isMega ? (
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 h-full px-4 py-3">
              <span>{item.title}</span>
              <HiOutlineChevronDown 
                className={`transition-transform duration-500 ${activeMenu === index ? "rotate-180 text-blue-600" : "text-gray-400"}`} 
                size={18} 
              />
            </button>
          ) : (
            <Link 
              to={item.url} 
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 px-4 py-3 h-full flex items-center"
            >
              {item.title}
            </Link>
          )}

          {/* Mega Dropdown Panel with Premium Animation */}
          {item.isMega && (
            <div 
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-500 ease-out origin-top pointer-events-none ${
                activeMenu === index 
                  ? "opacity-100 translate-y-0 visible pointer-events-auto" 
                  : "opacity-0 translate-y-8 invisible"
              }`}
            >
              {item.content}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MegaMenu;
