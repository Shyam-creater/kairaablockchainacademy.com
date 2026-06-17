import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import MegaMenu from "./MegaMenu.jsx";

import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX, HiOutlineSearch, HiOutlineLogout, HiOutlineViewGrid } from "react-icons/hi";
import CustomModel from "../utils/CustomModel.js";
import Login from "../components/Auth/Login.js";
import Signup from "../components/Auth/Signup.js";
import Verification from "./Auth/Verification.js";
import { useSelector } from "react-redux";
import avatar from "../assets/user.png";
import logo2 from "../carouselimages/Blockchain-Academy-Logo.png";
import { useLogOutQuery } from "../redux/features/auth/authApi.js";

const Header = ({
  activeItem,
  setOpen,
  open,
  route,
  setRoute,
  isModalOpen,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  
  const [logOut, setLogOut] = useState(false);
  const { refetch } = useLogOutQuery(undefined, { skip: !logOut });

  const logOutHandler = () => {
    setLogOut(true);
  };

  useEffect(() => {
    if (logOut) {
      refetch().then(() => {
        setProfileDropdown(false);
      }).catch((error) => {
        console.error("Error logging out:", error);
      }).finally(() => {
        setLogOut(false);
      });
    }
  }, [logOut, refetch]);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchData = [
    { title: "Home", url: "/", desc: "Return to the homepage." },
    { title: "About Us", url: "/about-kairaa-blockchain-academy", desc: "Learn about Kairaa Blockchain Academy's mission and team." },
    { title: "Blogs", url: "/blogs", desc: "Read our latest articles and tech updates." },
    { title: "Gallery", url: "/gallery", desc: "View our photo gallery and past events." },
    { title: "Contact Us", url: "/contact", desc: "Get in touch with our support team." },
    
    // Core Categories
    { title: "Self-Paced Courses", url: "/course/selfpaced-course", desc: "Learn at your own speed with lifetime access." },
    { title: "Instructor-Led", url: "/courses", desc: "Live classes with industry experts." },
    { title: "Blockchain Certification", url: "/course/bockchaincertification", desc: "Become a Certified Blockchain Architect." },
    { title: "Bootcamps", url: "/course/bootcamp", desc: "Intensive training to land your dream job." },
    { title: "Internship Programs", url: "/course/internship-program", desc: "Gain real-world experience working on live Web3 projects." },
    { title: "Other Courses", url: "/course/othercourse", desc: "Explore our wide variety of tech topics." },

    // Specific Courses
    { title: "Blockchain Developer Fundamental Course", url: "/course/selfpaced-course/1", desc: "Master the basics of blockchain technology." },
    { title: "Blockchain Developer Professional Course", url: "/course/selfpaced-course/2", desc: "Advance your skills with professional blockchain development." },
    { title: "Blockchain Developer Expert Course", url: "/course/selfpaced-course/3", desc: "Become an expert in building Web3 applications." },
    { title: "Solidity for Smart Programming", url: "/course/selfpaced-course/4", desc: "Learn Solidity to write secure smart contracts." },
    { title: "Certified Blockchain Trainer Online Course", url: "/course/selfpaced-course/5", desc: "Get certified to train others in blockchain technology." },
    { title: "C programming Language Online Course", url: "/course/selfpaced-course/6", desc: "Build a strong foundation with C programming." },
  ];

  const filteredResults = searchQuery.trim() === "" ? [] : searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = openSidebar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openSidebar]);

  const handleCloseSidebar = (e) => {
    if (e.target.id === "sidebar-overlay") {
      setOpenSidebar(false);
    }
  };

  return (

    <div className="w-full relative font-sans">
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-base ease-smooth ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm h-[70px]"
            : "bg-white border-b border-neutral-100 h-[80px]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-2xl h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Section: Logo & Desktop Nav */}
            <div className="flex items-center h-full space-x-4xl flex-grow">
              <Link to={"/"} className="block hover:opacity-80 transition-opacity flex-shrink-0">
                <img src={logo2} alt="Logo" className="w-[180px] object-contain" />
              </Link>

              {showSearch ? (
                <div className="hidden lg:flex flex-grow items-center ml-8 w-full relative" style={{ animation: 'searchSlideLeft 0.3s ease-out forwards', transformOrigin: 'right center' }}>
                  <style>{`
                    @keyframes searchSlideLeft {
                      0% { opacity: 0; transform: translateX(30px); }
                      100% { opacity: 1; transform: translateX(0); }
                    }
                  `}</style>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="Search courses, blogs, or pages..." 
                      autoFocus 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2.5 px-4 pl-10 pr-10 border border-neutral-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-shadow" 
                    />
                    <HiOutlineSearch className="absolute left-3 top-6 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
                    <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="absolute right-3 top-6 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1 flex items-center justify-center rounded-full hover:bg-neutral-100">
                      <HiX size={18} />
                    </button>
                    
                    {/* Desktop Search Results Mega Dropdown */}
                    {searchQuery.trim() !== "" && (
                      <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 z-50 animate-fade-in max-h-[500px] overflow-y-auto">
                        {filteredResults.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredResults.map((res, idx) => (
                              <Link key={idx} to={res.url} onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="group flex items-start gap-4 p-4 rounded-lg hover:bg-primary-50 transition-colors">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-md group-hover:bg-primary-500 group-hover:text-white transition-colors flex-shrink-0">
                                  <HiOutlineSearch size={24} />
                                </div>
                                <div>
                                  <h4 className="text-body font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{res.title}</h4>
                                  <p className="text-sm text-neutral-500 mt-1">{res.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-neutral-500">
                            <HiOutlineSearch size={48} className="mx-auto mb-4 text-neutral-300" />
                            <p className="text-lg">No results found for "{searchQuery}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden lg:block h-full transition-all duration-300" style={{ animation: 'searchSlideLeft 0.3s ease-out forwards' }}>
                  <MegaMenu isMobile={false} />
                </div>
              )}
            </div>

            {/* Right Section: Actions */}
            <div className="hidden lg:flex items-center space-x-xl ml-4">
              {/* Search Icon */}
              {!showSearch && (
                <button onClick={() => setShowSearch(true)} className="p-sm text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                  <HiOutlineSearch size={22} />
                </button>
              )}
              
              <div className="h-6 w-px bg-neutral-200"></div>

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-sm p-xs pr-md rounded-full border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <img
                      alt="user-avatar"
                      src={user.avatar ? user.avatar.url : avatar}
                      className="h-8 w-8 rounded-full object-cover border border-white shadow-xs"
                    />
                    <span className="text-body-sm font-semibold text-neutral-700">{user.name?.split(' ')[0] || "Profile"}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-neutral-100 p-2 animate-fade-in origin-top-right z-50">
                      
                      <div className="px-4 py-3 mb-2 bg-neutral-50 rounded-xl">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      </div>

                      <div className="px-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setProfileDropdown(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        >
                          <HiOutlineUserCircle size={20} />
                          My Profile
                        </Link>
                      </div>

                      <div className="h-px bg-neutral-100 my-2 mx-3"></div>
                      
                      <div className="px-1">
                        <button 
                          onClick={() => {
                            setProfileDropdown(false);
                            logOutHandler();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left"
                        >
                          <HiOutlineLogout size={20} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-md">
                  <button 
                    onClick={() => { setRoute("Login"); setOpen(true); }}
                    className="text-body-sm font-semibold text-neutral-600 hover:text-primary-600 px-md py-sm transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => { setRoute("Sign-Up"); setOpen(true); }}
                    className="px-xl py-sm rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-base text-body-sm font-semibold whitespace-nowrap"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-md">
              <button onClick={() => setShowSearch(!showSearch)} className="p-sm text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors">
                <HiOutlineSearch size={22} />
              </button>
              <button
                onClick={() => setOpenSidebar(true)}
                className="p-sm rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors"
              >
                <HiOutlineMenuAlt3 size={24} />
              </button>
            </div>
          </div>
          
          {/* Mobile Search Bar Dropdown */}
          {showSearch && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-neutral-100 p-4 shadow-sm animate-fade-in">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  autoFocus 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 pr-10 border border-neutral-300 rounded-full focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500" 
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
                <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 flex items-center justify-center rounded-full hover:bg-neutral-100">
                  <HiX size={18} />
                </button>
              </div>
              
              {/* Mobile Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="mt-4 max-h-[300px] overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                      {filteredResults.map((res, idx) => (
                        <Link key={idx} to={res.url} onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="p-3 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors">
                          <h4 className="text-body-sm font-semibold text-neutral-900">{res.title}</h4>
                          <p className="text-caption text-neutral-500 mt-1 line-clamp-1">{res.desc}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-neutral-500">No courses found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay & Drawer */}
      <div
        id="sidebar-overlay"
        onClick={handleCloseSidebar}
        className={`fixed inset-0 z-[999] bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-base ${
          openSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl transition-transform duration-base ease-smooth flex flex-col ${
            openSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-xl flex items-center justify-between border-b border-neutral-100">
            <Link to="/" onClick={() => setOpenSidebar(false)}>
               <img src={logo2} alt="Logo" className="w-[120px] object-contain" />
            </Link>
            <button
              onClick={() => setOpenSidebar(false)}
              className="p-sm rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <HiX size={20} />
            </button>
          </div>

          {/* Sidebar Navigation (MegaMenu mobile view) */}
          <div className="flex-1 overflow-y-auto p-xl">
            <MegaMenu isMobile={true} />
          </div>

          {/* Sidebar Footer */}
          <div className="p-xl border-t border-neutral-100 bg-neutral-50">
            {user ? (
              <div className="flex flex-col space-y-md">
                <Link to="/profile" onClick={() => setOpenSidebar(false)} className="flex items-center gap-md p-md rounded-lg bg-white border border-neutral-200 shadow-xs">
                  <img
                    src={user.avatar ? user.avatar.url : avatar}
                    className="h-10 w-10 rounded-full object-cover"
                    alt="user-avatar"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-body-sm text-neutral-900 truncate">{user.name || "My Profile"}</p>
                    <p className="text-caption text-neutral-500 truncate">{user.email}</p>
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    setOpenSidebar(false);
                    logOutHandler();
                  }}
                  className="w-full py-sm rounded-md text-red-500 font-medium hover:bg-red-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                <button
                  onClick={() => { setOpenSidebar(false); setOpen(true); }}
                  className="w-full py-sm rounded-md border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setOpenSidebar(false); setRoute("Sign-Up"); setOpen(true); }}
                  className="w-full py-sm rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {route === "Login" && !isModalOpen && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}

      {route === "Sign-Up" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Signup}
        />
      )}

      {route === "Verification" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
