import React from 'react';
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import AdminProtected from "../utils/hooks/adminProtected.js";
import AllOrders from "../components/Admin/Course/AllOrders.js";

const Orders = () => {
  return (
    <div>
      <AdminProtected>
        <div>
          <Heading title="Kairaa Blockchain Academy - Manual Payments" description="" keywords="" />
          <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
              <AdminSidebar />
            </div>
            <div className="w-[85%]">
              <AllOrders />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Orders;
