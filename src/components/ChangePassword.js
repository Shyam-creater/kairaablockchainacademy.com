import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { useUpdatePasswordMutation } from '../redux/features/user/userApi';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (error) {
      if ("data" in error) {
        toast.error(error.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-800 font-headingFont">
          Security Settings
        </h2>
        <p className="text-slate-500 mt-2 text-base">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <form onSubmit={passwordChangeHandler} className="w-full max-w-lg space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0975DE] focus:ring-1 focus:ring-[#0975DE] transition-colors"
            />
          </div>
          
          <hr className="border-slate-100 my-6" />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0975DE] focus:ring-1 focus:ring-[#0975DE] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0975DE] focus:ring-1 focus:ring-[#0975DE] transition-colors"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0975DE] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
