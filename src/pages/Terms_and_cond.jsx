import React, { useState } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HiOutlineDocumentText } from "react-icons/hi";

function Terms_and_cond() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  const terms = [
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
      heading: "Terms & Conditions",
      paragraph: [
        "Please read these terms carefully before using the online payment system.",
        "Using the online payment function on our website shows that you agree to these conditions. If you do not agree to these terms, do not use this feature.",
      ],
    },
    {
      id: 3,
      heading: "All payments are subject to the following conditions:",
      paragraph: [
        "When you log in with your unique password, the descriptions of matchmaking services are personalized to your specific needs.",
        "Payment is typically demanded in advance. All fees are quoted in Indian rupees. The Kairaa Blockchain Academy reserves the right to alter fees at any time.",
        "Your payment will usually reach the Kairaa Blockchain Academy account to which you are making a payment within two working days.",
        "1. We cannot assume responsibility for a payment not reaching the correct account of Kairaa Blockchain Academy because you provided a wrong account number or personal information. We cannot assume liability if payment is refused or declined by the credit/debit card supplier for any reason.",
        "2. If the card supplier denies payment, Kairaa Blockchain Academy is under no duty to notify you. You should confirm with your bank/credit/debit card provider that the payment has been debited from your account.",
        "3. Kairaa Blockchain Academy will not be liable for any damages arising from the use, inability to use, or results of use of this site, any websites linked to this site, or the materials or information contained at any or all such sites, whether based on warranty, contract, tort, or any other legal theory, and whether or not advised of the possibility of such damages.",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Heading 
        title="Kairaa Blockchain Academy – Terms and Conditions" 
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
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full border-[40px] border-white/5"></div>
          <div className="absolute bottom-[-100px] right-[-50px] w-80 h-80 rounded-full bg-white/5 backdrop-blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-headingFont tracking-tight mb-6">
            Terms & <span className="text-[#38BDF8]">Conditions</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before engaging with our platform and services.
          </p>
        </div>
      </div>

      {/* Content Section inside a floating card */}
      <div className="flex-grow -mt-20 relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 md:p-16">
          
          <div className="space-y-12">
            {terms.map((section, index) => (
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
              <HiOutlineDocumentText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-headingFont">Need Clarification?</h3>
            <p className="text-slate-600 mb-6">
              If you have any questions regarding these terms and conditions, please contact our support team.
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

export default Terms_and_cond;
