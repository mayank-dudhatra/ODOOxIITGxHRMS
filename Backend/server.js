// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import companyRoutes from './routes/companyRoutes.js';



// dotenv.config();
// const app = express();



// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use('/api/company', companyRoutes);

// // DB + Server
// const PORT = process.env.PORT || 5000;
// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// });



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes.js'; // Make sure to use .js extension
// Import any other routes here (e.g., authRoutes)

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/company', companyRoutes);
// app.use('/api/auth', authRoutes); // Add this when you create user auth routes

// Root endpoint
app.get('/', (req, res) => {
  res.send('Workzen SHRMS API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});