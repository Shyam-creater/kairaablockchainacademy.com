import React from 'react';
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import AdminProtected from "../utils/hooks/adminProtected.js";
import AllRegistrations from "../components/Admin/Course/AllRegistrations.js"




const Register = () => {
  return (
    <div>
       <AdminProtected>
    <div>
      <Heading title="create course page" description="" keywords="" />
      <div className="flex ">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
        
        <AllRegistrations/>
        </div>
      </div>
    </div>
     </AdminProtected>
    </div>
  )
}

export default Register;
