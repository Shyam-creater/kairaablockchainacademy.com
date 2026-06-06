import React from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa";
import { IoCallSharp, IoMailSharp, IoLocationSharp } from "react-icons/io5";
import image from "../carouselimages/footerLogo2.png";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-corporate">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/">
              {/* Native logo colors displayed perfectly */}
              <img src={image} className="footer-logo" alt="Kairaa Blockchain Academy" />
            </Link>
            <p className="footer-desc">
              Kairaa Blockchain Academy is a top-notch online learning center that offers a wide range of industry-leading courses and certifications.
            </p>
            <div className="footer-socials">
               <a href="https://www.linkedin.com/company/kairaa-blockchain-academy/" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
               <a href="https://www.instagram.com/kairaaacademy/" target="_blank" rel="noreferrer"><FaInstagram /></a>
               <a href="https://twitter.com/Kairaa_academy" target="_blank" rel="noreferrer"><FaSquareXTwitter /></a>
               <a href="https://www.facebook.com/kairaaacademy" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            </div>
          </div>
          
          {/* Links */}
          <div className="footer-links">
             <h4>Quick Links</h4>
             <ul>
               <li><Link to="/about-kairaa-blockchain-academy">About Us</Link></li>
               <li><Link to="/blogs">Blog</Link></li>
               <li><Link to="/payment-terms-condition">Terms & Conditions</Link></li>
               <li><Link to="/privacy-policy">Privacy Policy</Link></li>
             </ul>
          </div>
          
          {/* Branches */}
          <div className="footer-links">
             <h4>Our Branches</h4>
             <div className="footer-branches">
               <span>Chennai</span><span>Salem</span>
               <span>Trichy</span><span>Coimbatore</span>
               <span>Madurai</span><span>Thrissur</span>
               <span>Tirunelveli</span><span>Chittoor</span>
               <span>Vellore</span>
             </div>
          </div>
          
          {/* Contact */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <div className="contact-icon-wrapper"><IoCallSharp /></div>
              <div className="contact-item-text">
                <span>Phone</span>
                <a href="tel:+917092774077">+91 7092774077</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon-wrapper"><IoMailSharp /></div>
              <div className="contact-item-text">
                <span>Email</span>
                <a href="mailto:support@kairaaacademy.com">support@kairaaacademy.com</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon-wrapper"><IoLocationSharp /></div>
              <div className="contact-item-text">
                <span>Address</span>
                <p>131, 2nd floor, DB Road, RS Puram, Coimbatore - 641002</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Kairaa Blockchain Academy. All Rights Reserved.</p>
          <div className="footer-bottom-links">
             <Link to="/privacy-policy">Privacy Policy</Link>
             <Link to="/payment-terms-condition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

