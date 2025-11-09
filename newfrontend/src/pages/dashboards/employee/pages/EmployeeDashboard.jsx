import React from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import SummaryCard from "../components/SummaryCard";
import AttendanceChart from "../components/AttendanceChart";
import SalaryGrowthChart from "../components/SalaryGrowthChart";

const EmployeeDashboard = () => {
  const user = { fullName: "Arjun Divraniya" };
  const summary = { present: 22, absent: 3, leave: 2 };

  return (
    <EmployeeLayout user={user}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome back, {user.fullName} 👋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <SummaryCard title="Attendance" icon="⏰">
          <p>Present: {summary.present}</p>
          <p>Absent: {summary.absent}</p>
          <p>Leave: {summary.leave}</p>
        </SummaryCard>

        <SummaryCard title="Upcoming Leave" icon="🌴">
          <p>Casual Leave: Nov 10–12</p>
          <p>Status: Approved ✅</p>
        </SummaryCard>

        <SummaryCard title="Payroll" icon="💰">
          <p>₹48,200 (Oct 2025)</p>
          <button className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">
            Download Payslip
          </button>
        </SummaryCard>

        <SummaryCard title="Work Hours" icon="⌛">
          <p>Avg 8.4 hrs/day</p>
          <p className="text-green-600">+5% vs last month</p>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceChart />
        <SalaryGrowthChart />
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
