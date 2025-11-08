import Employee from "../models/Employee.js";
// ✅ NEW IMPORTS for User Creation
import User from "../models/User.js"; 
import { generateLoginId } from "../utils/idGenerator.js";
import { generatePassword, hashPassword } from "../utils/passwordUtils.js";

// Helper — auto-generate userId (e.g. ROSH2025001)
const generateUserId = async (firstName, lastName, dateOfJoining) => {
  const prefix =
    firstName.substring(0, 2).toUpperCase() +
    lastName.substring(0, 2).toUpperCase();
  const year = new Date(dateOfJoining).getFullYear();

  const count = await Employee.countDocuments({
    dateOfJoining: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const serial = String(count + 1).padStart(3, "0"); // 001, 002, etc.
  return `${prefix}${year}${serial}`;
};

// 🟢 Add new Employee (Updated to also create User Login)
export const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      company, // companyId is passed here
      department,
      designation,
      role,
      dateOfJoining,
      employmentType,
      grossSalary,
      address,
    } = req.body;

    // 1. Generate Employee Profile ID
    const userId = await generateUserId(firstName, lastName, dateOfJoining);

    // 2. Create the Employee Document (The Profile)
    const employee = new Employee({
      userId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      company,
      department,
      designation,
      role,
      dateOfJoining,
      employmentType,
      grossSalary,
      netPay: grossSalary, // Initialize netPay
      address,
    });

    await employee.save();

    // 3. Generate User Login Credentials
    const loginId = await generateLoginId(company, firstName, lastName, dateOfJoining);
    const plainPassword = generatePassword(10);
    const passwordHash = await hashPassword(plainPassword);

    // 4. Create the User Document for Login (The Login Account)
    const user = await User.create({
        company: company,
        loginId,
        firstName,
        lastName,
        email,
        passwordHash,
        role,
        joiningDate: dateOfJoining,
    });

    // 5. Return success message AND login credentials
    res.status(201).json({
      success: true,
      message: "✅ Employee and User login created successfully",
      employee,
      userCredentials: { // ✅ New login details to give to the user
        loginId: user.loginId,
        password: plainPassword,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 Get all Employees (No change needed)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};