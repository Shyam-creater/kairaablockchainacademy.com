import React,{useState} from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
function Terms_and_cond() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");


  const privacy = [
    {
      id: 1,
      heading: "Online Payments",
      paragraph: [
        "Kairaa Blockchain Academy provides this online payment solution. ",
        "Kairaa Blockchain Academy may revise these terms from time to time, and any modifications will take effect immediately upon being posted online.",
        "Please make sure you are aware of the current terms. Kairaa Blockchain Academy s domicile is in India.",
      ],
    },
   
    
    {
      id: 2,
      heading: "Refund Policy ",

      paragraph: [
        "* If the Customer leaves the Kairaa blockchain academy before they complete their service period, there shall be no entitlement to a refund of paid service fees. ",
        "* Refunds, if applicable, at the discretion of the Management, will only be made to the debit/credit card used for the original transaction. For the avoidance of doubt nothing in this Policy shall require the Kairaa blockchain academy to refund the Fees (or part thereof) unless such Fees (or part thereof) have previously been paid. ",
      ],
    },
    {
      id: 3,
      heading: "Privacy Policy ",
      paragraph: [
        "This Privacy Policy applies to all products, services, and websites provided by Kairaa blockchain academy. ",
        "We may occasionally upload product-specific privacy warnings or Help Centre materials to provide further information about our products. ",
        "If you have any questions regarding this Privacy Policy, please contact us through our website or email us at support@kairaaacademy.com. We collect information and use it to support our Kairaa blockchain academy. ",
      ],
    },
    {
      id: 4,
      heading: "Changes to Our Privacy Policy ",
      paragraph: [
        "Kairaa blockchain academy reserves the entire right to modify/amend/remove this privacy statement anytime and without any reason. ",
        "Nothing contained herein creates or is intended to create a contract/agreement between Kairaa blockchain academy and any user visiting the Kairaa blockchain academy website or providing identifying information of any kind. ",
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
    <>
     <Heading title="Kairaa Blockchain Academy – Privacy Policy" description="Read the payment terms and conditions for Kairaa Blockchain Academy courses. Visit Kairaa Blockchain Academy Payment Terms and Conditions for details." keywords="blockchain course, blockchain certification, blockchain academy" />
    <Header 
    open={open}
    setOpen={setOpen}
    activeItem={activeItem}
    setRoute={setRoute}
    route={route}
    />
      <div className="bg-blue-200 p-20 ">
        <h2 className="ml-5 md:text-5xl lg:text-4xl text-3xl font-headingFont  sm:text-3xl font-bold text-black p-2 border-l-4 border-l-black">
          Privacy Policy
        </h2>
      </div>
      <div className="leading-7 mx-auto p-3 container py-10 ">
        {privacy.map((e) => {
          return (
            <>
              <h2 className="text-2xl font-headingFont font-bold py-3">
                {e.heading}
              </h2>
              <li className="text-lg mb-3">{e.paragraph}</li>
            </>
          );
        })}
        <Link to="mailto:support@kairaaacademy.com">
          <p className="font-bold py-3">
            Contact Details: Email: support@kairaaacademy.com
          </p>
        </Link>
      </div>
      <Footer/>
    </>
  );
}

export default Terms_and_cond;
