import React from "react";
import { Navigate } from "react-router-dom";
import AdminProtected from "../../utils/hooks/adminProtected.js";

const AdminPage = () => {
  return (
    <AdminProtected>
      <Navigate to="/admin/dashboard" replace />
    </AdminProtected>
  );
};

export default AdminPage;

