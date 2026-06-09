import React from "react";

import {
  CalendarDays,
  MoreVertical,
} from "lucide-react";

function TaskCard({ title, priority }) {
  return (
    <div className="bg-slate-800 border border-white/10 p-5 rounded-2xl mb-5 hover:scale-[1.02] transition duration-300">

      {/* Top */}
      <div className="flex justify-between items-start">

        <h3 className="text-white font-semibold text-xl">
          {title}
        </h3>

        <MoreVertical className="text-slate-400 cursor-pointer" />
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-6">

        <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm text-white">
          {priority}
        </span>

        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <CalendarDays size={16} />
          <span>May 30</span>
        </div>

      </div>
    </div>
  );
}

export default TaskCard;