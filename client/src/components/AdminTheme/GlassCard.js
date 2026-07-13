import React from 'react';

const GlassCard = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-surface/40 backdrop-blur-xl border border-slate-600 rounded-2xl p-6 shadow-glass relative overflow-hidden ${className}`}>
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
      
      {(title || action) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
