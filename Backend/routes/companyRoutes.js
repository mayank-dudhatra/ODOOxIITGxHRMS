// import express from 'express';
// import Company from '../models/Company.js'; // 1. IMPORT MODEL
// import { hashPassword, comparePassword } from '../utils/passwordUtils.js'; // 2. IMPORT UTILS
// import jwt from 'jsonwebtoken'; // 3. IMPORT JWT

// const router = express.Router();

// // --- NEW TOKEN FUNCTION ---
// // (Moved from authController for use here)
// const generateToken = (company) =>
//   jwt.sign({ id: company._id, role: 'CompanyAdmin' }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// // --- END NEW FUNCTION ---


// // @route   POST /api/company/register
// // @desc    Register a new company
// router.post('/register', async (req, res) => {
//   try {
//     const { name, companyCode, email, password } = req.body;

//     // 1. Check if company exists
//     let company = await Company.findOne({ $or: [{ email }, { companyCode }] });
//     if (company) {
//       return res.status(400).json({ message: 'Company with this email or code already exists' });
//     }

//     // 2. Hash the password
//     const passwordHash = await hashPassword(password);

//     // 3. Create and save new company
//     company = new Company({
//       name,
//       companyCode,
//       email,
//       passwordHash,
//     });
//     await company.save();

//     // Send a success response with the new ID
//     res.status(201).json({ message: 'Company registered successfully!', companyId: company._id });

//   } catch (error) {
//     console.error('Error during company registration:', error);
//     res.status(500).json({ message: 'Server error registering company' });
//   }
// });

// // --- UPDATED LOGIN ROUTE ---
// // @route   POST /api/company/login
// // @desc    Login for company admin
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Find the company by email
//     const company = await Company.findOne({ email });
//     if (!company) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // 2. Compare the provided password
//     const valid = await comparePassword(password, company.passwordHash);
//     if (!valid) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
    
//     // 3. Create a JWT token
//     const token = generateToken(company);

//     // 4. Send back the token and company data
//     res.status(200).json({
//       message: 'Login successful!',
//       token: token,
//       company: { id: company._id, name: company.name, email: company.email } 
//     });

//   } catch (error) {
//     console.error('Error during company login:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });
// // --- END OF UPDATE ---

// // Export the router so server.js can use it
// export default router;

import express from 'express';
import Company from '../models/Company.js'; 
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'; 
import jwt from 'jsonwebtoken'; 

const router = express.Router();

// --- NEW TOKEN FUNCTION (UNCHANGED) ---
const generateToken = (company) =>
  jwt.sign({ id: company._id, role: 'CompanyAdmin' }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
// --- END NEW FUNCTION ---


// @route   POST /api/company/register (UNCHANGED)
router.post('/register', async (req, res) => {
  // ... (existing code)
    try {
        const { name, companyCode, email, password } = req.body;
    
        // 1. Check if company exists
        let company = await Company.findOne({ $or: [{ email }, { companyCode }] });
        if (company) {
          return res.status(400).json({ message: 'Company with this email or code already exists' });
        }
    
        // 2. Hash the password
        const passwordHash = await hashPassword(password);
    
        // 3. Create and save new company
        company = new Company({
          name,
          companyCode,
          email,
          passwordHash,
        });
        await company.save();
    
        // Send a success response with the new ID
        res.status(201).json({ message: 'Company registered successfully!', companyId: company._id });
    
      } catch (error) {
        console.error('Error during company registration:', error);
        res.status(500).json({ message: 'Server error registering company' });
      }
});

// @route   POST /api/company/login (FIXED response structure)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await comparePassword(password, company.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = generateToken(company);

    // FIXED: Structure the response for consistent AuthContext access
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      company: { 
          id: company._id, 
          name: company.name, 
          email: company.email,
          role: 'Admin' 
      },
      role: 'CompanyAdmin' // For AuthContext quick role check
    });

  } catch (error) {
    console.error('Error during company login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;