import React from "react";

const Step2Pricing = ({ courseData, setCourseData }) => {
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    
    const updatedData = { ...courseData, [name]: newValue };

    // Auto calculate discount percentage or current price
    if (name === "price" || name === "estimatedPrice") {
      const currentPrice = name === "price" ? parseFloat(newValue) : parseFloat(courseData.price);
      const originalPrice = name === "estimatedPrice" ? parseFloat(newValue) : parseFloat(courseData.estimatedPrice);
      
      if (!isNaN(currentPrice) && !isNaN(originalPrice) && originalPrice > 0) {
        if (currentPrice < originalPrice) {
          updatedData.discountPercentage = (((originalPrice - currentPrice) / originalPrice) * 100).toFixed(0);
        } else {
          updatedData.discountPercentage = 0;
        }
      }
    } else if (name === "discountPercentage") {
      const discount = parseFloat(newValue);
      const originalPrice = parseFloat(courseData.estimatedPrice);
      
      if (!isNaN(discount) && !isNaN(originalPrice) && originalPrice > 0) {
        updatedData.price = (originalPrice - (originalPrice * (discount / 100))).toFixed(0);
      }
    }

    setCourseData(updatedData);
  };

  const toggleBoolean = (name) => {
    setCourseData({ ...courseData, [name]: !courseData[name] });
  };

  return (
    <div className="space-y-8">
      
      {/* Group 1: Pricing Model */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Pricing Structure</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
            <select name="currency" value={courseData.currency} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price</label>
            <input type="number" name="estimatedPrice" value={courseData.estimatedPrice} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 199" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount %</label>
            <input type="number" name="discountPercentage" value={courseData.discountPercentage} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 50" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#0A0A0A] p-4 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Current Selling Price</h4>
            <p className="text-xs text-gray-500">Auto-calculated based on discount.</p>
          </div>
          <input type="number" name="price" value={courseData.price} onChange={handleChange} className="w-[120px] p-2 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-700 bg-white dark:bg-[#151515] text-gray-900 dark:text-white text-center font-bold outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10" placeholder="0" />
        </div>
      </div>

      {/* Group 2: Access & Offers */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Sales & Access Rules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Limited Offer End Date</label>
            <input type="date" name="offerEndDate" value={courseData.offerEndDate} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Refund Policy</label>
            <input type="text" name="refundPolicy" value={courseData.refundPolicy} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 30-Day Money-Back Guarantee" />
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-4">Course Perks & Badges</label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "emiAvailable", label: "EMI Available" },
              { key: "freePreview", label: "Free Preview" },
              { key: "lifetimeAccess", label: "Lifetime Access" },
              { key: "certificate", label: "Certificate Included" },
              { key: "featured", label: "Featured Course" },
              { key: "bestseller", label: "Bestseller" },
              { key: "newCourseBadge", label: "New Badge" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleBoolean(item.key)}
                className={`px-4 py-2.5 rounded-none text-xs font-semibold transition-all border flex items-center gap-2 ${
                  courseData[item.key]
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white "
                    : "bg-white dark:bg-[#151515] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${courseData[item.key] ? "bg-white dark:bg-black" : "bg-gray-300 dark:bg-gray-600"}`} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Pricing;
