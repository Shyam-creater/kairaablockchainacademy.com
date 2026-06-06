import React,{useState} from 'react';
import { Link} from 'react-router-dom';
import TopBlock from '../../assets/TopCourses.jpg'
import { courses1} from '../Top_courses/Data/OthercoursesData';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Heading from '../../components/Heading';


function OtherCourse() {
    const [open, setOpen] = useState(false);

  const [route, setRoute] = useState("Login");
    
    

    return (
        <>
         <Heading title="Top Programming Courses | Kairaa Blockchain Academy" description="Kairaa Blockchain Academy offers top programming courses like C, C++, Advanced Java, PHP, Flutter, and SQL. Learn and enhance your programming skills." keywords="C, C++, Advanced Java, PHP, Flutter,SQL" />
        <Header 
    open={open}
    setOpen={setOpen}

    setRoute={setRoute}
    route={route}
    />
            <div className='md:px-12 p-4 max-w-screen-2xl mx-auto mt-10 animate-fadeInUp '>
                <div className='bg-[#F7F4FD] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9'>
                    <div className='flex flex-col xs:flex-row justify-around items-center gap-10'>
                        <div className='md:w-3/9'>
                            <h2 className='sm:text-4xl md:text-[42px] text-3xl text-black font-headingFont font-bold mb-5 '>Courses Offered in Programming Languages.</h2>


                            </div>

                        <div className='md:w-1/4 w-full px-2'>
                            <img className='rounded-2xl' src={TopBlock} alt="" />

                        </div>
                    </div>
                </div></div>

            {/* *************************************************************************** */}
            <div className='text-center py-5 '>
                <h2 className='md:text-4xl xs:text-2xl font-bold font-headingFont text-center'>Our Top Other Popular Courses </h2>
            </div>
            {courses1.map((e) => (<div className='container mx-auto py-4 px-10 animate-zoomIn '>
                <div className='flex gap-5 flex-col xs:flex-row border-b-2 border-gray-400'>
                    <div className='md:w-1/2'>
                        <img src={e.image} className='rounded-lg' alt="" />
                        <div className='bg-blue-100 text-center'>
                            <p className='text-2xl font-medium'>{e.title} </p>

                           

                        </div>


                    </div>
                    <div className='md:w-1/2 py-3 text-lg'>
                        <p>{e.paragraph1}
                        </p>
                       
                        <div className='text-center py-3'>
                        <Link key={e.id} to={`/top-courses/${e.id}`}> <button className='bg-gradient-to-r from-cyan-500 to-[#CB77F7] shadow-gray-500 shadow-2xl animate-pulse rounded-lg mt-10 p-2'>View More</button></Link></div>
                    </div>
                </div>

            </div>))}
<Footer/>
        </>
    )
}

export default OtherCourse;