// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import Attendance from "../models/Attendance.js"; // ✅ import attendance
// import { generateLoginId } from "../utils/idGenerator.js";
// import { generatePassword, hashPassword, comparePassword } from "../utils/passwordUtils.js";

// const generateToken = (user) =>
//   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

// // ✅ Admin/HR creates employee
// export const createUser = async (req, res) => {
//   try {
//     const { companyId, firstName, lastName, email, role, joiningDate } = req.body;

//     // Generate login ID + password
//     const loginId = await generateLoginId(companyId, firstName, lastName, joiningDate);
//     const plainPassword = generatePassword(10);
//     const passwordHash = await hashPassword(plainPassword);

//     const user = await User.create({
//       company: companyId,
//       loginId,
//       firstName,
//       lastName,
//       email,
//       passwordHash,
//       role,
//       joiningDate,
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       loginId: user.loginId,
//       password: plainPassword, // show once
//     });
//   } catch (err) {
//     console.error("❌ Error creating user:", err);
//     res.status(500).json({ message: "Error creating user" });
//   }
// };

// // ✅ User Login + Auto Attendance Marking
// export const login = async (req, res) => {
//   try {
//     const { loginId, password } = req.body;
//     const user = await User.findOne({ loginId });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const valid = await comparePassword(password, user.passwordHash);
//     if (!valid) return res.status(400).json({ message: "Invalid credentials" });

//     // Generate token
//     const token = generateToken(user);

//     // 🔹 FIX 1: Create a valid Date object set to today's start for attendance tracking.
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Convert to midnight timestamp

//     // 🔹 Mark today's attendance
//     await Attendance.findOneAndUpdate(
//       { employee: user._id, date: today }, // Use the fixed Date object
//       {
//         status: "Present",
//         checkInTime: new Date().toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//       { new: true, upsert: true }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       // FIX 2: Ensure the user object contains the ID needed for the AuthContext redirection logic
//       user: {
//         id: user._id,
//         loginId: user.loginId,
//         name: `${user.firstName} ${user.lastName}`,
//         role: user.role,
//         // Include company ID if available
//         companyId: user.company, 
//       },
//       // FIX 3: Send the role outside the user object to match the frontend AuthContext expectation.
//       role: user.role, 
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ message: "Login error" });
//   }
// };

// // ✅ Change password
// export const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const valid = await comparePassword(oldPassword, user.passwordHash);
//     if (!valid) return res.status(400).json({ message: "Old password incorrect" });

//     user.passwordHash = await hashPassword(newPassword);
//     await user.save();

//     res.json({ message: "Password changed successfully" });
//   } catch (err) {
//     console.error("❌ Password change error:", err);
//     res.status(500).json({ message: "Password change failed" });
//   }
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js"; // ✅ import attendance
import { generateLoginId } from "../utils/idGenerator.js";
import { generatePassword, hashPassword, comparePassword } from "../utils/passwordUtils.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// ✅ Admin/HR creates employee
export const createUser = async (req, res) => {
  try {
    const { companyId, firstName, lastName, email, role, joiningDate } = req.body;

    // Generate login ID + password
    const loginId = await generateLoginId(companyId, firstName, lastName, joiningDate);
    const plainPassword = generatePassword(10);
    const passwordHash = await hashPassword(plainPassword);

    const user = await User.create({
      company: companyId,
      loginId,
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      joiningDate,
    });

    res.status(201).json({
      message: "User created successfully",
      loginId: user.loginId,
      password: plainPassword, // show once
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
};

// ✅ User Login + Auto Attendance Marking
export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const user = await User.findOne({ loginId });
    if (!user) {
      console.log(`Login failed for ID: ${loginId} (User not found)`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      console.log(`Login failed for ID: ${loginId} (Incorrect password)`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // 🔹 Mark today's attendance (Set date to start of the day for consistent query)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); 
    
    // Use the correct field name 'employeeId' as per the Attendance model schema in the merged content.
    await Attendance.findOneAndUpdate(
      { employeeId: user._id, date: todayStart },
      {
        status: "Present",
        // Note: CheckIn/CheckOut are stored as time strings in the model schema (if using the HR routes logic)
        // Using toLocaleTimeString just provides a time string for the DB field 'checkIn'
        checkIn: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        loginId: user.loginId,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

// ✅ Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(oldPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Old password incorrect" });

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Password change error:", err);
    res.status(500).json({ message: "Password change failed" });
  }
};