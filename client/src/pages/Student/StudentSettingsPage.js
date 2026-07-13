import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileInfo from "../../components/ProfileInfo.js";
import ChangePassword from "../../components/ChangePassword.js";

const StudentSettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  // Avatar is maintained in ProfileInfo natively or from Redux state,
  // but originally it was local state in Profile.js.
  // ProfileInfo updates it locally. We can just pass null as avatar isn't explicitly needed if it fetches from user.
  const [avatar, setAvatar] = useState(null);

  return (
    <div className="animate-fade-in w-full flex flex-col gap-10">
      <ProfileInfo user={user} avatar={avatar} />
      <ChangePassword user={user} />
    </div>
  );
};

export default StudentSettingsPage;
