import React, { useState } from "react";
import { Link } from "react-router-dom";

import NavItems from "../utils/navItems.js";

import { HiOutlineMenuAlt3, HiX, HiOutlineLogin } from "react-icons/hi";
import CustomModel from "../utils/CustomModel.js";
import Login from "../components/Auth/Login.js";
import Signup from "../components/Auth/Signup.js";
import Verification from "./Auth/Verification.js";
import { useSelector } from "react-redux";
import avatar from "../assets/user.png";
import logo2 from "../carouselimages/Blockchain-Academy-Logo.png";
import "./Header.css";

const Header = ({
  activeItem,
  setOpen,
  open,
  route,
  setRoute,
  isModalOpen,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleClose = () => {
    setOpenSidebar(false);
  };

  return (
    <div className="w-full relative">
      <header className="premium-header">
        <div className="premium-header-content">
          
          <Link to={"/"} className="flex items-center">
            <img src={logo2} alt="Logo" className="premium-logo" />
          </Link>
          
          <div className="premium-nav-container">
            <NavItems isMobile={false} />
            
            <button 
              className="premium-mobile-toggle"
              onClick={() => setOpenSidebar(true)}
            >
              <HiOutlineMenuAlt3 size={32} />
            </button>

            <div className="premium-profile-wrapper hidden 800px:flex">
              {user ? (
                <Link to="/profile">
                  <img
                    alt="user-avatar"
                    src={user.avatar ? user.avatar.url : avatar}
                    className="premium-profile-img"
                    style={{
                      borderColor: activeItem === 5 ? "#0876DB" : "#e2e8f0",
                    }}
                  />
                </Link>
              ) : (
                <button 
                  className="premium-login-btn"
                  onClick={() => setOpen(true)}
                >
                  <HiOutlineLogin size={22} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {openSidebar && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-[1001]" onClick={handleClose}>
          <div 
            className="fixed top-0 right-0 w-[75%] max-w-[320px] h-screen bg-white z-[1002] shadow-2xl flex flex-col transition-transform duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-5 border-b border-slate-100">
              <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" onClick={handleClose}>
                <HiX size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <NavItems isMobile={true} />

              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                {user ? (
                  <Link to="/profile" onClick={handleClose}>
                    <img
                      alt="user-avatar"
                      src={user.avatar ? user.avatar.url : avatar}
                      className="premium-profile-img"
                    />
                  </Link>
                ) : (
                  <button 
                    className="premium-login-btn w-full justify-center"
                    onClick={() => {
                      handleClose();
                      setOpen(true);
                    }}
                  >
                    <HiOutlineLogin size={22} />
                    <span>Login / Sign Up</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {route === "Login" && !isModalOpen && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login} />
      )}
      {route === "Sign-Up" && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Signup} />
      )}
      {route === "Verification" && open && (
        <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Verification} />
      )}
    </div>
  );
};

export default Header;
