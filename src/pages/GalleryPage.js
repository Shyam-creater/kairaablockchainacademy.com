import React, { useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { useGetAllGalleryImageQuery } from "../redux/features/gallery/galleryApi";
import Loader from "../components/Loader/Loader";

const GalleryPage = () => {
  const [open, setOpen] = useState(false);
  
  const [route, setRoute] = useState("Login");

  const { data, isLoading } = useGetAllGalleryImageQuery();

const images=data?.images;
console.log(images)
  
  return (
    <>
      <Heading
        title="Kairaa Blockchain Academy Gallery – Explore Our Highlights"
        description="Visit Kairaa Blockchain Academy gallery to see the highlights of our events and achievements."
        keywords="blockchain course, blockchain certification, blockchain academy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        
        setRoute={setRoute}
        route={route}
      />

<div className="md:px-12 p-2 pt-8 max-w-screen-2xl md:mx-auto mt-10 animate-rotateAndSlideIn">
        <div className="bg-[#CADDFE] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/5">
              <h2 className="sm:text-4xl md:text-5xl font-headingFont text-3xl text-black font-bold mb-5 ">
               Gallery
              </h2>
            </div>

           
          </div>
        </div>
      </div>

      {isLoading ? (<Loader/>):(
        <div className="grid md:grid-cols-3 grid-cols-1 m-8 gap-4">
        {images && images.map((item) => {
          return (
            <div
              key={item.id}
              className="w-full  p-4 bg-gray-50 flex flex-col gap-4 rounded-lg"
            >
              <img
                className="rounded-lg object-cover h-[300px]"
                src={item?.image?.url}
              />
              <p className="w-fit bg-[#DC81A7] px-2 pt-1 rounded-md text-white font-bold font-paraFont text-sm">
                {item.tags}
              </p>
              <p className="text-lg font-medium font-headingFont">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
      )}
      
      <Footer />
    </>
  );
};

export default GalleryPage;
