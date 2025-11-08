import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dateOfBirth: { type: Date },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    role: { type: String, required: true }, // Employee, HR Officer, Payroll Officer
    dateOfJoining: { type: Date, required: true },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Contract", "Part-Time"],
      required: true,
    },
    grossSalary: { type: Number, required: true },
    address: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
