import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  loginId: { type: String, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  passwordHash: String,
  role: {
    type: String,
    enum: ["HR", "Payroll", "Employee"],
    default: "Employee",
  },
  joiningDate: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
