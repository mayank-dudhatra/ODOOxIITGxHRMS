import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  role: { type: String, default: "employee" },
  department: String,
  grossSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, default: 0 },
  attendanceDays: { type: Number, default: 0 },
  approvedLeaves: { type: Number, default: 0 },
});

export default mongoose.model("Employee", employeeSchema);
