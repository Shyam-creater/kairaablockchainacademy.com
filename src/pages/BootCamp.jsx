import React,{useState} from "react";
import Header from "../components/Header";
import imagebanner from "../assets/bootcamp.png";
import "../pages/Bootcamp.css";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

function BootCamp() {

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  const data = [
    {
      id: 1,
      one: "Introduction to Blockchain",
      two: "1 hour",
      paragraph: [
        "What is Blockchain?",
        "History and Evolution of Blockchain.",
        "Key Features and Benifits.",
      ],
    },
    {
      id: 2,
      one: "How Blockchain Works.",
      two: "1.5 hour",
      paragraph: [
        "What is Blockchain?",
        "Structure of Blockchain.",
        "Cryptography in Blockchain.",
        "Consensus Mechanism.",
        "Transaction Verification and Validation.",
      ],
    },
    {
      id: 3,
      one: "Blockchain Use Cases",
      two: "1.5 hour",
      paragraph: [
        "Cryptocurrencies(Bitcoin, Ethereum)",
        "Supply Chain Management.",
        "Healthcare and Identity Verification.",
        "Smart Contracts and Decentralized Applications.",
      ],
    },
    {
      id: 4,
      one: "Blockchain Ecosystem.",
      two: "1 hour",
      paragraph: [
        "Public vs Private Blockchain.",
        "Ethereum and Smart Contracts.",
        "Other Major Blockchain Platforms",
        "Walleta and Exchanges.",
      ],
    },
    {
      id: 5,
      one: "Challenges and Future Trends.",
      two: "0.5 hour",
      paragraph: [
        "Scalability and Energy Consumption.",
        "Regulatory and Legal Considerations.",
        "Emerging Trends Legal Considerations.",
        "The Future of Blockchain.",
      ],
    },
    {
      id: 6,
      one: "Conclusion and Q&A.",
      two: "0.5 hour",
      paragraph: [
        "Recap of Key Concepts.",
        "Regulatory and Legal Considerations.",
        "Open Discussion and Participant Questions.",
        "Final Certification Delivery.",
      ],
    },
  ];

  const section2 = [
    {
      id: 1,
      heading1: " About The Program ",
      paragraph:
        " Blockchain Developer Bootcamp aims to provide an experience in Blockchain development to blockchain beginners. The sessions wil give a walkthrough of popular tools necessary for dApp development and a step-by-step guide to implementing decentralized application.",
      heading2: "  What You Will Learn?",
      headingList: [
        "* Blockchain Fundamentals. ",
        "* Cryptocurrency Expert.",
        "* Navigating Cryptocurrencies.",
        "* Blockchain for global Impact.",
        "* Bitcoin Cryptocurrency.",
        "* Cryptocurrency Beginner Guide.",
      ],
      heading3: " What You Will Earn?",
      heading3List: [
        "* A Blockchain-powered Certificate. ",
        "* After Completing the Program.",
        "* Well knowledge about Blockchain.",
        "* Real world Contribution of Blockchain.",
      ],
    },
  ];

  return (
    <>
     <Heading title="Blockchain Bootcamp | Kairaa Blockchain Academy " description="Join Kairaa Blockchain Academy's Bootcamp for extensive blockchain knowledge and practical experience. Enroll now to become a Blockchain Professional!" keywords="blockchain course, blockchain certification, blockchain academy" />
    <Header 
    open={open}
    setOpen={setOpen}
    activeItem={activeItem}
    setRoute={setRoute}
    route={route}
    />
      <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-3 ">
        {" "}
        <div className="bg-[#F7F4FD] rounded-xl rounded-br-[80px]  md:p-20 px-4 py-9 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 ">
            <div className="md:w-3/5">
              {/*  <div className="slider-thumb "></div> */}


              <h2 className="sm:text-4xl md:text-[42px]  font-headingFont text-3xl text-black font-bold mb-5 ">
                BOOTCAMP
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* *************************************************** **********************************************/}
      {section2.map((e) => {
        return (
          <>
            <div className="container mx-auto">
              <div className="mx-10">
                <h2 className="md:text-2xl font-headingFont text-lg font-bold py-2">
                  {e.heading1}
                </h2>
                <p className="py-2 text-lg leading-10 text-medium">
                  {e.paragraph}
                </p>
              </div>
            </div>
            <div className="container mx-auto">
              <div className="mx-10 flex xs:flex-row flex-col ">
                <div className="md:w-1/2">
                  <h2 className="md:text-2xl text-lg font-headingFont font-bold py-2">
                    {e.heading2}
                  </h2>
                  <ul className="py-2 text-lg leading-10 text-medium ">
                    {e.headingList.map((e1) => (
                      <li> {e1}</li>
                    ))}
                  </ul>


                  <h2 className="md:text-2xl text-lg font-headingFont font-bold py-2"></h2>
                  <ul className="py-2 text-lg leading-10 text-medium ">
                    {e.heading3List.map((e1) => (
                      <li>{e1}</li>
                    ))}
                  </ul>
                </div>
                <div className="xs:w-[40%]  p-2">
                  <img className="rounded-2xl " src={imagebanner} alt="" />
                </div>
              </div>
            </div>{" "}
          </>
        );
      })}
      {/* ********************************** **********************************************************/}
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
  <div className="mx-4 md:mx-10">
    <h2 className="md:text-2xl text-lg font-headingFont font-bold py-2">
      Program Details
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border-2 border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-sm md:text-lg text-left pl-4 md:pl-10 p-2 font-headingFont font-bold text-gray-800 uppercase tracking-wider">
              Sessions
            </th>
            <th className="text-sm md:text-lg font-bold text-center font-headingFont text-gray-800 uppercase tracking-wider">
              Duration
            </th>
            <th className="text-sm md:text-lg text-left pl-8 md:pl-16 font-headingFont font-bold text-gray-800 uppercase tracking-wider">
              Covered Topics
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm md:text-lg">
          {data.map((e, index) => (
            <tr key={index}>
              <td className="p-2 md:p-5">{e.one}</td>
              <td className="p-2 md:p-5">{e.two}</td>
              <td className="p-2 md:p-5">
                {e.paragraph.map((e1, subIndex) => (
                  <div key={subIndex} className="pl-2 md:pl-5">
                    ⋆ {e1}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>



     </div>
      <Footer/>
    </>
  );
}

export default BootCamp;
