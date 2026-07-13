import React from 'react';
import Heading from "../../components/Heading.js";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import AllUsers from "../../components/Admin/Course/AllUsers.js"

const Team = () => {
  return (
    <AdminProtected>
      <Heading title="Team Management - Admin" description="Manage team members" keywords="admin, team, management" />
      <AdminLayout title="Team Members" subtitle="Manage administrators and their roles">
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <AllUsers isTeam={true} />
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

export default Team
