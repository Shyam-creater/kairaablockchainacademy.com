import React, { useEffect } from "react";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";

const Step9Instructor = ({ courseData, setCourseData }) => {
  const { data, isLoading } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const staffMembers = data?.users?.filter(u => u.role === "staff") || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
    
    // If they change instructorId, we might optionally want to prepopulate their name/details, 
    // but the backend will link via ID. We'll just save the ID for now.
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Instructor Profile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Instructor Name</label>
            <select 
              name="instructorId" 
              value={courseData.instructorId || ""} 
              onChange={handleChange} 
              className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all appearance-none"
            >
              <option value="">Select Instructor (Defaults to you)</option>
              {!isLoading && staffMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Experience</label>
            <input type="text" name="instructorExperience" value={courseData.instructorExperience} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 5 Years in Web3" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Achievements</label>
            <input type="text" name="instructorAchievements" value={courseData.instructorAchievements} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Ex-Google, 10x Developer" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn URL</label>
            <input type="text" name="instructorLinkedIn" value={courseData.instructorLinkedIn} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub URL</label>
            <input type="text" name="instructorGitHub" value={courseData.instructorGitHub} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Portfolio URL</label>
            <input type="text" name="instructorPortfolio" value={courseData.instructorPortfolio} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Students Taught</label>
            <input type="text" name="instructorStudentsTaught" value={courseData.instructorStudentsTaught} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 50,000+" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9Instructor;
