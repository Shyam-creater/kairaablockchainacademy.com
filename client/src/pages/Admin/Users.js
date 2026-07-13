import React from 'react';
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import AllUsers from "../../components/Admin/Course/AllUsers.js";

const Users = () => {
  return (
    <>
      <Heading title="Admin Users Kairaa Blockchain Academy" description="Manage registered users" keywords="admin, users, management" />
      <AdminLayout title="User Management" subtitle="Review user registrations and manage account status">
        <AllUsers />
      </AdminLayout>
    </>
  );
};

export default Users;

