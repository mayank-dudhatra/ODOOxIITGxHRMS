import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SalaryGrowthChart = () => {
  const data = [
    { month: "Jun", netSalary: 46000 },
    { month: "Jul", netSalary: 47000 },
    { month: "Aug", netSalary: 47400 },
    { month: "Sep", netSalary: 48200 },
    { month: "Oct", netSalary: 49000 },
  ];

  return (
    <div className="bg-white p-5 shadow rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Salary Growth</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="netSalary" fill="#2563EB" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryGrowthChart;
