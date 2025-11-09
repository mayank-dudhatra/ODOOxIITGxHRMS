import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";

/* =============================================================
   📊 ANALYTICS CONTROLLER
   ============================================================= */

// 🔹 Get analytics summary (for charts + dashboard)
export const getAnalyticsSummary = async (req, res) => {
  try {
    const monthlyData = await Payroll.aggregate([
      { $match: { status: "Processed" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          payout: { $sum: "$netPay" },
          deductions: { $sum: "$deductions" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const payoutTrends = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      payout: item.payout || 0,
    }));

    const deductionsData = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      deductions: item.deductions || 0,
    }));

    const departmentData = await Employee.aggregate([
      { $group: { _id: "$department", employees: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
    ]);

    const departmentDistribution = departmentData.map((item) => ({
      name: item._id || "Unknown",
      employees: item.employees,
    }));

    const totalPayout = payoutTrends.reduce((sum, item) => sum + item.payout, 0);
    const avgPayout = payoutTrends.length > 0 ? Math.round(totalPayout / payoutTrends.length) : 0;
    const totalDeductions = deductionsData.reduce((sum, item) => sum + item.deductions, 0);
    const totalEmployees = departmentDistribution.reduce((sum, item) => sum + item.employees, 0);

    res.status(200).json({
      payoutTrends,
      deductionsData,
      departmentDistribution,
      summary: {
        totalPayout,
        avgPayout,
        totalDeductions,
        totalEmployees,
      },
    });
  } catch (err) {
    console.error("❌ Error in getAnalyticsSummary:", err);
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};
