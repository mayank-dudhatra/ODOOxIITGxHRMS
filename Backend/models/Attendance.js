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

export default Attendance;
