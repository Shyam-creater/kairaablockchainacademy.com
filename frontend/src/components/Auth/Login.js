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
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
// import {signIn} from "next-auth/react";

// schema for yup
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful!");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data;
        toast.error(errorData.message);
      }
      
    }
  }, [setOpen, error, isSuccess]);

  const { values, errors, touched, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Log in to Kairaa Blockchain Academy</h1>
      <form onSubmit={handleSubmit}>
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

        <div className="w-full mt-5 relative mb-1 ">
          <label className={`${styles.label}`} htmlFor="email">
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
          <input type="submit" value="Log In" className={`${styles.button}`} />
        </div>
        <br />
        {/* <h5 className="text-center pt-4 font-poppins text-[14px] text-black  font-semibold">
          or join with
        </h5> */}
        {/* <div className="flex items-center justify-center my-3 ">
          <FcGoogle size={30} className="cursor-pointer mr-2" onClick={()=> signIn("google")}/>
          <AiFillGithub size={30} className="cursor-pointer ml-2" onClick={()=>signIn("github")}/>
        </div> */}
        <h5 className="text-center pt-4 font-poppins text-[14px] text-black  font-semibold">
          Don't have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Sign-Up")}
          >
            Sign Up
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;
