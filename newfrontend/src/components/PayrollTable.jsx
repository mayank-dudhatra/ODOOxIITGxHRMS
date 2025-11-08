import React, { useEffect, useState } from "react";
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
import { CurrencyRupee, PictureAsPdf, Autorenew } from "@mui/icons-material";
import {
  getPayrollList,
  processPayroll,
  generatePayslip,
} from "@/api/payroll";
import { formatINR } from "@/utils/formatCurrency";

export default function PayrollTable() {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const res = await getPayrollList();
      setPayrollData(res.data || []);
    } catch (err) {
      console.error("Error fetching payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async (employeeId) => {
    setProcessingId(employeeId);
    try {
      const res = await processPayroll(employeeId);
      setSnackbar({
        open: true,
        message: res.data?.message || "Payroll processed successfully!",
        severity: "success",
      });
      fetchPayrollData(); // Refresh table
    } catch (err) {
      console.error("Error processing payroll:", err);
      setSnackbar({
        open: true,
        message: "Failed to process payroll.",
        severity: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleGeneratePayslip = async (employeeId) => {
    try {
      const res = await generatePayslip(employeeId);
      if (res.data?.url) window.open(res.data.url, "_blank");
      else {
        setSnackbar({
          open: true,
          message: "Payslip generated successfully!",
          severity: "info",
        });
      }
    } catch (err) {
      console.error("Error generating payslip:", err);
      setSnackbar({
        open: true,
        message: "Failed to generate payslip.",
        severity: "error",
      });
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 py-6 flex justify-center">
        <CircularProgress size={28} />
      </div>
    );

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ borderRadius: 3, overflow: "hidden", backgroundColor: "#fff" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f5f7fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Attendance
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Approved Leaves
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Gross Salary
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Deductions
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Net Pay
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payrollData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#777" }}>
                  No payroll records found.
                </TableCell>
              </TableRow>
            ) : (
              payrollData.map((row) => (
                <TableRow
                  key={row._id}
                  hover
                  sx={{
                    transition: "background-color 0.2s",
                    "&:hover": { bgcolor: "#f9fafc" },
                  }}
                >
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell align="right">{row.attendanceDays}</TableCell>
                  <TableCell align="right">{row.approvedLeaves}</TableCell>
                  <TableCell align="right">{formatINR(row.grossSalary)}</TableCell>
                  <TableCell align="right">{formatINR(row.deductions)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "green" }}>
                    {formatINR(row.netPay)}
                  </TableCell>
                  <TableCell align="center">
                    <strong
                      style={{
                        color:
                          row.status === "Processed"
                            ? "green"
                            : row.status === "Pending"
                            ? "orange"
                            : "gray",
                      }}
                    >
                      {row.status}
                    </strong>
                  </TableCell>
                  <TableCell align="center">
                    {processingId === row.employeeId ? (
                      <CircularProgress size={22} />
                    ) : (
                      <>
                        {row.status === "Pending" && (
                          <Tooltip title="Process Payroll">
                            <IconButton
                              color="primary"
                              onClick={() => handleProcessPayroll(row.employeeId)}
                            >
                              <Autorenew />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Generate Payslip">
                          <IconButton
                            color="secondary"
                            onClick={() => handleGeneratePayslip(row.employeeId)}
                          >
                            <PictureAsPdf />
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

      {/* ✅ Snackbar for actions */}
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
