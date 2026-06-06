import React from "react";
import Image from "../carouselimages/web_infographics.png";
import { GrSend } from "react-icons/gr";
import styled, { keyframes } from "styled-components";
const fly1 = keyframes`
from{
transform:translateY(0.1em);}
to{
transform:translateY(-0.1em);}`;
const Button = styled.button`
font-family:inherit;
font-size:20px;
background:royalblue;
color:white;
padding:0.3em 1em;
display:flex;
align-items:center;
border:none;
border-radius:16px;
overflow:hidden;
transition:all 0.25;
cursor:pointer;
span{
display:block;
margin-left:0.3em;
transiton:all 0.3margin-top:20px;
}
svg{
display:block;
transform-origin:center center;
transition:transform 0.3s ease-in-out;}
&:hover .svg-wrapper{
animation:${fly1} 0.6s ease-in-out infinite alternate;
}
&:hover svg{
transform:translateX(1.2em) rotate(45deg) scale(1.1);}
&:hover span{
transform:translateX(5em);
}
&:active{
transform:scale(0.9s);}`;

const Getstarted = () => {
  const onsubmitData = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        width: "100%",
      }}
      className="flex   xs:flex-row  flex-col md:text-4xl text-xl"
    >
      <div className="md:w-1/2  text-center justify-center  flex flex-col ">
        <div className="items-center text-center justify-center">
          <h3 className="  font-headingFont xs:my-4 my-3 md:my-6 xs:text-xl md:text-3xl">
            Blockchain Development Syllabus
          </h3>
          <a href="/Kairaa_Blockchain-Developer.pdf" download>
            <button className="text-white  w-fit px-2 py-2 my-3 xs:my-2 md:my-1  md:text-2xl text-lg rounded-md bg-gradient-to-r from-cyan-500 to-[#CB77F7] cursor-pointer">
              Download Syllabus
            </button>
          </a>
        </div>
      </div>

      <style>
        {`
          .custom-input::placeholder {
            color: rgba(255, 255, 255, 0.5); /* Customize your placeholder color here */
            opacity: 1; /* Ensures the placeholder color is fully opaque */
          }
        `}
      </style>

      <div className="md:w-3/6 w-full  md:my-20 xs:mx-5 xs:my-20 ">
        <div className="md:w-5/6 w-full md:p-8 shadow-lg text-xl rounded-lg items-center g-4 justify-center bg-gradient-to-r from-cyan-500 to-[#CB77F7]  font-paraFont ">
          <h3 className="text-3xl font-headingFont py-4 text-center text-white ">
            Get In Touch
          </h3>
          <form
            className="flex flex-col items-center"
            action="https://getform.io/f/pbmqqggb"
            method="POST"
          >
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              className="p-2 bg-transparent outline-none border-b-2  text-[#fff] focus:outline-none custom-input"
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email Address"
              className="p-2 bg-transparent outline-none  border-b-2  text-white focus:outline-none custom-input"
            />

            <input
              name="phone number"
              type="tel"
              placeholder="Your Contact Number"
              className="p-2 bg-transparent outline-none  border-b-2  text-white focus:outline-none custom-input"
            />

            <textarea
              name="message"
              rows="4"
              cols="80"
              className="  md:w-[400px] w-[300px] p-2 bg-transparent border-b-2 mt-8 text-white focus:outline-none custom-input"
              placeholder="Your Message"
            ></textarea>
            <button className="rounded-xl bg-white flex gap-2 text-blue-600 font-bold w-fit m-auto p-2 my-3 pt-2 px-3">
              <span className="my-1">
                <GrSend />
              </span>
              Submit{" "}
            </button>
            {/* <Button onClick={onsubmitData} className="my-3" type="submit">
              <button className="button display:flex">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </button>
              <div>
                <span>Submit</span>
              </div>
            </Button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Getstarted;
