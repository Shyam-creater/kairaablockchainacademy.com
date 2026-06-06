import React, { useState, useEffect } from "react";
import Ratings from "../Admin/Course/Ratings";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";
import CustomModel from "../../utils/CustomModel.js";
import { styles } from "../../styles/style.js";
import CourseContentList from "./CourseContentList.js";
import Signup from "../Auth/Signup.js";
import axios from "axios";
import Login from "../Auth/Login.js";
import Verification from "../Auth/Verification.js";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";


const CourseDetails = ({ data ,currentUser}) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [loader, setloader] = useState(false);
  // const [user, setUser] = useState();
  // const [redirect, setRedirect] = useState(false);
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [isPurchased, setIsPurchased] = useState(false);
  useEffect(() => {
    if (userData?.user) {
      setIsPurchased(
        userData.user.courses.some((item) => item._id === data._id)
      );
    }else {
      setIsPurchased(false); 
    }
  }, [userData,setIsPurchased, data]);

  console.log("huj", userData);

  const discoutPercentage =
    ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const discoutPercentagePrice = discoutPercentage.toFixed(0);

  

  console.log(isPurchased, "datamy.user");
  const paymentHandler = async (e) => {

   
      if (!currentUser) {
        toast.error("Please login to purchase the course...");
        setOpen(true);
        return;
      }
      const API_URL =
        "https://back.kairaablockchainacademy.com/api/v1/createorder";
      const Payurl =
        "https://back.kairaablockchainacademy.com/api/v1/verifyorder";

      e.preventDefault();

      const optionsSada = {
        couresId: data._id,
        data: {
          amount: data?.price * 100,
          currency: "INR",
          receipt: "receipt#1",
          payment_capture: 1,
        },
      };
      try {
        setloader(true);

        const response = await axios.post(API_URL, optionsSada, {
          withCredentials: true,
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          name: "Kairaa Blockchain Academy",
          description: "Some Description",
          order_id: response.data.id,
          handler: async (response) => {
            console.log(response, "response");
            let verifYdata = { couresId: data._id, response };
            try {
              const captureResponse = await axios.post(Payurl, verifYdata, {
                withCredentials: true,
              });
              // setRedirect(true);
              // refetch();
              // window.location.reload();
              // fetchData();
            } catch (err) {
              console.log("err", err);
            }
          },
          theme: {
            color: "#0A75DC",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        refetch();
        setloader(false);
      } catch (error) {
        setloader(false);
        console.log(error, "error");
      }
    
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5 mt-[80px] ">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[30px] font-poppins font-bold text-black ">
              {data?.name}
            </h1>

            {/* <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data?.ratings} />
                <h5 className="text-black ">{data?.reviews?.length} Reviews</h5>
              </div>
              <h5 className="text-black ">{data?.purchased} Students</h5>
            </div> */}
            <br />
            <h1 className="text-black  font-poppins font-bold text-[25px]">
              What you will learn from this course?
            </h1>
            <div>
              {data?.benefits?.map((item, index) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline size={20} className="text-black " />
                  </div>
                  <p className="pl-2 text-black ">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>

            <h1 className="text-black  font-poppins font-bold text-[25px]">
              What are the prerequisites for this course?
            </h1>

            {data?.prerequisites?.map((item, index) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline size={20} className="text-black " />
                </div>
                <p className="pl-2 text-black ">{item.title}</p>
              </div>
            ))}

            <br />
            <br />
            <div>
              <h1 className="text-black  font-poppins font-bold text-[25px]">
                Course Overview
              </h1>
              {/* courseContentList */}
              <CourseContentList data={data?.courseContentData} isDemo={true} />
            </div>

            <br />
            <br />
            {/* course description*/}
            <div className="w-full">
              <h1 className="text-[25px] font-poppins font-bold text-black ">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black ">
                {data?.description}
              </p>
            </div>
            <br />
            <br />
            {/* <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]">
                  <h5 className="text-[20px] font-poppins text-black ">
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings.toFixed(2)}{" "}
                    Course Rating • {data?.reviews?.length} Reviews
                  </h5>
                </div>
                <br />
                {(data?.reviews && [...data?.reviews].reverse()).map(
                  (item, index) => (
                    <div className="w-full pb-4" key={index}>
                      <div className="flex">
                        <div className="w-[50px] h-[50px]">
                          <img
                            src={
                              item.user.avatar
                                ? item.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="hidden 800px:block pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[18px] pr-2 text-black ">
                              {item.user.name}
                            </h5>
                            <Ratings rating={item.rating} />
                          </div>
                          <p className="text-black ">{item.comment}</p>
                          <small className="text-[#000000d1] ">
                            {format(item.createdAt)} •
                          </small>
                        </div>
                        <div className="pl-2 flex 800px:hidden items-center">
                          <h5 className="text-[18px] pr-2 text-black ">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                      </div>

                    </div>
                  )
                )}
              </div>
            </div> */}
          </div>
{/*  */}
{/* 
{redirect && <Navigate to={`/course-access/${data._id}`} />} */}
          {/* 2nd section */}
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <img src={data?.thumbnail?.url} className="w-full h-[40vh]" />
              {/* <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} /> */}
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black font-bold">
                  {data.price === 0 ? "Free" : data.price + " ₹"}
                </h1>
                <h5 className="pl-3 pt-5 text-[20px]  line-through opacity-80 text-black ">
                  {data.estimatedPrice} ₹
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black ">
                  {discoutPercentagePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] text-white my-3 font-poppins cursor-pointer !bg-[crimson]`}
                    to={`/course-access/${data._id}`}
                  >
                    Start Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[200px] my-3 font-poppins text-white cursor-pointer !bg-[crimson]`}
                    onClick={paymentHandler}
                  >
                    {loader ? (
                      <span>Loading...</span>
                    ) : (
                      <div>Buy Now {data.price}₹</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* payment gateway modal */}
      <>
        {route === "Login" && (
          <>
            {open && (
              <CustomModel
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                component={Login}
              />
            )}
          </>
        )}

        {route === "Sign-Up" && (
          <>
            {open && (
              <CustomModel
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                component={Signup}
              />
            )}
          </>
        )}
        {route === "Verification" && (
          <>
            {open && (
              <CustomModel
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                component={Verification}
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
