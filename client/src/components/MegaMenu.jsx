import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import {
  HiOutlineCode,
  HiOutlineAcademicCap,
  HiOutlineChevronDown,
  HiOutlineStar,
  HiOutlineViewGridAdd,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineMap,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineChatAlt2,
  HiOutlineChartBar
} from "react-icons/hi";

import { useGetAllBlogsQuery } from "../redux/features/blog/blogApi.js";
import { useGetUserAllCoursesQuery } from "../redux/features/courses/coursesApi.js";

const MegaMenu = ({ isMobile, isScrolled, showQuickBar = true }) => {
  const [activeMenu, setActiveMenu] = useState(null);


  const { data: blogsData, isLoading: blogsLoading } = useGetAllBlogsQuery({});
  const latestBlog = blogsData?.blogs?.[0] || blogsData?.data?.[0] || null;

  const { data: coursesData, isLoading: coursesLoading } = useGetUserAllCoursesQuery({});
  // Try to find courses that might fit "Other" or just take up to 3 non-blockchain courses, fallback to any 3
  const allCoursesList = coursesData?.courses || coursesData?.data || [];
  const topCourses = allCoursesList.filter(c => {
    const cat = (c.categories || c.category || "").toLowerCase();
    return cat === "other" || cat === "other courses" || cat === "other course";
  }).slice(0, 3);
  const displayCourses = topCourses.length > 0 ? topCourses : [];

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

  const handleComingSoon = (e) => {
    e.preventDefault();
    toast("Coming Soon!", { icon: '🚀', style: { background: '#050810', color: '#fff', border: '1px solid #00F2FE' } });
  };

  const menuItems = [
    { title: "About Us", url: "/about-kairaa-blockchain-academy" },
    {
      title: "Courses",
      isMega: true,
      content: (
        <div className="w-full bg-[#0B0F19]/95 backdrop-blur-3xl border-b border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Animated Background Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-[1400px] mx-auto w-full p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

              {/* Column 1: Core Paths & Articles */}
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HiOutlineMap className="w-4 h-4" /> Learning Paths
                  </h3>
                  <div className="flex flex-col gap-3">
                    {/* Path 1 */}
                    <button onClick={handleComingSoon} className="text-left w-full group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-white/10 group-hover:border-primary/50 text-primary transition-all duration-300">
                          <HiOutlineAcademicCap size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">Independent Learning</h4>
                          <p className="text-xs text-slate-400 mt-1">Master Web3 at your own pace.</p>
                        </div>
                      </div>
                    </button>
                    {/* Path 2 */}
                    <Link to="/course/othercourse" onClick={() => setActiveMenu(null)} className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#8b5cf6]/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-white/10 group-hover:border-[#8b5cf6]/50 text-[#8b5cf6] transition-all duration-300">
                          <HiOutlineCode size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#8b5cf6] transition-colors">Instructor-Led Courses</h4>
                          <p className="text-xs text-slate-400 mt-1">Live, interactive cohorts.</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-4 h-4" /> Latest Article
                  </h3>
                  {blogsLoading ? (
                    <div className="h-24 bg-white/5 rounded-2xl animate-pulse w-full"></div>
                  ) : latestBlog ? (
                    <Link to={`/blogs/${latestBlog._id}`} onClick={() => setActiveMenu(null)} className="group relative block p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 hover:border-primary/50 transition-all overflow-hidden">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-primary/20 blur-[30px] rounded-full group-hover:bg-primary/40 transition-colors"></div>
                      <div className="relative z-10">
                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{latestBlog.title || latestBlog.name || 'Latest Article'}</h4>
                        <p className="text-xs text-slate-300 mb-3 line-clamp-2">{latestBlog.description || latestBlog.excerpt || 'Read our latest insights.'}</p>
                        <span className="text-xs font-bold text-primary group-hover:underline">Read More &rarr;</span>
                      </div>
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-500">No articles available</span>
                  )}
                </div>
              </div>

              {/* Column 2: Resources & Community */}
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HiOutlineStar className="w-4 h-4" /> Top Courses
                  </h3>
                  <div className="flex flex-col gap-1">
                    {coursesLoading ? (
                      <div className="h-24 bg-white/5 rounded-2xl animate-pulse w-full"></div>
                    ) : displayCourses.length > 0 ? (
                      displayCourses.map((course, idx) => (
                        <Link key={idx} to={`/courses/${course._id}`} onClick={() => setActiveMenu(null)} className="group p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#8b5cf6]/30 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0B0F19] rounded-lg border border-white/10 group-hover:border-[#8b5cf6]/50 text-[#8b5cf6] transition-all duration-300">
                              <HiOutlineCode size={16} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-white group-hover:text-[#8b5cf6] transition-colors line-clamp-1">{course.name}</h4>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No courses available</span>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HiOutlineUserGroup className="w-4 h-4" /> Community
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="#" className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#5865F2]/50 text-center transition-all group">
                      <HiOutlineChatAlt2 className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-[#5865F2]" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">Discord</span>
                    </a>
                    <a href="#" className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 text-center transition-all group">
                      <HiOutlineUserGroup className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-primary" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">Forums</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 3: Programs & Top Course */}
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HiOutlineStar className="w-4 h-4" /> BLOCKCHAIN COURSES
                  </h3>
                  <div className="flex flex-col gap-1">
                    <Link to="/course/blockchain" onClick={() => setActiveMenu(null)} className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#0B0F19] rounded-lg border border-white/10 group-hover:border-primary/50 text-primary transition-all duration-300">
                          <HiOutlineStar size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">Show all Blockchain Courses</h4>
                          <p className="text-xs text-slate-400 mt-1">Explore our entire Web3 catalog.</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="relative group cursor-pointer rounded-2xl overflow-hidden p-[1px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#8b5cf6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <button onClick={handleComingSoon} className="text-left w-full relative block h-full bg-[#0B0F19] rounded-[15px] p-6 overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-[20px] group-hover:bg-primary/30 transition-colors"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative z-10">
                        <div className="inline-block px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-3">
                          Exclusive Access
                        </div>
                        <h5 className="text-sm font-bold text-white mb-2 line-clamp-1">Internship Programs</h5>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">Gain hands-on industry experience building real-world dApps.</p>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                          <span>Explore Opportunities</span>
                          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 4: Sidebar / Social Proof */}
              <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HiOutlineChartBar className="w-4 h-4" /> Student Success
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-end gap-4 border-b border-white/5 pb-4">
                      <div>
                        <p className="text-3xl font-extrabold text-white">94<span className="text-primary">%</span></p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Placement Rate</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-4 border-b border-white/5 pb-4">
                      <div>
                        <p className="text-3xl font-extrabold text-white">10<span className="text-primary">k+</span></p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Learners</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex text-amber-400 mb-2">
                    <HiOutlineStar className="w-3 h-3 fill-current" />
                    <HiOutlineStar className="w-3 h-3 fill-current" />
                    <HiOutlineStar className="w-3 h-3 fill-current" />
                    <HiOutlineStar className="w-3 h-3 fill-current" />
                    <HiOutlineStar className="w-3 h-3 fill-current" />
                  </div>
                  <p className="text-xs text-slate-300 italic mb-3">"The learning path landed me my first Web3 developer role in just 3 months."</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full border border-primary/50"></div>
                    <div>
                      <p className="text-[10px] font-bold text-white">Alex M.</p>
                      <p className="text-[9px] text-slate-500">Smart Contract Dev</p>
                    </div>
                  </div>
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
      <div className="flex flex-col space-y-0 divide-y divide-white/5">
        {menuItems.map((item, index) => (
          <div key={index} className="py-4">
            {item.isMega ? (
              <div className="flex flex-col">
                <button
                  onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                  className="flex items-center justify-between py-3 text-base font-bold text-white w-full text-left"
                >
                  <span>{item.title}</span>
                  <HiOutlineChevronDown
                    className={`transition-transform duration-500 ${activeMenu === index ? "rotate-180 text-primary" : "text-slate-500"}`}
                    size={20}
                  />
                </button>

                {/* Mobile Accordion */}
                {activeMenu === index && (
                  <div className="pl-4 border-l-2 border-primary/50 flex flex-col space-y-3 py-4 mt-2">
                    <button onClick={handleComingSoon} className="text-left text-sm text-slate-300 hover:text-primary font-bold transition-colors duration-300">
                      Independent Learning
                    </button>
                    <Link to="/course/othercourse" className="text-sm text-slate-300 hover:text-primary font-bold transition-colors duration-300">
                      Instructor-Led Courses
                    </Link>

                    <div className="pt-3 border-t border-white/10 mt-3">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">Latest Article</p>
                      <Link to={latestBlog ? `/blogs/${latestBlog._id}` : '/blogs'} className="text-sm text-slate-300 hover:text-primary font-bold transition-colors duration-300 line-clamp-1">
                        {latestBlog ? (latestBlog.title || latestBlog.name) : 'Read our Blog'}
                      </Link>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-3">
                      <button onClick={handleComingSoon} className="text-sm font-bold text-primary hover:text-white inline-flex items-center gap-2 transition-colors duration-300">
                        <span>Internship Programs</span>
                        <HiOutlineArrowRight size={14} className="flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.url} className="block py-3 text-base font-bold text-white hover:text-primary transition-colors duration-300">
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
    <ul className="flex items-center space-x-1 xl:space-x-2 mega-menu-container h-full">
      {menuItems.map((item, index) => (
        <li
          key={index}
          className="h-full flex items-center"
          onMouseEnter={() => item.isMega && setActiveMenu(index)}
          onMouseLeave={() => item.isMega && setActiveMenu(null)}
        >
          {item.isMega ? (
            <button className="flex items-center gap-1.5 text-sm font-bold text-slate-300 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.5)] transition-all duration-300 h-full px-2 xl:px-4 py-3">
              <span>{item.title}</span>
              <HiOutlineChevronDown
                className={`transition-transform duration-500 ${activeMenu === index ? "rotate-180 text-primary" : "text-slate-500"}`}
                size={16}
              />
            </button>
          ) : (
            <Link
              to={item.url}
              className="text-sm font-bold text-slate-300 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.5)] transition-all duration-300 px-2 xl:px-4 py-3 h-full flex items-center whitespace-nowrap"
            >
              {item.title}
            </Link>
          )}

          {/* Mega Dropdown Panel with Full-Width Animation */}
          {item.isMega && (
            <div
              className={`absolute top-full left-0 w-full transition-all duration-300 ease-in-out origin-top pointer-events-none z-40 ${activeMenu === index
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
