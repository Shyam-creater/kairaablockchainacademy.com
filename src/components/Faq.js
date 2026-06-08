"use client";
import React, { useState } from "react";


export default function Faq() {
  const [faqs, setFaqs] = useState(null);
  const ViewOrNot = (id) => {
    if (faqs === id) {
      setFaqs(null);
    } else {
      setFaqs(id);
    }
  };


  const faqData = [
    {
      id: 1,
      question: "What courses does Kairaa Blockchain Academy offer?",
      answer:
        "Kairaa Blockchain Academy offers a wide range of courses covering blockchain technology, cryptocurrency, smart contracts, decentralized finance (DeFi), and more. Our courses are designed to cater to beginners as well as experienced professionals in the blockchain industry.",
      isOpen: false,
    },
    {
      id: 2,
      question:
        "Are the courses at Kairaa Blockchain Academy suitable for beginners?",
      answer:
        "Yes, our courses are structured to accommodate learners at all levels, including beginners. We provide comprehensive introductory material, hands-on projects, and expert guidance to ensure that beginners can grasp blockchain concepts effectively.",
    },
    {
      id: 3,
      question:
        "Is financial aid available for Kairaa Blockchain Academy's courses?",
      answer:
        "Kairaa Blockchain Academy understands the importance of accessibility in education. We offer financial aid options, scholarships, and flexible payment plans to make our courses more accessible to deserving candidates. Contact us to learn more about our financial assistance programs.",
    },


    {
      id: 4,
      question: "Do you offer any mentorship or career guidance programs?",
      answer:
        "Currently we have career raodmap which cater to different goals. Coming soon we will include both mentorship and career guidance along with Mock interviews and much more. So stay tuned!",
    },
  ];


  // const toggleFaq = (i) => {


  //     setFaqs(i)


  // }


  return (
    <>
     <div className="container mx-auto flex justify-center xs:px-36 xs:py-10 items-center text-center my-4 px-4 py-10  md:text-xl text-lg">
  <div className="flex flex-col gap-4 w-full">
    <h1 className="text-3xl md:text-4xl font-headingFont font-bold xs:text-2xl py-3">
      Frequently Asked Questions
    </h1>
    {faqData.map((e, i) => (
      <div key={e.id} className="border-b-gray-100 font-paraFont">
        <div
          onClick={() => ViewOrNot(e.id)}
          className="flex justify-between items-center  gap-4 text-left bg-gradient-to-r from-cyan-500 to-[#CB77F7] border-2 border-gray-400 rounded-bl-2xl rounded-tr-2xl p-4 md:p-5 cursor-pointer text-[#f2f2f2]"
        >
          <p className="font-bold">{e.question}</p>
          <button className="text-xl" onClick={() => ViewOrNot(e.id)}>
            {faqs === e.id ? "⊝" : "⊕"}
          </button>
        </div>


        {faqs === e.id && (
          <div className="px-4 py-6 bg-[#EEF4FA]">
            <p className="p-4">{e.answer}</p>
          </div>
        )}
        <hr />
      </div>
    ))}
  </div>
</div></>
)}



