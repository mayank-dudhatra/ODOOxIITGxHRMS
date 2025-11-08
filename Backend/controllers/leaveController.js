import Leave from "../models/Leave.js";

/* ============================================================
   🧾 LEAVE CONTROLLER — For Payroll Officer & HR
   ============================================================ */

// 🔹 Get all pending leave requests
export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("❌ Error fetching pending leaves:", error);
    res.status(500).json({ message: "Failed to fetch pending leaves" });
  }
};

// 🔹 Approve a leave request
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.status(200).json({ message: "Leave approved successfully", leave });
  } catch (error) {
    console.error("❌ Error approving leave:", error);
    res.status(500).json({ message: "Failed to approve leave" });
  }
};

// 🔹 Reject a leave request
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.status(200).json({ message: "Leave rejected successfully", leave });
  } catch (error) {
    console.error("❌ Error rejecting leave:", error);
    res.status(500).json({ message: "Failed to reject leave" });
  }
};

// 🔹 (Optional) Get all leaves (for reports or HR)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};
