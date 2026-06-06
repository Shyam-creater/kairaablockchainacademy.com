import React from "react";
import Protected from "../utils/hooks/useProtected";
import Header from "../components/Header";
import { useState } from "react";
import Profile from "../components/Profile";
import { useSelector } from "react-redux";
import Heading from "../components/Heading";

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user}=useSelector((state)=>state.auth)

  return (
    <Protected>
        <Heading title={`${user?.name} profile`}
         description=""/>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
        
      />
      <Profile user={user}
      
      />
    </Protected>
  );
};

export default ProfilePage;
