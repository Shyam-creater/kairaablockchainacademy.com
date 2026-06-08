import React, { useEffect, useState, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import reading from '../assets/reading.png'


export default function Carousel() {
  const sliderContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [sliderContainerWidth, setSliderContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  let elementsToShow = 3;
  const courses = [
    {
      id: 1,
      
      course:
        "I had a great experience with the Blockchain Fundamental courses at Kairaa Blockchain Academy.I joined their training program, and",
      explore:
        "  it helped me develop a solid understanding of core blockchain concepts. My trainer and the faculty made it easy for me to grasp the fundamentals of blockchain technology. Thank you, Kairaa Blockchain Academy and their management team!",
    },
    {
      id: 2,
     
      course:
        "I am here for the Blockchain Professional course. The trainer is experienced and actively working on projects, which helped me gain ",
      explore:
        "both practical and theoretical knowledge. The institute offers affordable course fees, and I recommend newcomers to join here. Thanks to my trainer and Kairaa Blockchain Academy!",
    },
    {
      id: 3,
     
      course:
        "I attended the Java Programming training Course at Kairaa Blockchain Academy. The classes were good, and the explanation of all",
      explore:
        " concepts was precise and to the point. Both theoretical and practical aspects, as well as the use of relevant tools, were thoroughly explained. The faculty is knowledgeable. Overall, it provides a good environment for learning.",
    },
    {
      id: 4,
    
      course:
        "The C course at Kairaa Blockchain Academy was good. The classes were well-organized, and the explanation of all concepts was",
      explore:
        " precise and to the point. Both theoretical and practical aspects, as well as the use of tools, were thoroughly explained. The faculty is knowledgeable. Overall, it provides a good environment for learning at Kairaa Blockchain Academy.",
    },
    {
      id: 5,
     
      course:
        "I finished my Web Development course at Kairaa Blockchain Academy with the trainer. The trainer taught web development concepts",
      explore:
        " with real-time examples. Overall, it's a very good place to learn web development for both technical and non-technical people. Thanks to Kairaa Blockchain Academy!",
    },
    {
      id: 6,
     
      course:
        "I have successfully completed the Blockchain Developer Expert course at Kairaa Blockchain Academy. The training covered a lot ",
      explore:
        "of topics in depth, and we also gained good hands-on experience with real-time scenarios. Thank you for everything. Thank you, Kairaa Blockchain Academy!",
    },
  ];
  const [explore, setExplore] = useState("");
  const exploreMore = (id) => {
    if (explore === id) {
      setExplore(null);
    } else {
      setExplore(id);
    }
  };
  useEffect(() => {
    const sliderContainer = sliderContainerRef.current;
    const slider = sliderRef.current;

    if (sliderContainer) {
      const width = sliderContainer.clientWidth;
      setSliderContainerWidth(width);
      setCardWidth(width / elementsToShow);
    }

    if (sliderContainer && slider) {
      const cards = Array.from(sliderContainer.getElementsByTagName("li"));
      setCards(cards);

      const cardWidth = sliderContainerWidth / elementsToShow*3;
      slider.style.width = `${cards.length * cardWidth}px`;

      for (let i = 0; i < cards.length; i++) {
        const element = cards[i];
        element.style.width = `${cardWidth}px`;
      }
    }
  }, [sliderContainerWidth]);

  const prev = () => {
    const slider = sliderRef.current;
    const cardWidth = sliderContainerWidth / elementsToShow*3;
    if (slider) {
      const currentMarginLeft =
        parseInt(slider.style.marginLeft.slice(0, -2)) || 0;
      const newMarginLeft = Math.min(currentMarginLeft + cardWidth, 0);
      slider.style.marginLeft = `${newMarginLeft}px`;
    }
  };

  const next = () => {
    const slider = sliderRef.current;
    const cardWidth = sliderContainerWidth / elementsToShow*3;
    const maxMarginLeft = -cardWidth * (cards.length - elementsToShow);
    if (slider) {
      const currentMarginLeft =
        parseInt(slider.style.marginLeft.slice(0, -2)) || 0;
      const newMarginLeft = Math.max(
        currentMarginLeft - cardWidth,
        maxMarginLeft
      );
      slider.style.marginLeft = `${newMarginLeft}px`;
    }
  };

  return (
    <>
      <div className="my-8 hidden flex-col md:block ">
        <h2 className="md:text-4xl font-headingFont text-2xl font-bold text-center pt-8">
          What learners say about us
        </h2>

        <div className="flex m-8">
          <div className="w-0.5/12 flex items-center">
            <div className="w-full text-right">
              <button className="mr-5" onClick={prev}>
                <IoIosArrowBack
                  style={{ fontSize: "50px", color: "#fc466b" }}
                />
              </button>
            </div>
          </div>
          <div
            className="w-11/12 overflow-x-auto scrollbar-hidden"
            id="sliderContainer"
            ref={sliderContainerRef}
          >
            <ul
              id="slider"
              className="flex w-full transition-margin duration-700"
              ref={sliderRef}
            >
              {courses.map((dt) => {
                return (
                  <li key={dt.id} className="  p-4  ">
                    <div className="shadow-inner  shadow-black rounded-lg p-3 h-full   bg-gradient-to-r from-cyan-500 to-[#CB77F7]  ">
                      {/* <img src={dt.img} className='h-200 w-full object-cover rounded-md' /> */}
                      <div className="p-5 bg-[#fff] rounded-tr-xl">
                        <img src={reading} className="w-[100px] h-[100px] rounded-xl ml-5 bg-gradient-to-r from-cyan-500 to-[#CB77F7] " alt=""/>
                        <h2 className=" text-lg p-4 mt-4 font-semibold font-paraFont">
                          {dt.course}
                        {explore===dt.id&&(<span className="  text-lg pl-4 pr-4 font-semibold font-paraFont">
                          {dt.explore}
                        </span>)}
                        
                       
                        <button onClick={()=>exploreMore(dt.id)} className="ml-2 rounded-md underline  text-slate-400 font-paraFont font-bold">
                          {explore===dt.id? "less":"more"}
                        </button></h2>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-0.5s/12 flex items-center  ">
            <div className="w-full ">
              <button className="ml-5 " onClick={next}>
                <IoIosArrowForward
                  style={{ fontSize: "50px", color: "#fc466b" }}
                />
              </button>
            </div>
          </div>
        </div>

        <button className="animate-slidein700 opacity-0 text-white w-fit px-6 py-3 my-2 text-2xl rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer m-auto">
          Explore More
        </button>
      </div>
      <div className="flex flex-col gap-4 md:hidden p-8">
        <h2 className="md:text-4xl font-headingFont text-xl font-bold text-center pt-8">
          Explore our learning Programs
        </h2>
        {courses.map((course) => {
          return (
            <div
              key={course.id}
              className="w-full text-[#fff] p-4 bg-gradient-to-r from-cyan-500 to-[#CB77F7]  flex flex-col gap-2 rounded-lg"
            ><img src={reading} className="w-[100px] h-[100px] rounded-xl text-center ml-5 bg-gradient-to-r from-cyan-500 to-[#CB77F7] " alt=""/>
                        
              <h2 className=" mt-4 font-semibold font-paraFont text-center">
                {course.course}{explore===course.id&&(<span>{course.explore}</span>)}
              
              <button onClick={()=>exploreMore(course.id)} className='ml-2 text-lg   rounded-md underline text-slate-200 font-paraFont font-bold'>
                {explore===course.id?"less":"more"}
              </button></h2>
            </div>
          );
        })}
      </div>
    </>
  );
}
