import React from "react";
import { Navigate } from "react-router-dom";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import { useSelector } from "react-redux";

const AdminPage = () => {
  const { user } = useSelector((state) => state.auth);
  const redirectPath = (user?.role === "admin" || user?.role === "staff") ? "/admin/dashboard" : "/";

  return (
    <AdminProtected>
      <Navigate to={redirectPath} replace />
    </AdminProtected>
  );
};

export default AdminPage;

