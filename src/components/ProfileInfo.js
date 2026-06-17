import React, { useEffect, useState } from "react";
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
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-800 font-headingFont">
          My Account
        </h2>
        <p className="text-slate-500 mt-2 text-base">
          Update your personal information and profile picture.
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10 items-start">
        
        {/* Avatar Area */}
        <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
          <div className="relative group mb-4">
            <div className="w-32 h-32 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-50">
              <img
                src={user.avatar || avatar ? user.avatar.url || avatar : Avatar}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            <input
              type="file"
              id="avatar"
              className="hidden"
              onChange={imageHandler}
              accept="image/png, image/jpg, image/jpeg, image/webp"
            />
            <label 
              htmlFor="avatar"
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#0975DE] hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white transition-colors duration-200"
            >
              <AiOutlineCamera size={20} className="text-white" />
            </label>
          </div>
          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {user?.role === "admin" ? "Administrator" : "Student"}
          </p>
        </div>

        {/* Form Area */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0975DE] focus:ring-1 focus:ring-[#0975DE] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                readOnly
                value={user?.email}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#0975DE] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
