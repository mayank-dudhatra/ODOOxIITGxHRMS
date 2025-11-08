import User from "../models/User.js";
import Company from "../models/Company.js";

export const generateLoginId = async (companyId, firstName, lastName, joiningDate) => {
  const company = await Company.findById(companyId);
  if (!company) throw new Error("Invalid company");

  const companyCode = company.companyCode.toUpperCase(); // e.g., LOI
  const f = firstName.toUpperCase().slice(0, 2);
  const l = lastName.toUpperCase().slice(0, 2);
  const year = new Date(joiningDate).getFullYear();

  const regex = new RegExp(`^${companyCode}${f}${l}${year}`);
  
  // 🚩 FIX 2: Added 'company' filter to ensure uniqueness is scoped to the company.
  const count = await User.countDocuments({ 
    company: companyId,
    loginId: { $regex: regex } 
  });

  const serial = String(count + 1).padStart(4, "0");
  return `${companyCode}${f}${l}${year}${serial}`;
};