import React from 'react';

const LxpLayout = ({ leftSidebar, mainContent, rightSidebar }) => {
  return (
    <div className="flex h-screen bg-[#050810] pt-[80px] overflow-hidden">
      <div className="w-full md:w-[320px] flex-shrink-0 h-full border-r border-white/10 overflow-y-auto hidden md:block">
        {leftSidebar}
      </div>
      <div className="flex-1 h-full overflow-y-auto bg-[#0a0f1d]">
        {mainContent}
      </div>
      <div className="w-[350px] flex-shrink-0 h-full border-l border-white/10 overflow-y-auto bg-[#050810] hidden lg:block">
        {rightSidebar}
      </div>
    </div>
  );
};

export default LxpLayout;
