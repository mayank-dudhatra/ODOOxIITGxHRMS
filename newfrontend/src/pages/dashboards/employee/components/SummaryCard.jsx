import React from "react";

const SummaryCard = ({ title, icon, children }) => (
  <div className="bg-white p-5 shadow rounded-lg border border-gray-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-2xl">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

export default SummaryCard;
