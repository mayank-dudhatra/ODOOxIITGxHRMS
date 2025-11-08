import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Settings from "../models/Settings.js";

/* =============================================================
   🧾 PAYROLL CONTROLLER — For Payroll Officer
   ============================================================= */

// 🔹 Get payroll summary (for dashboard cards)
export const getPayrollSummary = async (req, res) => {
  try {
    const totalPayout = await Payroll.aggregate([
      { $match: { status: "Processed" } },
      { $group: { _id: null, total: { $sum: "$netPay" } } },
    ]);

    const employeesPaid = await Payroll.countDocuments({ status: "Processed" });
    const payrunsProcessed = await Payroll.countDocuments();
    const pendingApprovals = await Payroll.countDocuments({ status: "Pending" });

    // Get monthly payroll data for chart
    const monthlyData = await Payroll.aggregate([
      { $match: { status: "Processed" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          payout: { $sum: "$netPay" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }, // Last 6 months
    ]);

    // Format chart data with month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      payout: item.payout,
    }));

    // Return empty array if no data (frontend will handle empty state)

    res.status(200).json({
      totalPayout: totalPayout[0]?.total || 0,
      employeesPaid,
      payrunsProcessed,
      pendingApprovals,
      chartData,
    });
  } catch (err) {
    console.error("❌ Error in getPayrollSummary:", err);
    res.status(500).json({ message: "Failed to fetch payroll summary" });
  }
};

// 🔹 Get full payroll list (for PayrollTable.jsx)
export const getPayrollList = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "name attendanceDays approvedLeaves")
      .sort({ createdAt: -1 });

    const formatted = payrolls.map((p) => ({
      _id: p._id.toString(),
      employeeId: p.employeeId?._id?.toString() || p.employeeId?.toString() || "",
      employeeName: p.employeeId?.name || "Unknown",
      attendanceDays: p.employeeId?.attendanceDays || 0,
      approvedLeaves: p.employeeId?.approvedLeaves || 0,
      grossSalary: p.grossSalary,
      deductions: p.deductions,
      netPay: p.netPay,
      status: p.status || "Pending",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error in getPayrollList:", err);
    res.status(500).json({ message: "Failed to fetch payroll data" });
  }
};

// 🔹 Process payroll for one employee
export const processPayroll = async (req, res) => {
  try {
    const { id } = req.params; // employeeId
    const employee = await Employee.findById(id);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const settings = await Settings.findOne();

    const pf = settings?.pfPercentage || 12;
    const tax = settings?.taxPercentage || 10;

    const deductions = (employee.grossSalary * (pf + tax)) / 100;
    const netPay = employee.grossSalary - deductions;

    // Create or update payroll record
    const payroll = await Payroll.findOneAndUpdate(
      { employeeId: id },
      {
        employeeId: employee._id,
        employeeName: employee.name,
        attendanceDays: employee.attendanceDays || 0,
        approvedLeaves: employee.approvedLeaves || 0,
        grossSalary: employee.grossSalary,
        deductions,
        netPay,
        status: "Processed",
      },
      { new: true, upsert: true }
    );

    // Update employee netPay field (optional)
    employee.netPay = netPay;
    employee.deductions = deductions;
    await employee.save();

    res.status(200).json({
      message: "Payroll processed successfully!",
      payroll,
    });
  } catch (err) {
    console.error("❌ Error in processPayroll:", err);
    res.status(500).json({ message: "Failed to process payroll" });
  }
};

// 🔹 Get payroll reports (for Reports page)
export const getPayrollReports = async (req, res) => {
  try {
    const reports = await Payroll.find()
      .populate("employeeId", "name")
      .sort({ createdAt: -1 });

    // Format month from createdAt
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];

    const formatted = reports.map((r) => {
      const date = new Date(r.createdAt);
      const month = monthNames[date.getMonth()] || "Unknown";
      const year = date.getFullYear();
      
      return {
        id: r._id.toString(),
        employeeId: r.employeeId?._id?.toString() || r.employeeId?.toString() || "",
        employeeName: r.employeeId?.name || "N/A",
        month: `${month} ${year}`,
        grossSalary: r.grossSalary,
        netPay: r.netPay,
        status: r.status || "Pending",
        createdAt: r.createdAt,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error in getPayrollReports:", err);
    res.status(500).json({ message: "Failed to fetch payroll reports" });
  }
};

// 🔹 Get payroll settings (PF, tax %, etc.)
export const getPayrollSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings)
      return res.status(404).json({ message: "No payroll settings found" });
    res.status(200).json(settings);
  } catch (err) {
    console.error("❌ Error in getPayrollSettings:", err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// 🔹 Update payroll settings
export const updatePayrollSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({
      message: "Settings updated successfully!",
      updated,
    });
  } catch (err) {
    console.error("❌ Error in updatePayrollSettings:", err);
    res.status(500).json({ message: "Failed to update settings" });
  }
};
