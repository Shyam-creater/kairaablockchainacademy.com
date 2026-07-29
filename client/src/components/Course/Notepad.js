import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // core css
import { Save, Download, Trash2, Clock, CheckCircle2, FileText, AlertCircle, Quote, Code, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  { id: 'important', label: 'Important', icon: <AlertCircle className="w-3.5 h-3.5" />, html: '<h3>🔥 Important Takeaway</h3><p><br></p>' },
  { id: 'formula', label: 'Formula / Concept', icon: <Code className="w-3.5 h-3.5" />, html: '<blockquote><strong>Formula:</strong> </blockquote><p><br></p>' },
  { id: 'revision', label: 'Revision Notes', icon: <List className="w-3.5 h-3.5" />, html: '<h3>📚 Revision Topics</h3><ul><li>Item 1</li><li>Item 2</li></ul><p><br></p>' },
  { id: 'quote', label: 'Key Quote', icon: <Quote className="w-3.5 h-3.5" />, html: '<blockquote>"Insert key quote here"</blockquote><p><br></p>' },
];

const Notepad = ({ lessonId, lessonTitle }) => {
  const [note, setNote] = useState('');
  const [saveState, setSaveState] = useState('saved'); // 'saved', 'saving', 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const quillRef = useRef(null);

  // Word count calculation
  const wordCount = note.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(w => w.length > 0).length;

  // Load saved note on mount
  useEffect(() => {
    const saved = localStorage.getItem(`note_rich_${lessonId}`);
    if (saved) {
      setNote(saved);
      setLastSaved(new Date());
    } else {
      // Fallback for old plaintext notes
      const oldSaved = localStorage.getItem(`note_${lessonId}`);
      if (oldSaved) {
        setNote(`<p>${oldSaved.replace(/\n/g, '<br>')}</p>`);
        setLastSaved(new Date());
      } else {
        setNote('');
      }
    }
  }, [lessonId]);

  // Debounced auto-save
  useEffect(() => {
    if (!lessonId) return;

    setSaveState('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(`note_rich_${lessonId}`, note);
      setSaveState('saved');
      setLastSaved(new Date());
    }, 1500);

    return () => clearTimeout(timer);
  }, [note, lessonId]);

  const handleDownload = () => {
    if (!note.trim() || note === '<p><br></p>') {
      toast.error("Notepad is empty!");
      return;
    }
    
    // Create a printable window since generating PDF strictly client-side without heavy libs is hard
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Notes - ${lessonTitle || 'Lesson'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111827; }
            h1 { color: #0F172A; margin-bottom: 24px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; }
            blockquote { border-left: 4px solid #3B82F6; padding-left: 16px; color: #475569; margin-left: 0; }
            code { background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
            pre { background: #1E293B; color: #F8FAFC; padding: 16px; border-radius: 8px; overflow-x: auto; }
            ul, ol { margin-left: 20px; }
          </style>
        </head>
        <body>
          <h1>Personal Notes: ${lessonTitle || 'Lesson'}</h1>
          <div class="content">${note}</div>
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your notes? This cannot be undone.")) {
      setNote('');
      localStorage.removeItem(`note_rich_${lessonId}`);
      localStorage.removeItem(`note_${lessonId}`); // Clear legacy notes too
      toast.success("Notes cleared!");
    }
  };

  const insertTemplate = (html) => {
    // Basic append for now
    const newNote = note + html;
    setNote(newNote);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col h-[650px] bg-white dark:bg-[#0F172A] overflow-hidden font-sans border border-black">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F1F5F9] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-sm">
            <FileText className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#0F172A] dark:text-white font-bold text-sm">Personal Notes</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#64748B] font-medium line-clamp-1 max-w-[200px]">{lessonTitle || 'Workspace'}</span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span className="text-[10px] text-[#94A3B8] font-semibold tracking-wide uppercase">{wordCount} words</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
            <AnimatePresence mode="wait">
              {saveState === 'saving' ? (
                <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Saving...</span>
                </motion.div>
              ) : (
                <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[#10B981]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </motion.div>
              )}
            </AnimatePresence>
            {lastSaved && (
              <span className="text-[#94A3B8] ml-1 hidden lg:inline-block">
                at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          
          <div className="w-[1px] h-6 bg-[#E2E8F0] dark:bg-[#334155] mx-1 hidden sm:block" />
          
          <button onClick={handleClear} className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#450a0a] rounded-lg transition-colors" title="Clear Notes">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Templates Bar */}
      <div className="px-4 py-2.5 bg-white dark:bg-[#0F172A] border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => insertTemplate(tpl.html)}
              className="flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white text-[11px] font-semibold rounded-md transition-colors"
            >
              {tpl.icon}
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative quill-wrapper">
        <style dangerouslySetInnerHTML={{__html: `
          .quill-wrapper .ql-container {
            font-size: 15px;
            font-family: inherit;
            border: none !important;
          }
          .quill-wrapper .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #F1F5F9 !important;
            background: #F8FAFC;
            padding: 8px 16px;
          }
          .quill-wrapper .ql-editor {
            padding: 24px;
            height: calc(100% - 42px); /* Adjust based on toolbar height */
            overflow-y: auto;
          }
          /* Dark mode overrides could go here, but omitted for brevity */
        `}} />
        <ReactQuill 
          ref={quillRef}
          theme="snow" 
          value={note} 
          onChange={setNote} 
          modules={modules}
          placeholder="Start typing your notes here..."
          className="h-full"
        />
      </div>

    </div>
  );
};

export default Notepad;
