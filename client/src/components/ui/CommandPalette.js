import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiX, HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineAcademicCap } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, setIsOpen, searchData }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const filteredResults = query.trim() === '' 
    ? searchData.slice(0, 5) // Show suggested if empty
    : searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.desc.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (url) => {
    setIsOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-[#0B0F19]/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col max-h-[70vh]">
              
              {/* Search Input Area */}
              <div className="relative border-b border-white/10 p-4 flex items-center gap-3">
                <HiOutlineSearch className="text-primary w-6 h-6 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, lessons, assignments..."
                  className="w-full bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder:text-slate-500"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                >
                  <HiX className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-slate-400 border border-white/5 shrink-0">
                  <kbd className="font-sans">ESC</kbd> to close
                </div>
              </div>

              {/* Results Area */}
              <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
                {query.trim() === '' && (
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Suggested Searches
                  </div>
                )}
                
                {filteredResults.length > 0 ? (
                  <div className="flex flex-col gap-1 mt-1">
                    {filteredResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(item.url)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 group transition-all text-left"
                      >
                        <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-primary/20 transition-colors">
                          {item.title.toLowerCase().includes('course') ? <HiOutlineBookOpen className="w-5 h-5" /> : 
                           item.title.toLowerCase().includes('cert') ? <HiOutlineAcademicCap className="w-5 h-5" /> :
                           <HiOutlineDocumentText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-200 font-medium truncate group-hover:text-white transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-500 truncate group-hover:text-primary/70 transition-colors">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-6 text-center">
                    <HiOutlineSearch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300">No results found</h3>
                    <p className="text-slate-500 mt-1">We couldn't find anything matching "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/5 p-3 bg-white/5 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10 font-sans">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10 font-sans">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10 font-sans">↵</kbd>
                    to select
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"></span>
                  Smart Search
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
