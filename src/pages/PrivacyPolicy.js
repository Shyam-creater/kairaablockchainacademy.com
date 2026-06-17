import React, { useState } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HiOutlineMail } from "react-icons/hi";

function PrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const privacy = [
    {
      id: 1,
      heading: "Online Payments",
      paragraph: [
        "Kairaa Blockchain Academy provides this online payment solution.",
        "Kairaa Blockchain Academy may revise these terms from time to time, and any modifications will take effect immediately upon being posted online.",
        "Please make sure you are aware of the current terms. Kairaa Blockchain Academy's domicile is in India.",
      ],
    },
    {
      id: 2,
      heading: "Refund Policy",
      paragraph: [
        "If the Customer leaves the Kairaa blockchain academy before they complete their service period, there shall be no entitlement to a refund of paid service fees.",
        "Refunds, if applicable, at the discretion of the Management, will only be made to the debit/credit card used for the original transaction. For the avoidance of doubt nothing in this Policy shall require the Kairaa blockchain academy to refund the Fees (or part thereof) unless such Fees (or part thereof) have previously been paid.",
      ],
    },
    {
      id: 3,
      heading: "Privacy Policy",
      paragraph: [
        "This Privacy Policy applies to all products, services, and websites provided by Kairaa blockchain academy.",
        "We may occasionally upload product-specific privacy warnings or Help Centre materials to provide further information about our products.",
        "If you have any questions regarding this Privacy Policy, please contact us through our website or email us at support@kairaaacademy.com. We collect information and use it to support our Kairaa blockchain academy.",
      ],
    },
    {
      id: 4,
      heading: "Changes to Our Privacy Policy",
      paragraph: [
        "Kairaa blockchain academy reserves the entire right to modify/amend/remove this privacy statement anytime and without any reason.",
        "Nothing contained herein creates or is intended to create a contract/agreement between Kairaa blockchain academy and any user visiting the Kairaa blockchain academy website or providing identifying information of any kind.",
      ],
    },
    {
      id: 5,
      heading: "DND Policy",
      paragraph: [
        "To unsubscribe from our email notifications, SMS alerts, or contacts, simply send an email to support@kairaaacademy.com with your mobile number. Your email will be removed from the alert list.",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Heading 
        title="Kairaa Blockchain Academy – Privacy Policy" 
        description="Read the payment terms and conditions for Kairaa Blockchain Academy courses. Visit Kairaa Blockchain Academy Payment Terms and Conditions for details." 
        keywords="blockchain course, blockchain certification, blockchain academy" 
      />
      
      <Header 
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      {/* Premium Hero Section */}
      <div className="relative bg-[#0A3D62] pt-24 pb-32 overflow-hidden">
        {/* Abstract Geometric Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border-[40px] border-white/5"></div>
          <div className="absolute bottom-[-100px] left-[-50px] w-80 h-80 rounded-full bg-white/5 backdrop-blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-headingFont tracking-tight mb-6">
            Privacy <span className="text-[#38BDF8]">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Your privacy is critically important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content Section inside a floating card */}
      <div className="flex-grow -mt-20 relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 md:p-16">
          
          <div className="space-y-12">
            {privacy.map((section, index) => (
              <div key={section.id} className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-headingFont border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-headingFont font-bold text-slate-800">
                    {section.heading}
                  </h2>
                </div>
                
                <div className="pl-0 sm:pl-14 space-y-4">
                  {section.paragraph.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed text-lg flex items-start gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>{para}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <hr className="my-12 border-slate-200" />

          {/* Contact Support Block */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineMail size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-headingFont">Have more questions?</h3>
            <p className="text-slate-600 mb-6">
              If you have any questions regarding this Privacy Policy, please contact our support team.
            </p>
            <Link to="mailto:support@kairaaacademy.com" className="inline-flex items-center justify-center px-6 py-3 bg-[#0A3D62] text-white font-medium rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
              support@kairaaacademy.com
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
