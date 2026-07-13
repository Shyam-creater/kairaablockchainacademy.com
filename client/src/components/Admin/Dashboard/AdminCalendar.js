import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const AdminCalendar = () => {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className="glass-panel p-6 h-full flex flex-col items-center justify-start pt-6">
      <h3 className="text-lg font-bold text-white tracking-tight mb-0 w-full text-left">Calendar</h3>
      <div className="flex justify-center items-center w-full mt-0">
        <style>{`
          .neon-calendar {
            --rdp-cell-size: 40px;
            --rdp-accent-color: #00f2fe;
            --rdp-background-color: rgba(0, 242, 254, 0.1);
            color: #e2e8f0;
          }
          .neon-calendar .rdp-day_selected {
            background-color: var(--rdp-accent-color);
            color: #0f172a;
            font-weight: bold;
            box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
          }
          .neon-calendar .rdp-day_today {
            color: #fe0979;
            font-weight: 800;
          }
          .neon-calendar .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .neon-calendar .rdp-caption_label {
            font-size: 1.1rem;
            color: #00f2fe;
            text-shadow: 0 0 5px rgba(0, 242, 254, 0.3);
          }
          .neon-calendar .rdp-head_cell {
            color: #64748b;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
          }
        `}</style>
        <DayPicker 
          mode="single" 
          selected={selected} 
          onSelect={setSelected} 
          className="neon-calendar m-0"
        />
      </div>
    </div>
  );
};

export default AdminCalendar;
