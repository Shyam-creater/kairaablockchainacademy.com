import React, { useState } from "react";

const Step8Tools = ({ courseData, setCourseData }) => {
  const [toolInput, setToolInput] = useState("");

  const popularTools = ["React", "Node.js", "MongoDB", "Ethereum", "Solidity", "Hardhat", "Metamask", "Docker", "AWS", "Git", "GitHub", "Redis", "Kafka", "Python", "Django"];

  const addTool = (toolName) => {
    if (!courseData.toolsCovered.some(t => t.name.toLowerCase() === toolName.toLowerCase())) {
      setCourseData({ 
        ...courseData, 
        toolsCovered: [...courseData.toolsCovered, { name: toolName, logo: "" }] 
      });
    }
    setToolInput("");
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (toolInput.trim()) {
      addTool(toolInput.trim());
    }
  };

  const removeTool = (index) => {
    const updated = [...courseData.toolsCovered];
    updated.splice(index, 1);
    setCourseData({ ...courseData, toolsCovered: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Tools You'll Learn</h3>
          <p className="text-xs text-gray-500">Select from popular tools or type a custom one. Logos will be mapped automatically if available.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {popularTools.map(tool => (
            <button 
              key={tool}
              type="button"
              onClick={() => addTool(tool)}
              className="px-4 py-2 text-xs font-semibold bg-gray-50 dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 border border-solid border-gray-200 shadow-none dark:border-gray-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span className="text-gray-400">+</span> {tool}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomAdd} className="flex gap-3">
          <input 
            type="text" 
            value={toolInput} 
            onChange={(e) => setToolInput(e.target.value)} 
            className="flex-1 p-3.5 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" 
            placeholder="Type a custom tool name (e.g. Figma)" 
          />
          <button type="submit" className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-none font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-md">Add Tool</button>
        </form>

        {courseData.toolsCovered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/60">
            {courseData.toolsCovered.map((tool, index) => (
              <div key={index} className="flex items-center justify-between p-3.5 border border-solid border-gray-200 shadow-none dark:border-gray-800 rounded-none bg-white dark:bg-[#0A0A0A]  group transition-all hover:border-gray-300 dark:hover:border-gray-700">
                <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{tool.name}</span>
                <button type="button" onClick={() => removeTool(index)} className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step8Tools;
