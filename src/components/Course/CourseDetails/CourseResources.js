import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiMap } from 'react-icons/fi';

const ResourceCard = ({ icon: Icon, title, url, description, delay }) => (
  <motion.a 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ amount: 0.3 }}
    transition={{ delay, duration: 0.4 }}
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-4 bg-[#050810] border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-2 group shadow-xl hover:shadow-[0_0_30px_rgba(0,242,254,0.15)]"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0 border border-white/5 group-hover:border-primary/30">
      <Icon size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-white font-bold truncate group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-400 text-xs truncate mt-1">{description}</p>
    </div>
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-500 group-hover:bg-primary group-hover:text-[#050810] transition-all">
      <FiDownload />
    </div>
  </motion.a>
);

const CourseResources = ({ data }) => {
  const hasResources = data?.brochure || data?.roadmapPdf || data?.sampleNotes || data?.syllabusUrl;
  if (!hasResources) return null;

  return (
    <div className="pt-16">
      <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.3 }} className="text-3xl font-extrabold text-white mb-6">Course Resources</motion.h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {data.brochure && <ResourceCard icon={FiFileText} title="Course Brochure" description="Detailed PDF overview" url={data.brochure} delay={0.1} />}
        {data.roadmapPdf && <ResourceCard icon={FiMap} title="Learning Roadmap" description="Visual path to mastery" url={data.roadmapPdf} delay={0.2} />}
        {data.sampleNotes && <ResourceCard icon={FiFileText} title="Sample Notes" description="Preview of course materials" url={data.sampleNotes} delay={0.3} />}
        {data.syllabusUrl && <ResourceCard icon={FiFileText} title="Full Syllabus" description="Complete curriculum PDF" url={data.syllabusUrl} delay={0.4} />}
      </div>
    </div>
  );
};

export default CourseResources;
