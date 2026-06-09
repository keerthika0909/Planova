import React from "react";
import TaskCard from "./TaskCard";

function BoardColumn({ title }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-5 w-[320px] min-w-[320px]">

      <h2 className="text-white text-2xl font-bold mb-5">
        {title}
      </h2>

      <TaskCard title="Design Dashboard UI" priority="High" />

      <TaskCard title="Fix Login API" priority="Medium" />

      <TaskCard title="Deploy Backend" priority="Low" />

    </div>
  );
}

export default BoardColumn;