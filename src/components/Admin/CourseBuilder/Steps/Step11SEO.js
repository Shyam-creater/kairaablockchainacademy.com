import React from "react";

const Step11SEO = ({ courseData, setCourseData }) => {
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      seo: { ...courseData.seo, [e.target.name]: e.target.value }
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Search Engine Optimization</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Title</label>
            <input type="text" name="metaTitle" value={courseData.seo.metaTitle} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Master Solidity | Best Web3 Course" />
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recommended length: 50-60 characters
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Description</label>
            <textarea name="metaDescription" value={courseData.seo.metaDescription} onChange={handleChange} rows={3} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all resize-none" placeholder="Brief summary for search engines..." />
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recommended length: 150-160 characters
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Keywords</label>
            <input type="text" name="keywords" value={courseData.seo.keywords} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. solidity, blockchain, web3, smart contracts" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Canonical URL</label>
            <input type="text" name="canonicalUrl" value={courseData.seo.canonicalUrl} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="https://..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step11SEO;
