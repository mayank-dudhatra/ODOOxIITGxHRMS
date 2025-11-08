<<<<<<< HEAD
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, required: true, default: Date.now },
  checkIn: { type: String, required: true },
  checkOut: { type: String, default: null },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'On Leave'],
    default: 'Present',
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

=======
// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half-Day"],
      default: "Present",
    },
    checkInTime: {
      type: String,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔹 Each employee should have only one record per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
>>>>>>> 67b63b502e490de8c222f7c7f04d956621b107ee
export default Attendance;
