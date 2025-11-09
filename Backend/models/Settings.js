import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // 🔹 Payroll Configurations
    pfPercentage: {
      type: Number,
      required: true,
      default: 12,
      min: 0,
      max: 100,
    },
    taxPercentage: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
      max: 100,
    },

    // 🔹 Salary Structure Ratios
    basicToGrossRatio: {
      type: Number,
      default: 40,
    },
    hraPercentage: {
      type: Number,
      default: 20,
    },

    // 🔹 Deductions / Bonus
    otherDeductions: {
      type: Number,
      default: 0,
    },
    bonusPercentage: {
      type: Number,
      default: 0,
    },

    // 🔹 Payroll Schedule
    payCycle: {
      type: String,
      enum: ["Monthly", "Bi-weekly", "Weekly"],
      default: "Monthly",
    },
    payDate: {
      type: String,
      default: "25",
    },

    // 🔹 Metadata
    updatedBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

// ✅ THIS IS CRUCIAL — Default export of the model
const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;


/**
 * 🔹 PUT /api/payroll/settings
 * Update or create payroll settings
 */
export const updatePayrollSettings = async (req, res) => {
  try {
    const payload = req.body;

    console.log("🛠️ [PUT] Updating payroll settings with data:", payload);

    // Basic validation
    if (
      payload.pfPercentage < 0 ||
      payload.taxPercentage < 0 ||
      payload.pfPercentage > 100 ||
      payload.taxPercentage > 100
    ) {
      return res
        .status(400)
        .json({ message: "PF and Tax percentages must be between 0 and 100." });
    }

    const updated = await Settings.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true, // Create new if missing
    });

    console.log("✅ Payroll settings updated successfully:", updated._id);

    res.status(200).json({
      message: "✅ Payroll settings updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating payroll settings:", error);
    res.status(500).json({
      message: "Failed to update payroll settings",
      error: error.message,
    });
  }
};
