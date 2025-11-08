import Payroll from "../models/Payroll.js";

export const generatePayslip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payroll = await Payroll.findOne({ 
      employeeId: employeeId, 
      status: "Processed" 
    })
      .populate("employeeId", "name email");

    if (!payroll) {
      return res.status(404).json({ message: "No processed payroll found for this employee" });
    }

    res.status(200).json({
      url: `https://example.com/payslip/${payroll._id}.pdf`,
      message: "Payslip generated successfully",
      payroll: {
        employeeName: payroll.employeeName,
        grossSalary: payroll.grossSalary,
        deductions: payroll.deductions,
        netPay: payroll.netPay,
      },
    });
  } catch (err) {
    console.error("❌ Error in generatePayslip:", err);
    res.status(500).json({ message: err.message || "Failed to generate payslip" });
  }
};

export const downloadPayslip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payroll = await Payroll.findOne({ 
      employeeId: employeeId, 
      status: "Processed" 
    })
      .populate("employeeId", "name email");

    if (!payroll) {
      return res.status(404).json({ message: "No processed payroll found for this employee" });
    }

    // In a real implementation, you would generate a PDF here
    // For now, return success message
    res.status(200).json({ 
      message: "Payslip download triggered successfully!",
      payrollId: payroll._id,
    });
  } catch (err) {
    console.error("❌ Error in downloadPayslip:", err);
    res.status(500).json({ message: err.message || "Failed to download payslip" });
  }
};
