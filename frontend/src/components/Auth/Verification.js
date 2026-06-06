import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { styles } from "../../styles/style";
import { useSelector } from "react-redux";
import { useActivationMutation } from "../../redux/features/auth/authApi";

const Verification = ({ setRoute }) => {
  const {token}=useSelector((state)=>state.auth)
  const[activation, {isSuccess, error}]=useActivationMutation();
  const [inValidError, setInvalidError] = useState(false);
  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

useEffect(()=>{
if(isSuccess){
  toast.success("Account activated successfully!")
  setRoute("Login");
}
if (error) {
  if ("data" in error) {
    
    const errorData = error;
  setInvalidError(true)
    toast.error(errorData.data.message);
  }
}
},[isSuccess, error,setRoute])


  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const verificationHandler = async () => {
    const verificationNumber= Object.values(verifyNumber).join("");
    if(verificationNumber.length!==4){
      setInvalidError(true);
      return;
    }

    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    })
  };

  const handleInputChange = (index, value) => {
    if (/^\d?$/.test(value)) { // Only accept a single digit
      setInvalidError(false);
      const newVerifyNumber = { ...verifyNumber, [index]: value };
      setVerifyNumber(newVerifyNumber);

      if (value === "" && index > 0) {
        inputRefs[index - 1].current?.focus();
      } else if (value.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };
  // const handleInputChange = (index, value) => {
  //   setInvalidError(false);
  //   const newVerifyNumber = { ...verifyNumber, [index]: value };
  //   setVerifyNumber(newVerifyNumber);

  //   if (value === "" && index > 0) {
  //     inputRefs[index - 1].current?.focus();
  //   } else if (value.length === 1 && index < 3) {
  //     inputRefs[index + 1].current?.focus();
  //   }
  // };
  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="1100px:w-[70%] m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key,index) => (
          <input type="number" 
          key={key}
          ref={inputRefs[index]}
          className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black  justify-center text-[18px] font-poppins outline-none text-center ${
            inValidError ? "shake border-red-500":" border-[#0000004a]"
          }`}

          placeholder=""
          maxLength={1}
          value={verifyNumber[key]}
          onChange={(e)=>handleInputChange(index, e.target.value)}
          
          />
        ))}
      </div>
      <br/>
      <br/>
      <div className="w-full flex justify-center ">
        <button className={`${styles.button}`}
        onClick={verificationHandler}
        >Verify OTP</button>
      </div>
      <h5 className="text-center pt-4 font-poppins text-[14px] text-black ">Go back to Login?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Sign-Up")}
          >
            Login
          </span></h5>
    </div>
  );
};

export default Verification;
