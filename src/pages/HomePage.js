import React, { useState, useEffect } from "react";
import CustomModel from "../utils/CustomModel.js";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Heading from "../components/Heading";
import SliderComp from "../components/SliderComp.js";
import Getstarted from "../components/Getstarted.js";
import Faq from "../components/Faq.js";
import Carousel from "../components/Carousel.js";
import Footer from "../components/Footer.js";
import EnquiryForm from "../utils/EnquiryForm.js";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if the EnquiryForm has already been opened in this session
    const hasOpenedEnquiryForm = sessionStorage.getItem("hasOpenedEnquiryForm");

    if (!hasOpenedEnquiryForm) {
      // Open the modal after 500ms on the first visit to the page within this session
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        sessionStorage.setItem("hasOpenedEnquiryForm", "true"); // Set flag in session storage
      }, 500);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Heading
        title="Kairaa Blockchain Academy | Blockchain Courses & Certifications"
        description="Upskill for the future! Get certified in blockchain and unlock new career opportunities with Kairaa Blockchain Academy."
      />
      <Header
      isModalOpen={isModalOpen}
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      <SliderComp  />
      <Hero />
      <Carousel />
      <Getstarted />
      <Faq />
      <Footer />

      { isModalOpen && (
        <CustomModel
          open={isModalOpen}
          setOpen={setIsModalOpen}
          component={EnquiryForm}
        />
      )}
    </div>
  );
};

export default HomePage;
