import bcrypt from "bcryptjs";
import crypto from "crypto";

export const generatePassword = (length = 8) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
};

export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
