import Employee from "../models/Employee.js";

/* =============================================================
   👥 EMPLOYEE CONTROLLER
   ============================================================= */

// 🔹 Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });

    const formatted = employees.map((emp) => ({
      id: emp._id.toString(),
      name: emp.name,
      email: emp.email || "",
      department: emp.department || "N/A",
      designation: emp.role || "Employee",
      salary: emp.grossSalary || 0,
      attendance: emp.attendanceDays || 0,
      attendancePercentage: emp.attendanceDays 
        ? Math.round((emp.attendanceDays / 30) * 100) 
        : 0,
      status: emp.role === "employee" ? "Active" : "Inactive",
      grossSalary: emp.grossSalary,
      netPay: emp.netPay,
      deductions: emp.deductions,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error in getEmployees:", err);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

