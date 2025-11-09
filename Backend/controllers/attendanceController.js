import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/* ============================================================
   ⏰ ATTENDANCE CONTROLLER — For HR and Employee
   ============================================================ */

// Helper to handle date comparison for querying today's attendance
const getStartOfDay = (date = new Date()) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

// 🟢 Mark or update attendance (Employee check-in/out, or HR manual entry)
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, remarks } = req.body;
    
    const idToUse = employeeId || req.user?._id; 

    if (!idToUse || !date)
      return res.status(400).json({ message: "Employee ID and date are required." });

    const attendanceDate = getStartOfDay(new Date(date));

    // Find the corresponding Employee Profile
    const employee = await Employee.findOne({ $or: [{ userId: idToUse }, { _id: idToUse }] });
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found." });
      
    // Find or create attendance record using Employee's Mongoose _id
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employee._id, date: attendanceDate },
      { 
        status, 
        checkIn: checkIn || (status === 'Present' ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null),
        checkOut, 
        remarks 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Attendance marked successfully.",
      data: attendance,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res.status(500).json({ message: "Server Error during attendance marking.", error: error.message });
  }
};


// 🟢 Get attendance records (All records, or filtered by employee ID if :id is provided)
export const getAttendanceRecords = async (req, res) => {
  try {
    const { id } = req.params; 
    const { date } = req.query; 

    let query = {};
    
    if (id) {
        const employeeProfile = await Employee.findOne({ $or: [{ userId: id }, { _id: id }] });
        
        if (!employeeProfile) {
             return res.status(200).json([]);
        }
        // NOTE: The Attendance model uses 'employeeId' as the reference field
        query.employeeId = employeeProfile._id; 
    }
    
    if (date) {
        query.date = getStartOfDay(new Date(date));
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate("employeeId", "firstName lastName email userId role designation");

    const formattedRecords = records.map(record => ({
        _id: record._id,
        date: record.date,
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        remarks: record.remarks,
        employeeId: {
            _id: record.employeeId?._id,
            loginId: record.employeeId?.userId, 
            firstName: record.employeeId?.firstName,
            lastName: record.employeeId?.lastName,
            email: record.employeeId?.email,
            designation: record.employeeId?.designation,
        }
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    res.status(500).json({ message: "Server Error fetching attendance records.", error: error.message });
  }
};

// 🟡 Update attendance manually (for HR/Admin)
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, checkIn, checkOut, remarks, date } = req.body;

    const updateFields = {
        status, 
        checkIn, 
        checkOut, 
        remarks
    };

    if (date) {
        updateFields.date = getStartOfDay(new Date(date));
    }
    
    const record = await Attendance.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true });
    
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.status(200).json({ message: "Attendance record updated successfully", record });
  } catch (error) {
    console.error("❌ Error updating attendance record:", error.message);
    res.status(500).json({ message: "Error updating attendance record", error: error.message });
  }
};

// 🔴 Delete attendance record (for HR/Admin)
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params; 
    const record = await Attendance.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting attendance record:", error.message);
    res.status(500).json({ message: "Error deleting attendance record", error: error.message });
  }
};