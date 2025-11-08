import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    attendanceDays: {
      type: Number,
      required: true,
      default: 0,
    },
    approvedLeaves: {
      type: Number,
      default: 0,
    },
    grossSalary: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);
