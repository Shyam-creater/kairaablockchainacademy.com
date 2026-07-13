import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { FiGrid, FiPlayCircle, FiBriefcase, FiFileText, FiHelpCircle, FiDownloadCloud, FiClock, FiCalendar, FiUsers } from 'react-icons/fi';

const AnimatedCounter = ({ value, suffix = "" }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const isNumber = !isNaN(numericValue);
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && isNumber) {
      const animation = animate(count, numericValue, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [isInView, numericValue, count, isNumber]);

  if (!isNumber) return <span>{value}{suffix}</span>;

  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[#050810] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white/5 transition-colors group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mb-4 group-hover:text-primary group-hover:bg-primary/10 transition-colors border border-white/5 group-hover:border-primary/20 relative z-10">
      <Icon size={24} />
    </div>
    <span className="text-3xl font-extrabold text-white mb-1 relative z-10">
      <AnimatedCounter value={value} suffix={label === 'Max Students' && value !== 'Unlimited' ? '+' : ''} />
    </span>
    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">{label}</span>
  </motion.div>
);

const CourseStats = ({ data }) => {
  const stats = [
    { icon: FiGrid, value: data?.courseContentData?.length || 0, label: 'Modules', show: true },
    { icon: FiPlayCircle, value: data?.courseContentData?.reduce((acc, curr) => acc + (curr.links?.length || 1), 0) || 0, label: 'Lessons', show: true },
    { icon: FiBriefcase, value: data?.projectsCount, label: 'Projects', show: data?.projectsCount > 0 },
    { icon: FiFileText, value: data?.assignmentCount, label: 'Assignments', show: data?.assignmentCount > 0 },
    { icon: FiHelpCircle, value: data?.quizCount, label: 'Quizzes', show: data?.quizCount > 0 },
    { icon: FiDownloadCloud, value: data?.downloadableResourcesCount, label: 'Resources', show: data?.downloadableResourcesCount > 0 },
    { icon: FiClock, value: data?.estimatedStudyHours, label: 'Est. Hours', show: !!data?.estimatedStudyHours },
    { icon: FiCalendar, value: data?.weeklyStudyHours, label: 'Weekly Hrs', show: !!data?.weeklyStudyHours },
    { icon: FiUsers, value: data?.maximumStudents || 'Unlimited', label: 'Max Students', show: true },
  ].filter(stat => stat.show);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} delay={idx * 0.1} />
      ))}
    </div>
  );
};

export default CourseStats;
