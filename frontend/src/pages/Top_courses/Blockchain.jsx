import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import TopBlock from '../../assets/topcourseBlockchain.jpg'
import { courses } from '../Top_courses/Data/BlockchainData';
import Header from '../../components/Header';
import Footer from "../../components/Footer";
import Heading from '../../components/Heading';

function Blockchain() {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(2);
    const [route, setRoute] = useState("Login");
    
    return (
        <>
         <Heading title="Blockchain Certification Program | Kairaa Blockchain Academy" description="Advance your career with Kairaa Academy's Blockchain certification course. Explore vast modules, get in-depth knowledge, and earn a recognized certificate." keywords="blockchain course, blockchain certification, blockchain academy" />
        <Header 
    open={open}
    setOpen={setOpen}
    activeItem={activeItem}
    setRoute={setRoute}
    route={route}
    />
            <div className='md:px-12 p-4 max-w-screen-2xl mx-auto mt-10 animate-fadeInUp '>
                <div className='bg-[#F7F4FD] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-10'>
                        <div className='md:w-3/9'>
                            <h2 className='sm:text-4xl md:text-[42px] font-headingFont text-3xl text-black font-bold mb-5 '>Courses Offered in Blockchain Development</h2>


                            {/* <div className='py-3'>
                                <button className='p-3 hover:bg-[#fff] text-black rounded-2xl text-lg bg-[#CADDFE]'>Get Started</button>
                            </div> */}</div>

                        <div className='md:w-1/4 w-full px-5'>
                            <img className='rounded-2xl' src={TopBlock} alt="" />

                        </div>
                    </div>
                </div></div>
            {/* *************************************************************************** */}
            <div className='text-center py-5 '>
                <h2 className='md:text-4xl text-2xl font-bold font-headingFont text-center'>Our Top Most Courses (Blockchain) </h2>
            </div>
            {courses.map((e) => (<div className='container mx-auto py-4 animate-zoomIn px-10 '>
                <div className='flex gap-5 flex-col xs:flex-row border-b-2 border-gray-400'>
                    <div className='md:w-1/2'>
                        <img src={e.image} className='rounded-lg' alt="" />
                        <div className='bg-blue-100 text-center'>
                            <p className='text-2xl font-medium'>{e.title} </p>
                            

                        </div>


                    </div>
                    <div className='md:w-1/2 py-3 text-lg '>
                        <p>{e.paragraph1}
                        </p>
                        {/* <p>{e.paragraph2}</p> */}
                        <div className='text-center py-3 '>
                           <Link key={e.id} to={`/course/${e.id}`}> <button className='bg-gradient-to-r from-cyan-500 to-[#CB77F7] animate-bounce shadow-2xl shadow-gray-400 hover:bg-blue-800 rounded mt-10 p-2'>View More</button></Link></div>
                    </div>
                </div>

            </div>))}
<Footer/>
        </>
    )
}


export default Blockchain;  
