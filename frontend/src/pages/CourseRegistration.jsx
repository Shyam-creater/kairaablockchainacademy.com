import React, { useState,useEffect } from "react";
import { useFormik } from "formik";
import Registration from "../assets/registration.jpg";
import {toast} from "react-hot-toast";
import * as Yup from "yup";
import Header from "../components/Header";
import {styles} from "../styles/style";
import { useRegisterCourseMutation } from "../redux/features/user/userApi";
import { useNavigate } from "react-router-dom";

function CourseRegistration() {

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");


const [registerCourse, {isSuccess, error,isLoading}]=useRegisterCourseMutation();
const navigate = useNavigate();
 
 
  const schema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name"),
    lastName: Yup.string().required("Please enter your last name"),
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
    phoneNumber: Yup.string().required("Please enter your phone number").min(10),
    course: Yup.string().required("Please select the course"),

  });

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", email: "", phoneNumber: "", course: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);
        await registerCourse(values);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

 


  useEffect(() => {
    if (isSuccess) {
      toast.success("Form Submitted!");
      navigate(-1);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data;
        toast.error(errorData.message);
      }
      
    }


  }, [ error, isSuccess,isLoading]);
 
  

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <>
    <Header
     open={open}
     setOpen={setOpen}
     activeItem={activeItem}
     setRoute={setRoute}
     route={route}
    />
      <div className="md:px-12 p-2 max-w-screen-2xl md:mx-auto mt-10 animate-rotateAndSlideIn">
        <div className="bg-[#CADDFE] rounded-xl rounded-br-[80px] md:p-9 px-4 py-9">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="md:w-3/5">
              <h2 className="sm:text-4xl md:text-5xl font-headingFont text-3xl text-black font-bold mb-5 ">
                Course Registration
              </h2>
            </div>

            <div className="md:w-1/4 w-1/2">
              <img className="rounded-2xl" src={Registration} alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* *********************************************** ***********************************************/}

      <div className="container mx-auto px-10 py-10 text-center">
        <h2 className="md:text-4xl font-headingFont font-medium">Register Your Interest</h2>
        <p className="text-lg py-4 leading-7 ">
          Thank you for your interest in pursuing Blockchain Certification
          Programs from Kairaa Blockchain Academy. Please register your interest
          by filling out the following form and you will be notified through
          e-mail / call once we schedule a new batch for the course you have
          selected.
        </p>
      </div>
      <div className="container md:ml-20 md:px-20 px-4  py-10 gap-5  ">
        <p className="text-xl font-medium text-center">
          Please register your interest by filling the following form.
        </p>
     
<form className="py-3 mx-auto md:!w-[60vw]" onSubmit={handleSubmit}>
        <lable className={`${styles.label}`} htmlFor="firstName">
          First Name <span className="text-red-600">*</span>
        </lable>
        <br />
        <input
          className={`${styles.input}`}
          type="text"
          value={values.firstName}
          id="firstName"
          name="firstName"
          required
          onChange={handleChange}
        />
        {errors.firstName && touched.firstName && (
          <span className="text-red-500 pt-2 block">{errors.firstName}</span>
        )}
        <br />
        <lable className={`${styles.label}`} htmlFor="lastName">
          Last Name <span className="text-red-600">*</span>
        </lable>
        <br />
        <input
          className={`${styles.input} `}
          type="text"
          id="lastName"
          value={values.lastName}
          name="lastName"
          required
          onChange={handleChange}
        />
        {errors.lastName && touched.lastName && (
          <span className="text-red-500 pt-2 block">{errors.lastName}</span>
        )}
        <br />
        <lable className={`${styles.label}`} htmlFor="email">
          Email Address<span className="text-red-600">*</span>
        </lable>
        <br />
        <input
          type="text"
          className={`${styles.input}`}
          value={values.email}
          id="email"
          required
          name="email"
          onChange={handleChange}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <br />
        <lable className={`${styles.label}`} htmlFor="phoneNumber">
          Mobile No<span className="text-red-600">*</span>
        </lable>
        <br />
        <input
          className={`${styles.input}`}
          type="number"
          required
          id="phoneNumber"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && touched.phoneNumber && (
          <span className="text-red-500 pt-2 block">{errors.phoneNumber}</span>
        )}
        <br />
        <lable className={`${styles.label}`} htmlFor="course">
          Referred Course<span className="text-red-600">*</span>
          <select
            className={`${styles.input}`}
            name="course"
            id="course"
            value={values.course}
            onChange={handleChange}
            required
          >
            <option>Select</option>
            <option value="Blockchain Developer Fundamentals">
              Blockchain Developer Fundamentals
            </option>
            <option value="Blockchain Developer Professional">
              Blockchain Developer Professional
            </option>
            <option value="Blockchain Developer Expert">
              Blockchain Developer Expert
            </option>
            <option value="A Complete Solidity for Smart Programming">
              A Complete Solidity for Smart Programming
            </option>
            <option value="Certified Blockchain Trainer">
              Certified Blockchain Trainer
            </option>
            <option value="Other course">Other Courses</option>
          </select>
          {errors.course && touched.course && (
            <span className="text-red-500 pt-2 block">{errors.course}</span>
          )}
        </lable>
        <br />
        <div className="text-center">
          <div className="w-full mt-5">
            <button
              type="submit"
              className={`${styles.button} !w-fit !mx-auto !text-white`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>

      </div>
     
    </>
  );
}

export default CourseRegistration;
