import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { CheckCircle, Cancel, CalendarMonth } from "@mui/icons-material";
import { approveLeave, rejectLeave } from "@/api/leave"; // ✅ Your backend API calls

export default function LeaveRequestsTable({ data = [] }) {
  const [processingId, setProcessingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleApprove = async (leaveId) => {
    setProcessingId(leaveId);
    try {
      const res = await approveLeave(leaveId);
      setSnackbar({
        open: true,
        message: res.data?.message || "Leave approved successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to approve leave.",
        severity: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (leaveId) => {
    setProcessingId(leaveId);
    try {
      const res = await rejectLeave(leaveId);
      setSnackbar({
        open: true,
        message: res.data?.message || "Leave rejected successfully!",
        severity: "warning",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to reject leave.",
        severity: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f5f7fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CalendarMonth
                    sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                  />
                  <div style={{ color: "#888" }}>No pending leave requests</div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((leave) => (
                <TableRow
                  key={leave._id}
                  hover
                  sx={{
                    transition: "background-color 0.2s",
                    "&:hover": { bgcolor: "#f9fafc" },
                  }}
                >
                  <TableCell>{leave.employeeName}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>
                    {new Date(leave.startDate).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.endDate).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <strong
                      style={{
                        color:
                          leave.status === "Approved"
                            ? "green"
                            : leave.status === "Rejected"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {leave.status}
                    </strong>
                  </TableCell>

                  <TableCell align="center">
                    {processingId === leave._id ? (
                      <CircularProgress size={22} />
                    ) : (
                      <>
                        <Tooltip title="Approve Leave">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(leave._id)}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Leave">
                          <IconButton
                            color="error"
                            onClick={() => handleReject(leave._id)}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
