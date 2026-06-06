import React,{useState} from "react";
import { IoLocationSharp } from "react-icons/io5";
import Header from "../components/Header";
import "../pages/Contact.css";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { branchDetails } from "../utils/branchDetails.js";
import Map1 from "../components/Map.js";
const ContactPage = () => {
  const [open,setOpen]=useState(false);
 
  const [route, setRoute]=useState("Login")

 
  return (
    <div className="overflow-x-hidden">
       <Heading title="Contact Us | Kairaa Blockchain Academy" description="Get in touch with Kairaa Blockchain Academy. Contact us for inquiries, collaborations, or support related to blockchain education and resources." keywords="blockchain course, blockchain certification, blockchain academy" />
    <Header 
    open={open}
    setOpen={setOpen}
    
    setRoute={setRoute}
    route={route}
    />
      <>
      <div className="flex justify-around md:mx-8 m-4 flex-col  md:flex-row">
        {/* contact us ++++++ chennai office details */}
        <div className="flex flex-col gap-8 items-center md:w-3/6 w-full xs:m-4 md:m-4 h-full">
       <Map1/>
          {/* <iframe
            title="contactmap"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.657021634854!2d76.93245844534019!3d11.007513406523273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8591b63cb9031%3A0xb7ccd4bb77643789!2sKairaa%20Blockchain%20Academy!5e0!3m2!1sen!2sin!4v1717837372242!5m2!1sen!2sin"
            width="650"
            height="600"
           
            style={{ border: "0" }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          /> */}
        </div>
        {/* form */}
        <div className=" md:mx-8 p-4  md:w-3/6 w-full ">
          <div className="md:w-5/6 w-full p-8 shadow-lg rounded-lg items-center g-4 justify-center">
            <h2 className="text-3xl font-headingFont font-bold ">
              Say <span className="text-[#0874DD]">Hello !</span>
            </h2>
            <p className="py-4 text-xl font-semibold">
              Feel free to stop by and say hi !
            </p>
            <form className="flex flex-col text-lg ">
              <label className="">Name</label>
              <input
                type="text"
                className="w-full border border-blue-200  px-6 rounded-md"
              />


              <label>E-mail Id</label>
              <input
                type="email"
                className="w-full border border-blue-200  px-6 rounded-md"
              />


              <label className="">Contact Number</label>
              <input
                type="tel"
                className="w-full border border-blue-200  px-6 rounded-md"
              />


              <label>Message</label>
              <textarea
                rows="4"
                cols="40"
                className="border border-blue-200 w-full"
              ></textarea>


              <button className="text-white w-fit md:px-6 md:py-3 p-2 my-4 md:text-xl text-lg font-bold rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer z-10 hover:scale-110 duration-300">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* ********************************************************************************* */}
      <div className="md:text-4xl xs:text-2xl font-bold items-center text-center my-6 px-10 py-10 ">
        <h2 className="font-headingFont  py-3">Our Branches</h2>
      </div>
      <div className="flex items-center  xs:mx-20 justify-center text-center mt-2 xs:mb-40 md:mb-10 px-10 py-10">
        <div className="grid md:grid-cols-3 gap-5 md:w-[1400px] md:h-[900px] xs:grid-cols-2 grid-cols-1">
          {branchDetails && branchDetails.map((e) => {
            return (
              <>
                <div className="border-2 bg-gradient-to-t relative transition-transform duration-1000 ease-in-out hover:scale-110 hover: overflow-hidden from-cyan-500  to-[#CB77F7] rounded-s-3xl">
                  <div className="flex items-center justify-center text-center  text-5xl p-3">
                    <IoLocationSharp />
                  </div>
                  <h2 className="text-xl p-3 bg-[whitesmoke] font-bold">
                    {e.city}
                  </h2>
                  <p className="text-lg p-2 my-5 text-[#f8f8f8]">{e.address}</p>
                  <div class="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all   duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-75"></div>
                  <div class="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all    duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-100"></div>
                  <div class="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all    duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-150"></div>
                  <div class="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all    duration-500 ease-in-out bg-gradient-to-r from-cyan-500 to-[#CB77F7] delay-150 group-hover:delay-200"></div>
                  <div class="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out  delay-150 group-hover:delay-300"></div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>

      <Footer/>
    </div>
  );
};

export default ContactPage;
