import { Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

export default function AdminProtected({children}){
    const {user} =useSelector((state)=>state.auth);
    console.log("_______user",user)
    const isAdmin= user?.role ==="admin";
    return isAdmin ? children : <Navigate to="/"/>
}