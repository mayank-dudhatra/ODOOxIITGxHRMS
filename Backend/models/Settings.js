import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // 🔹 Payroll Configurations
    pfPercentage: {
      type: Number,
      required: true,
      default: 12, // Default 12% PF contribution
      min: 0,
      max: 100,
    },
    taxPercentage: {
      type: Number,
      required: true,
      default: 10, // Default 10% professional tax
      min: 0,
      max: 100,
    },

    // 🔹 Company-wide Salary Settings (optional)
    basicToGrossRatio: {
      type: Number,
      default: 40, // % of basic from gross salary
    },
    hraPercentage: {
      type: Number,
      default: 20, // % of HRA from gross salary
    },

    // 🔹 Additional Deductions / Benefits (extendable)
    otherDeductions: {
      type: Number,
      default: 0, // e.g. health insurance or TDS
    },
    bonusPercentage: {
      type: Number,
      default: 0, // e.g. company bonus %
    },

    // 🔹 Payroll Schedule Settings
    payCycle: {
      type: String,
      enum: ["Monthly", "Bi-weekly", "Weekly"],
      default: "Monthly",
    },
    payDate: {
      type: String,
      default: "25", // Day of month for monthly payroll
    },

    // 🔹 Metadata
    updatedBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
