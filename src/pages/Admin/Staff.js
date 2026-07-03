import React from 'react';
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import StaffManager from "../../components/Admin/Staff/StaffManager.js";

const Staff = () => {
  return (
    <>
      <Heading title="Staff Management | Kairaa Blockchain Academy" description="Manage staff and instructors" keywords="admin, staff, instructors" />
      <AdminLayout title="Staff Management" subtitle="View all staff members and their assigned students/courses">
        <StaffManager />
      </AdminLayout>
    </>
  );
};

export default Staff;
