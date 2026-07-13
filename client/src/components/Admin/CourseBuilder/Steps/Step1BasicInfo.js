import React from "react";

const Step1BasicInfo = ({ courseData, setCourseData }) => {
  const handleChange = (e) => setCourseData({ ...courseData, [e.target.name]: e.target.value });

  const handleLanguageChange = (lang) => {
    let languages = courseData.language ? courseData.language.split(',').map(l => l.trim()).filter(Boolean) : [];
    if (languages.includes(lang)) {
      languages = languages.filter(l => l !== lang);
    } else {
      languages.push(lang);
    }
    setCourseData({ ...courseData, language: languages.join(', ') });
  };

  return (
    <div className="space-y-8">
      {/* Group 1: Core Details */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Core Details</h3>
        
        <div>
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Name <span className="text-red-500">*</span></label>
          <input type="text" name="name" value={courseData.name} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Master Solidity & Smart Contracts" required />
        </div>
        
        <div>
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Short Tagline</label>
          <input type="text" name="subtitle" value={courseData.subtitle} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. The most comprehensive blockchain course..." />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Long Description</label>
          <textarea name="description" value={courseData.description} onChange={handleChange} rows={5} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all resize-none" placeholder="Detailed description of the course..." required />
        </div>
      </div>

      {/* Group 2: Media */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Media</h3>
        
        <div>
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Thumbnail</label>
          <div className="relative group cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    if (reader.readyState === 2) {
                      setCourseData({ ...courseData, thumbnail: reader.result });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className="w-full p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-none bg-gray-50/50 dark:bg-[#0A0A0A] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-[#151515] transition-all">
              {courseData.thumbnail ? (
                <img src={courseData.thumbnail} alt="Thumbnail preview" className="max-h-40 rounded-none object-cover shadow-md" />
              ) : (
                <>
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Click or drag image to upload</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Promo Video URL</label>
          <input type="text" name="demoUrl" value={courseData.demoUrl || ""} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. https://youtube.com/..." />
        </div>
      </div>

      {/* Group 3: Taxonomy */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Taxonomy</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <input type="text" name="category" value={courseData.category} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Development" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sub Category</label>
            <input type="text" name="subcategory" value={courseData.subcategory} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Web3" />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-3">Languages Available</label>
            <div className="flex flex-wrap gap-2">
              {["English", "Tamil"].map((lang) => {
                const isChecked = courseData.language?.split(',').map(l => l.trim()).includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    type="button"
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isChecked 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-md" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Group 4: Settings */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
            <select name="level" value={courseData.level} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all">
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Type</label>
            <select name="courseType" value={courseData.courseType} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all">
              <option value="Self Paced">Self Paced</option>
              <option value="Live">Live</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Visibility</label>
            <select name="visibility" value={courseData.visibility} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Staff Only">Staff Only</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Version</label>
            <input type="text" name="version" value={courseData.version} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 1.0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
