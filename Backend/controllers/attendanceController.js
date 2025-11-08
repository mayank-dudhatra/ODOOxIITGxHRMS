import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/* ============================================================
   ⏰ ATTENDANCE CONTROLLER — For HR and Employee
   ============================================================ */

// ✅ 1. Mark or update attendance for an employee
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;

    if (!employeeId || !date)
      return res.status(400).json({ message: "Employee ID and date are required" });

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Create or update attendance for the same date
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: new Date(date) },
      { status, checkInTime, checkOutTime, remarks },
      { new: true, upsert: true } // If not found, create it
    );

    res.status(200).json({
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ 2. Get attendance of a specific employee
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .populate("employee", "firstName lastName department");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ 3. Get attendance by specific date (for admin/HR view)
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const attendance = await Attendance.find({ date: new Date(date) })
      .populate("employee", "firstName lastName department designation");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("❌ Error fetching date-wise attendance:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ 4. Update attendance manually (for HR/Admin)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // attendance record ID
    const { status, checkInTime, checkOutTime, remarks } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance)
      return res.status(404).json({ message: "Attendance record not found" });

    attendance.status = status || attendance.status;
    attendance.checkInTime = checkInTime || attendance.checkInTime;
    attendance.checkOutTime = checkOutTime || attendance.checkOutTime;
    attendance.remarks = remarks || attendance.remarks;
    await attendance.save();

    res.status(200).json({
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};






// // import Attendance from "../models/Attendance.js";
// // import Employee from "../models/Employee.js";

// // // ✅ Mark or update attendance for an employee
// // export const markAttendance = async (req, res) => {
// //   try {
// //     const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;

// //     if (!employeeId || !date)
// //       return res.status(400).json({ message: "Employee ID and date are required" });

// //     const employee = await Employee.findById(employeeId);
// //     if (!employee)
// //       return res.status(404).json({ message: "Employee not found" });

// //     const attendance = await Attendance.findOneAndUpdate(
// //       { employee: employeeId, date: new Date(date) },
// //       { status, checkInTime, checkOutTime, remarks },
// //       { new: true, upsert: true } // if not found, create it
// //     );

// //     res.status(200).json({
// //       message: "Attendance marked successfully",
// //       data: attendance,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error marking attendance:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // ✅ Get attendance of a specific employee
// // export const getEmployeeAttendance = async (req, res) => {
// //   try {
// //     const { employeeId } = req.params;
// //     const attendance = await Attendance.find({ employee: employeeId })
// //       .sort({ date: -1 })
// //       .populate("employee", "firstName lastName department");

// //     res.status(200).json(attendance);
// //   } catch (error) {
// //     console.error("❌ Error fetching attendance:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // ✅ Get attendance for a specific date (for admin/HR view)
// // export const getAttendanceByDate = async (req, res) => {
// //   try {
// //     const { date } = req.params;
// //     const attendance = await Attendance.find({ date: new Date(date) })
// //       .populate("employee", "firstName lastName department designation");

// //     res.status(200).json(attendance);
// //   } catch (error) {
// //     console.error("❌ Error fetching date-wise attendance:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // ✅ Update attendance status manually (for HR/Admin)
// // export const updateAttendance = async (req, res) => {
// //   try {
// //     const { id } = req.params; // attendance record ID
// //     const { status, checkInTime, checkOutTime, remarks } = req.body;

// //     const attendance = await Attendance.findById(id);
// //     if (!attendance) {
// //       return res.status(404).json({ message: "Attendance record not found" });
// //     }

// //     attendance.status = status || attendance.status;
// //     attendance.checkInTime = checkInTime || attendance.checkInTime;
// //     attendance.checkOutTime = checkOutTime || attendance.checkOutTime;
// //     attendance.remarks = remarks || attendance.remarks;
// //     await attendance.save();

// //     res.status(200).json({
// //       message: "Attendance updated successfully",
// //       data: attendance,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error updating attendance:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };


// // Placeholder for the Attendance Model import (assuming you'll create one)
// // import Attendance from "../models/Attendance.js"; 

// /* =============================================================
//    ⏰ ATTENDANCE CONTROLLER — For HR and Employee
//    ============================================================= */

// // 🔹 POST /api/attendance/mark
// export const markAttendance = (req, res) => {
//     // Logic to clock-in or clock-out
//     res.status(501).json({ message: "Attendance: POST /mark not fully implemented yet." });
// };

// // 🔹 GET /api/attendance or /api/attendance/:id
// export const getAttendanceRecords = (req, res) => {
//     // Logic to fetch all records or filtered by employee ID
//     res.status(501).json({ message: "Attendance: GET / records not fully implemented yet." });
// };

// // 🔹 PATCH /api/attendance/:id
// export const updateAttendanceRecord = (req, res) => {
//     // Logic to update clock-in/out times (used by HR)
//     res.status(501).json({ message: "Attendance: PATCH /:id update not fully implemented yet." });
// };

// // 🔹 DELETE /api/attendance/:id
// export const deleteAttendanceRecord = (req, res) => {
//     // Logic to delete an attendance record (used by HR)
//     res.status(501).json({ message: "Attendance: DELETE /:id not fully implemented yet." });
// };