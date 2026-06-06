import React, { useEffect, useState } from "react";
import { styles } from "../styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import Avatar from "../assets/user.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../redux/features/user/userApi";
import { useLoadUserQuery } from "../redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

const ProfileInfo = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);

  // const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  useLoadUserQuery(undefined, { skip: !loadUser });
  const imageHandler = async (e) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
    }
    if (success) {
      toast.success("Profile updated successfully!");
    }
  }, [isSuccess, error, updateError, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
        email: user.email,
      });
    }
  };

  return (
    <div className="w-[100%] ">
      <div className="w-[100%]  flex  justify-center">
        <div className="relative">
          <img
            width={120}
            height={120}
            src={user.avatar || avatar ? user.avatar.url || avatar : Avatar}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#0975DE] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute top-[90px] right-2 flex items-center justify-center cursor-pointer z-10">
              <AiOutlineCamera size={20} className="text-white" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-[100%]  flex items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[30vw] w-[50vw]">
            <div className="w-[100%]">
              <label className={`${styles.label} block `}>Full Name</label>
              <input
                type="text"
                className={`${styles.input} w-[95%] mb-4 `}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className={`${styles.label} block `}>Email Address</label>
              <input
                type="text"
                className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
                required
                readOnly
                value={user?.email}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <input
              className={`w-[100px]  h-[40px] border border-[#0975DE] text-center  text-black rounded-[3px] mt-8 cursor-pointer`}
              type="submit"
              value="Update"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
