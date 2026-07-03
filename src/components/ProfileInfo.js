import React, { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { FaGithub, FaLinkedin, FaTwitter, FaLink } from "react-icons/fa";
import Avatar from "../assets/user.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../redux/features/user/userApi";
import { useLoadUserQuery } from "../redux/features/api/apiSlice";
import { toast } from "react-hot-toast";
import { GlassPanel, NeonButton } from "./ui/NeonUI";

const ProfileInfo = ({ avatar, user }) => {
  const [updateAvatar, { isSuccess, error, isLoading: isAvatarLoading }] = useUpdateAvatarMutation();
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
    if (isSuccess) {
      setLoadUser(true);
      toast.success("Profile image updated successfully!");
    }
    if (error) {
      console.log(error);
      toast.error("Failed to update profile image.");
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full flex flex-col gap-6">
      <GlassPanel glow="border-t-2 border-t-primary" className="p-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            My Account
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Update your personal identity and public profile.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
            <div className="relative group mb-6">
              <div className={`w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-primary to-accent shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all ${isAvatarLoading ? 'animate-pulse' : ''}`}>
                <div className="w-full h-full rounded-full border-2 border-[#0B0F19] overflow-hidden bg-[#0B0F19]">
                  <img
                    src={user.avatar || avatar ? user.avatar.url || avatar : Avatar}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              
              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={imageHandler}
                accept="image/png, image/jpg, image/jpeg, image/webp"
                disabled={isAvatarLoading}
              />
              <label 
                htmlFor="avatar"
                className="absolute bottom-1 right-1 w-12 h-12 bg-primary hover:bg-accent rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.6)] border-4 border-[#0B0F19] transition-all duration-300 transform group-hover:scale-110"
              >
                <AiOutlineCamera size={22} className="text-[#0B0F19] font-bold" />
              </label>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-1.5 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
                {user?.role === "admin" ? "Administrator" : "Active Student"}
              </div>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider mt-1">(Recommended: 500x500px)</p>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 w-full">
            <div className="w-full max-w-xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-500 cursor-not-allowed focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.phoneNumber || "Not provided"}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-500 cursor-not-allowed focus:outline-none font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-500 cursor-not-allowed focus:outline-none font-mono"
                />
                <p className="text-xs text-slate-500 mt-2">To change your personal details, please contact Academy Support.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Connected Identities (Mock Feature) */}
      <GlassPanel glow="border-t-2 border-t-accent" className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Connected Identities</h3>
          <p className="text-sm text-slate-400">Link your Web3 wallet and social accounts to build your public portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                <span className="text-orange-500 font-bold text-lg">🦊</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">MetaMask Wallet</h4>
                <p className="text-xs text-slate-500 font-mono">Not connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30">Connect</button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#181717]/80 flex items-center justify-center border border-white/20">
                <FaGithub className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">GitHub Profile</h4>
                <p className="text-xs text-slate-500 font-mono">Not connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30">Connect</button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 flex items-center justify-center border border-[#0A66C2]/50">
                <FaLinkedin className="text-[#0A66C2] text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">LinkedIn</h4>
                <p className="text-xs text-slate-500 font-mono">Not connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30">Connect</button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50">
                <FaLink className="text-accent text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Personal Portfolio</h4>
                <p className="text-xs text-slate-500 font-mono">Add custom link</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30">Add Link</button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ProfileInfo;
