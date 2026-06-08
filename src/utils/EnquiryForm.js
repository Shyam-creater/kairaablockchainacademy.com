import React, {  useEffect } from "react";
import { useFormik } from "formik";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

import { styles } from "../styles/style";
import { useRegisterCourseMutation } from "../redux/features/user/userApi";

const EnquiryForm = ({setOpen}) => {
  const [registerCourse, { isSuccess, error, isLoading }] =
    useRegisterCourseMutation();


  const schema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name"),
    // lastName: Yup.string().required("Please enter your last name"),
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
    phoneNumber: Yup.string()
      .required("Please enter your phone number")
      .min(10),
    course: Yup.string().required("Please select the course"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      // lastName: "",
      email: "",
      phoneNumber: "",
      course: "",
    },
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
      setOpen(false)
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data;
        toast.error(errorData.message);
      }
    }
  }, [error, isSuccess,setOpen, isLoading]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
    
      <h1 className={`${styles.title} `}>
        Register for a free demo lecture!
      </h1>
   
    
     
      <form className="py-3" onSubmit={handleSubmit}>
        <lable className={`${styles.label}`} htmlFor="firstName">
          First Name 
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
        {/* <lable className={`${styles.label}`} htmlFor="lastName">
          Last Name 
        </lable>
        <br />
        <input
          className={`${styles.input}`}
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
        <br /> */}
        <lable className={`${styles.label}`} htmlFor="email">
          Email Address
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
          Mobile No
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
          Referred Course
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
  );
};

export default EnquiryForm;
