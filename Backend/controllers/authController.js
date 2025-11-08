import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateLoginId } from "../utils/idGenerator.js";
import { generatePassword, hashPassword, comparePassword } from "../utils/passwordUtils.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// 🧑‍💼 Admin/HR creates employee
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, joiningDate } = req.body;

    const loginId = await generateLoginId(firstName, lastName, joiningDate);
    const plainPassword = generatePassword(10);
    const passwordHash = await hashPassword(plainPassword);

    const user = await User.create({
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
      password: plainPassword, // show once (system generated)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

// 🔑 User login
export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const user = await User.findOne({ loginId });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
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
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};

// 🔄 Change password
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
    console.error(err);
    res.status(500).json({ message: "Password change failed" });
  }
};
