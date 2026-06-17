import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { branchDetails } from "../utils/branchDetails.js";
import Map1 from "../components/Map.js";

const ContactPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="overflow-x-hidden min-h-screen bg-neutral-50 font-sans">
      <Heading
        title="Contact Us | Kairaa Blockchain Academy"
        description="Get in touch with Kairaa Blockchain Academy. Contact us for inquiries, collaborations, or support related to blockchain education and resources."
        keywords="blockchain course, blockchain certification, blockchain academy"
      />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      {/* Minimalist Hero Section */}
      <section className="bg-white py-20 lg:py-28 border-b border-neutral-200">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 font-sans">
            Get in touch with our experts.
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
            Whether you have questions about our blockchain programs, enterprise solutions, or partnerships, we're here to help you navigate your journey.
          </p>
        </div>
      </section>

     {/* Map Left, Form Right Layout */}
<section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

    {/* Left Side: Map */}
    <div className="w-full h-[450px] lg:h-[600px] overflow-hidden">
      <Map1 />
    </div>

    {/* Right Side: Contact Form */}
    <div className="w-full">
      <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
        Send us a message
      </h3>

      <p className="text-neutral-500 mb-6">
        Fill out the form below and our team will respond within 24 hours.
      </p>

      <form className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              className="w-full px-5 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full px-5 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-5 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className="w-full px-5 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Message
          </label>
          <textarea
            rows="5"
            placeholder="How can we help you?"
            className="w-full px-5 py-3.5 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Send Message
          </button>
        </div>

      </form>
    </div>

  </div>
</section>

      {/* Global Presence: Compact Split Timeline */}
      <section className="bg-white py-16 lg:py-20 border-t border-neutral-200">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">Our Global Presence</h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium">
              Find a Kairaa Blockchain Academy near you. We are expanding rapidly to bring blockchain education everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
            {branchDetails && branchDetails.map((branch, idx) => (
              <div key={idx} className="relative pl-10 pb-8">
                {/* Continuous Vertical Line */}
                <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-primary-200 to-primary-50"></div>

                {/* Timeline Node */}
                <div className="absolute left-0 top-5 w-6 h-6 rounded-full bg-white border-[4px] border-primary-500 shadow-sm z-10"></div>

                {/* Content Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <FiMapPin className="text-primary-600 shrink-0" size={18} />
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight">{branch.city}</h3>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed pl-7">{branch.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
