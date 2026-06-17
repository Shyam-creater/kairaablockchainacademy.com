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
import { motion } from 'framer-motion';
const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.12
    }
  }
};
const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0B1120] text-slate-300 py-20 border-t border-slate-800/50">
      {/* Static blurred gradients for subtle depth only */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-7xl">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Brand Column */}
          <motion.div className="flex flex-col space-y-6 lg:col-span-1" variants={columnVariants}>
            <div>
              <img 
                src={image} 
                className="h-10 sm:h-12 object-contain" 
                alt="Kairaa Blockchain Academy" 
              />
            </div>
            
            <p className="text-sm leading-relaxed text-slate-400 font-light pr-4">
              Elevate your career with Kairaa Blockchain Academy. A premier learning center offering world-class certifications in blockchain and emerging technologies.
            </p>
          </motion.div>
          {/* Quick Links */}
          <motion.div className="lg:pl-8" variants={columnVariants}>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about-kairaa-blockchain-academy" },
                { name: "Blog", path: "/blogs" },
                { name: "Terms & Conditions", path: "/payment-terms-condition" },
                { name: "Privacy Policy", path: "/privacy-policy" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-sm font-light text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Branches */}
          <motion.div variants={columnVariants}>
            <h4 className="text-white font-semibold mb-6">Branches</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                "Chennai", "Salem", "Trichy", "Coimbatore",
                "Madurai", "Thrissur", "Tirunelveli", "Chittoor", "Vellore"
              ].map((branch, idx) => (
                <li key={idx} className="text-sm font-light text-slate-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer">
                  {branch}
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Contact */}
          <motion.div variants={columnVariants}>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: IoCallSharp, content: "+91 7092774077", href: "tel:+917092774077", type: "link" },
                { icon: IoMailSharp, content: "support@kairaaacademy.com", href: "mailto:support@kairaaacademy.com", type: "link" },
                { icon: IoLocationSharp, content: "131, 2nd floor, DB Road, RS Puram, Coimbatore - 641002", href: null, type: "text" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon className="text-cyan-500 mt-0.5 flex-shrink-0" />
                    {item.type === "link" ? (
                      <a
                        href={item.href}
                        className="text-sm font-light text-slate-400 hover:text-cyan-400 transition-colors duration-300 break-words"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-sm font-light text-slate-400 leading-relaxed pr-4">
                        {item.content}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
        {/* Footer Bottom (Socials & Copyright) */}
       {/* Footer Bottom */}
<div className="pt-8 border-t border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-6">
  
  <div className="flex flex-col items-center lg:items-start gap-2">
    <p className="text-sm font-light text-slate-500 text-center lg:text-left">
      © {new Date().getFullYear()} Kairaa Blockchain Academy. Building
      Future-Ready Professionals.
    </p>

    <div className="flex items-center gap-3 text-sm font-light text-slate-500 flex-wrap justify-center lg:justify-start">
      <Link
        to="/privacy-policy"
        className="hover:text-cyan-400 transition-colors"
      >
        Privacy Policy
      </Link>

      <span>•</span>

      <Link
        to="/payment-terms-condition"
        className="hover:text-cyan-400 transition-colors"
      >
        Terms
      </Link>

      <span>•</span>

      <Link
        to="/contact"
        className="hover:text-cyan-400 transition-colors"
      >
        Contact
      </Link>
    </div>
  </div>

  {/* Social Icons */}
  <div className="flex justify-center gap-6">
    {[
      {
        icon: FaLinkedin,
        link: "https://www.linkedin.com/company/kairaa-blockchain-academy/",
      },
      {
        icon: FaInstagramSquare,
        link: "https://www.instagram.com/kairaaacademy/",
      },
      {
        icon: FaSquareXTwitter,
        link: "https://twitter.com/Kairaa_academy",
      },
      {
        icon: FaFacebookSquare,
        link: "https://www.facebook.com/kairaaacademy",
      },
    ].map((social, idx) => {
      const Icon = social.icon;

      return (
        <a
          key={idx}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:scale-110 text-xl"
        >
          <Icon />
        </a>
      );
    })}
  </div>

</div>
      </div>
    </footer>
  );
};
export default Footer;
