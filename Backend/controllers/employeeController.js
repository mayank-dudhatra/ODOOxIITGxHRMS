import Employee from "../models/Employee.js";

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

// 🟢 Add new Employee
export const addEmployee = async (req, res) => {
  try {
    const {
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
      address,
    } = req.body;

    const userId = await generateUserId(firstName, lastName, dateOfJoining);

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
      netPay: grossSalary,
      address,
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: "✅ Employee added successfully",
      employee,
    });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 Get all Employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
