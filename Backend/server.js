import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 1. IMPORTED
import connectDB from './config/db.js'; // 2. IMPORTED

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/company', companyRoutes);
app.use('/api/auth', authRoutes); // 3. USED

// Root endpoint
app.get('/', (req, res) => {
  res.send('Workzen SHRMS API is running...');
});

// 4. CONNECT TO DB AND START SERVER
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});