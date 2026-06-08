

import React from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import {
  
  FaInstagramSquare,
  FaLinkedin,
  FaFacebookSquare,
} from "react-icons/fa";
import { IoCallSharp, IoMailSharp, IoLocationSharp } from "react-icons/io5";
import image from "../carouselimages/footerLogo2.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex flex-col bg-[#F7F4FD] font-paraFont font-medium text-[#0876DB] md:text-lg">
      <div className="grid md:grid-cols-4 grid-cols-1 gap-8 p-5 justify-between">
        <div className="p-5">
          <img src={image} className="md:h-24 h-12 " alt="Footer Logo" />
          <p className="text-md py-3 mb-3">
            Kairaa Blockchain Academy is a top-notch online learning center that
            offers a wide range of courses.
          </p>
          <ul className="flex text-3xl gap-4">
            <Link to="https://www.linkedin.com/company/kairaa-blockchain-academy/">
              <li className="hover:text-blue-700">
                <FaLinkedin />
              </li>
            </Link>
            <Link to="https://www.instagram.com/kairaaacademy/">
              <li className="hover:text-blue-700">
                <FaInstagramSquare />
              </li>
            </Link>
            <Link to="https://twitter.com/Kairaa_academy">
              <li className="hover:text-blue-700">
                <FaSquareXTwitter/>
              </li>
            </Link>
            <Link to="https://www.facebook.com/kairaaacademy">
              <li className="hover:text-blue-700">
                <FaFacebookSquare />
              </li>
            </Link>
          </ul>
        </div>

        <div className="p-5 md:pl-20">
          <h4 className="font-headingFont md:text-2xl font-bold p-2">
            Quick Links
          </h4>
          <ul className="text-md font-paraFont p-4 space-y-2">
            <Link to="/about-kairaa-blockchain-academy">
              <li className="py-2">About Us</li>
            </Link>
            <Link to="/blogs">
              <li className="py-2">Blog</li>
            </Link>
            <Link to="/payment-terms-condition">
              <li className="py-2">Terms & Conditions</li>
            </Link>
            <Link to="/privacy-policy">
              <li className="py-2">Privacy Policy</li>
            </Link>
          </ul>
        </div> 

        <div className="p-5 md:py-5 md:pl-0">
          <h4 className="font-headingFont md:text-2xl font-bold p-2">
            Branches
          </h4>
          <div className="grid md:grid-cols-2 gap-4  p-4">
            <ul className="space-y-1">
              <li>Chennai</li>
              <li>Trichy</li>
              <li>Madurai</li>
              <li>Tirunelveli</li>
              <li>Vellore</li>
            </ul>
            <ul className="space-y-1">
              <li>Salem</li>
          
              <li>Coimbatore</li>
              <li>Thrissur</li>
              <li>Chittoor</li>
            </ul>
          </div>
        </div>

        <div className="p-5 text-md">
          <h4 className="font-headingFont md:text-2xl font-bold p-2 mb-2">
            Contact
          </h4>
          <div className="flex items-center gap-2 py-2">
            <IoCallSharp  size={25} className="md:text-3xl hover:text-blue-800" />
            <p className="font-medium">
              <a href="tel:+91 7092774077">+91 7092774077</a>
            </p>
          </div>
          <div className="flex items-center gap-2 py-2">
            <IoMailSharp size={25} className="md:text-3xl hover:text-blue-800" />
            <p className="font-medium">
              <a href="mailto:support@kairaaacademy.com">
                support@kairaaacademy.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2 py-2">
            <IoLocationSharp size={55} className="md:text-3xl hover:text-blue-800" />
            <p className="font-medium">
              131, 2nd floor, DB Road, RS Puram, Coimbatore - 641002
            </p>
          </div>
        </div>
      </div>
      <p className="text-center text-sm p-2 border-t">
        ©2024. Kairaa Blockchain Academy. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;

