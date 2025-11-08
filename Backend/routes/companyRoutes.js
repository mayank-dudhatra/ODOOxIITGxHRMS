import express from 'express';
import Company from '../models/Company.js'; // 1. IMPORT MODEL
import { hashPassword } from '../utils/passwordUtils.js'; // 2. IMPORT HASHER
const router = express.Router();

// @route   POST /api/company/register
// @desc    Register a new company
router.post('/register', async (req, res) => {
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

// --- ADDED LOGIN ROUTE ---
// @route   POST /api/company/login
// @desc    Login for company admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO:
    // 1. Find the company by email in your database
    // 2. If company doesn't exist, return 400
    // 3. Compare the provided password with the hashed password using bcryptjs
    // 4. If passwords don't match, return 400
    // 5. Create a JWT token
    // 6. Send back the token and company data (as shown in your AuthContext)

    console.log('Logging in company with:', req.body);

    // Send a placeholder success response
    res.status(200).json({
      message: 'Login successful!',
      // token: "your_jwt_token_here",
      company: { name: "Test Company", email: email } // Send back company data
    });

  } catch (error) {
    console.error('Error during company login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Export the router so server.js can use it
export default router;