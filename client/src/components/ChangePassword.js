import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { useUpdatePasswordMutation } from '../redux/features/user/userApi';
import { GlassPanel, NeonButton } from './ui/NeonUI';
import { FaMobileAlt, FaLaptop, FaShieldAlt } from 'react-icons/fa';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [updatePassword, { isSuccess, error, isLoading }] = useUpdatePasswordMutation();

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
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (error) {
      if ("data" in error) {
        toast.error(typeof (error.data.message) === "string" ? (error.data.message) : JSON.stringify(error.data.message) || "An error occurred");
      }
    }
  }, [isSuccess, error]);

  // Password Strength Logic
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/)) strength += 25;
    if (newPassword.match(/\d/)) strength += 25;
    if (newPassword.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };
  const strength = getPasswordStrength();

  const handle2FAToggle = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast.success(is2FAEnabled ? "2FA Disabled" : "2FA Enabled via Authenticator App!");
  };

  const recentDevices = [
    { id: 1, device: "MacBook Pro M2", location: "New York, USA", time: "Active now", icon: <FaLaptop /> },
    { id: 2, device: "iPhone 14 Pro", location: "New York, USA", time: "2 hours ago", icon: <FaMobileAlt /> },
    { id: 3, device: "Windows Desktop", location: "London, UK", time: "3 days ago", icon: <FaLaptop /> },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Change Password Section */}
      <GlassPanel glow="border-t-2 border-t-red-500" className="p-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            <FaShieldAlt className="text-red-500" /> Security Settings
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Update your password and manage account security.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <form onSubmit={passwordChangeHandler} className="w-full max-w-xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:bg-white/5 transition-colors"
                />
              </div>
              
              <div className="h-px w-full bg-white/5 my-4"></div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:bg-white/5 transition-colors"
                />
                
                {/* Strength Meter */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password Strength</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${strength === 100 ? 'text-[#00e676]' : strength >= 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                        {strength === 100 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full transition-all duration-300 ${strength >= 25 ? 'bg-red-500 w-1/4' : 'w-0'}`}></div>
                      <div className={`h-full transition-all duration-300 ${strength >= 50 ? 'bg-orange-500 w-1/4' : 'w-0'}`}></div>
                      <div className={`h-full transition-all duration-300 ${strength >= 75 ? 'bg-yellow-400 w-1/4' : 'w-0'}`}></div>
                      <div className={`h-full transition-all duration-300 ${strength === 100 ? 'bg-[#00e676] w-1/4 shadow-[0_0_10px_rgba(0,230,118,0.8)]' : 'w-0'}`}></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full px-5 py-3.5 rounded-xl border bg-black/40 text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    confirmPassword && newPassword !== confirmPassword 
                      ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' 
                      : confirmPassword && newPassword === confirmPassword 
                        ? 'border-[#00e676]/50 focus:border-[#00e676] focus:bg-[#00e676]/5' 
                        : 'border-white/10 focus:border-red-500/50 focus:bg-white/5'
                  }`}
                />
              </div>

              <div className="pt-4">
                <NeonButton
                  type="submit"
                  variant="primary"
                  disabled={isLoading || (confirmPassword && newPassword !== confirmPassword)}
                  className="w-full sm:w-auto px-8 py-3.5 !border-red-500/50 !text-red-400 hover:!bg-red-500/10 hover:!shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </NeonButton>
              </div>
            </form>
          </div>

          {/* 2FA Section */}
          <div className="flex-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Two-Factor Auth (2FA)</h3>
                  <p className="text-xs text-slate-400 font-medium">Add an extra layer of security to your account.</p>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={handle2FAToggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${is2FAEnabled ? 'bg-[#00e676]' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${is2FAEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative z-10">
                <p className="text-sm text-slate-300">
                  {is2FAEnabled 
                    ? "✅ 2FA is currently active. You will be prompted for a code from your Authenticator App when logging in from a new device." 
                    : "⚠️ 2FA is not enabled. We highly recommend turning this on to secure your tokens and progress."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </GlassPanel>

      {/* Recent Devices Section */}
      <GlassPanel className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Recent Devices</h3>
          <p className="text-sm text-slate-400">Manage the devices logged into your account.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-4 font-bold">Device</th>
                <th className="py-4 px-4 font-bold">Location</th>
                <th className="py-4 px-4 font-bold">Recent Activity</th>
                <th className="py-4 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDevices.map((device, idx) => (
                <tr key={device.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                        {device.icon}
                      </div>
                      <span className="text-white font-bold text-sm">{device.device}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-400">{device.location}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      device.time === 'Active now' ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30' : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}>
                      {device.time}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {device.time !== 'Active now' && (
                      <button className="text-xs font-bold text-red-500 hover:text-white transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

    </div>
  );
};

export default ChangePassword;
