import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Settings from "../models/Settings.js";

/* =============================================================
   🧾 PAYROLL CONTROLLER — For Payroll Officer / Admin
   ============================================================= */

/* =============================================================
   🔹 GET Payroll Summary (Dashboard Cards)
   ============================================================= */
export const getPayrollSummary = async (req, res) => {
  try {
    const totalPayout = await Payroll.aggregate([
      { $match: { status: "Processed" } },
      { $group: { _id: null, total: { $sum: "$netPay" } } },
    ]);

    const employeesPaid = await Payroll.countDocuments({ status: "Processed" });
    const payrunsProcessed = await Payroll.countDocuments();
    const pendingApprovals = await Payroll.countDocuments({ status: "Pending" });

    // Last 6 months chart data
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
      { $limit: 6 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      payout: item.payout,
    }));

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

/* =============================================================
   🔹 GET All Payroll Records (Table View)
   ============================================================= */
export const getPayrollList = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "firstName lastName department designation grossSalary")
      .sort({ createdAt: -1 });

    const formatted = payrolls.map((p) => ({
      _id: p._id.toString(),
      employeeId: p.employeeId?._id?.toString() || "",
      employeeName: p.employeeId
        ? `${p.employeeId.firstName} ${p.employeeId.lastName}`
        : "Unknown",
      department: p.employeeId?.department || "N/A",
      designation: p.employeeId?.designation || "N/A",
      grossSalary: p.grossSalary || p.employeeId?.grossSalary || 0,
      deductions: p.deductions || 0,
      netPay: p.netPay || 0,
      status: p.status || "Pending",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error in getPayrollList:", err);
    res.status(500).json({ message: "Failed to fetch payroll data" });
  }
};

/* =============================================================
   🔹 PROCESS Payroll for a Single Employee
   ============================================================= */
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

    const payroll = await Payroll.findOneAndUpdate(
      { employeeId: id },
      {
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
        grossSalary: employee.grossSalary,
        deductions,
        netPay,
        status: "Processed",
      },
      { new: true, upsert: true }
    );

    // Optionally update employee record
    employee.netPay = netPay;
    employee.deductions = deductions;
    await employee.save();

    res.status(200).json({
      message: "✅ Payroll processed successfully!",
      payroll,
    });
  } catch (err) {
    console.error("❌ Error in processPayroll:", err);
    res.status(500).json({ message: "Failed to process payroll" });
  }
};

/* =============================================================
   🔹 GET Payroll Reports (For ReportsPage)
   ============================================================= */
export const getPayrollReports = async (req, res) => {
  try {
    const reports = await Payroll.find()
      .populate("employeeId", "firstName lastName")
      .sort({ createdAt: -1 });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const formatted = reports.map((r) => {
      const date = new Date(r.createdAt);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return {
        id: r._id.toString(),
        employeeId: r.employeeId?._id?.toString() || "",
        employeeName: r.employeeId
          ? `${r.employeeId.firstName} ${r.employeeId.lastName}`
          : "N/A",
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

/* =============================================================
   🔹 GET Payroll Settings (PF, Tax %, etc.)
   ============================================================= */
export const getPayrollSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      // Return sensible defaults if not found
      return res.status(200).json({
        pfPercentage: 12,
        taxPercentage: 10,
        basicToGrossRatio: 40,
        hraPercentage: 20,
        otherDeductions: 0,
        bonusPercentage: 0,
        payCycle: "Monthly",
        payDate: "25",
        updatedBy: "System Default",
      });
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error("❌ Error in getPayrollSettings:", err);
    res.status(500).json({ message: "Failed to fetch payroll settings" });
  }
};

/* =============================================================
   🔹 UPDATE Payroll Settings
   ============================================================= */
export const updatePayrollSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      message: "✅ Payroll settings updated successfully!",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error in updatePayrollSettings:", err);
    res.status(500).json({ message: "Failed to update payroll settings" });
  }
};
