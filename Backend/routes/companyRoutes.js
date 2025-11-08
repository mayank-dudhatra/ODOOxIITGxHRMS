import express from 'express';
const router = express.Router();

// --- ADDED REGISTER ROUTE ---
// @route   POST /api/company/register
// @desc    Register a new company
router.post('/register', async (req, res) => {
  try {
    const { name, companyCode, email, password } = req.body;

    // TODO:
    // 1. Check if company (email or companyCode) already exists in your database
    // 2. Hash the password using bcryptjs
    // 3. Create a new Company document and save it to the database

    console.log('Registering company with:', req.body);

    // Send a success response
    res.status(201).json({ message: 'Company registered successfully!' });

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
    // This matches what AuthContext expects: login(response.data);
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