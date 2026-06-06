import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styles } from "../../styles/style";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { useRegisterMutation } from "../../redux/features/auth/authApi.js";
// import { useDispatch ,useSelector} from "react-redux";
// import { fetchList } from "../../redux/authSLice.jsx";

// schema for yup
const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Signup = ({ setRoute }) => {
  const [show, setShow] = useState(false);
 
  const [register, { data,error, isSuccess, isError}] = useRegisterMutation();
  // const { data, error, loading, token } = useSelector((state) => state.authData);
  // const dispatch=useDispatch();
  useEffect(() => {
    
    if (isSuccess) {
      const message = data?.message || "Registration successful!";
      toast.success(message);
    
      setRoute("Verification");
   
    }   
    
    if (error) {
      if ("data" in error) {
      
        // console.error('Error:', error.data);
        const errorData = error;
      
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess,setRoute, error,isError,data]);

 


  const formik = useFormik({
    initialValues: { name:"", email: "", password: "", phoneNumber:""},
    validationSchema: schema,
    onSubmit: async ({name,email,password, phoneNumber}) => {
   
      console.log('Submitting form with values:', values);
      const data = { name, email, password, phoneNumber };
      await register(data);
      // dispatch(fetchList(data));
    },
  });
  

  const { errors, touched,  values, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join Kairaa Blockchain Academy</h1>
      <form onSubmit={handleSubmit}>
        {/* name */}
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="name">
            Enter your name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            placeholder="your name"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />

          {/* display error message - if user enters invalid email */}
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        {/* email */}
        <label className={`${styles.label}`} htmlFor="email">
          Enter your email
        </label>
       
        <input
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
          placeholder="login@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />

        {/* display error message - if user enters invalid email */}
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}

         {/* phone number */}
         <div className="mt-5">
          <label className={`${styles.label}`} htmlFor="phoneNumber">
            Enter your Phone number
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            placeholder="your phone number"
            className={`${errors.phoneNumber && touched.phoneNumber && "border-red-500"} ${
              styles.input
            }`}
          />

          {/* display error message - if user enters invalid email */}
          {errors.phoneNumber && touched.phoneNumber && (
            <span className="text-red-500 pt-2 block">{errors.phoneNumber}</span>
          )}
        </div>

        <div className="w-full mt-5 relative mb-1 ">
          <label className={`${styles.label}`} htmlFor="password">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder="password!&%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
        <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <br /> 
         {/* <h5 className="text-center pt-4 font-poppins text-[14px] text-black  font-semibold">
          or join with
        </h5> */}
        {/* <div className="flex items-center justify-center my-3 ">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div> */}
        <h5 className="text-center pt-4 font-poppins text-[14px] text-black  font-semibold">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Log In
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Signup;
