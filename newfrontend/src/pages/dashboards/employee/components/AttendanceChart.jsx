import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AttendanceChart = () => {
  const data = [
    { date: "Nov 1", present: 1 },
    { date: "Nov 2", present: 0 },
    { date: "Nov 3", present: 1 },
    { date: "Nov 4", present: 1 },
    { date: "Nov 5", present: 1 },
  ];

  return (
    <div className="bg-white p-5 shadow rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Attendance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="present" stroke="#2563EB" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
