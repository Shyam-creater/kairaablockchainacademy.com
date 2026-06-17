import React from 'react';
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import AllRegistrations from "../../components/Admin/Course/AllRegistrations.js";

const Register = () => {
  return (
    <>
      <Heading title="Registrations | Admin Portal" description="View course registrations" keywords="registrations, courses" />
      <AdminLayout
        title="Registrations"
        subtitle="Manage and view all student course registrations"
      >
        <AllRegistrations />
      </AdminLayout>
    </>
  )
}

export default Register;
