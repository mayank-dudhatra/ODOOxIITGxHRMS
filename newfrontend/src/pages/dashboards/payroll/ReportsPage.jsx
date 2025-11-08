"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Download } from "@mui/icons-material";
import { getPayrollReports, downloadPayslip, generatePayslip } from "@/api/payroll";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ─── Fetch Payroll Reports ───────────────────────────────
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await getPayrollReports(); // 🔹 Replace with your API call
        setReports(res.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setSnackbar({ open: true, message: "Failed to fetch reports", severity: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────
  const handleView = async (id) => {
    const selected = reports.find((r) => r.id === id);
    if (!selected?.employeeId) {
      setSnackbar({ open: true, message: "Employee ID not found", severity: "warning" });
      return;
    }
    
    try {
      const res = await generatePayslip(selected.employeeId);
      if (res.data?.url) {
        window.open(res.data.url, "_blank");
      } else {
        setSnackbar({ open: true, message: "Payslip URL not available", severity: "warning" });
      }
    } catch (error) {
      console.error("Error generating payslip:", error);
      setSnackbar({ open: true, message: "Failed to generate payslip", severity: "error" });
    }
  };

  const handleDownload = async (id) => {
    const selected = reports.find((r) => r.id === id);
    if (!selected?.employeeId) {
      setSnackbar({ open: true, message: "Employee ID not found", severity: "warning" });
      return;
    }
    
    try {
      await downloadPayslip(selected.employeeId);
      setSnackbar({ open: true, message: "Payslip download triggered successfully!", severity: "success" });
    } catch (error) {
      console.error("Error downloading payslip:", error);
      setSnackbar({ open: true, message: "Download failed", severity: "error" });
    }
  };

  // ─── Filtered Rows ─────────────────────────────────────────
  const filteredReports = reports.filter((r) =>
    r.employeeName?.toLowerCase().includes(search.toLowerCase())
  );

  // ─── DataGrid Columns ──────────────────────────────────────
  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "employeeName", headerName: "Employee", flex: 1 },
    { field: "month", headerName: "Month", flex: 0.6 },
    { 
      field: "grossSalary", 
      headerName: "Gross Salary", 
      flex: 0.8,
      valueFormatter: (value) => 
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value)
    },
    { 
      field: "netPay", 
      headerName: "Net Pay", 
      flex: 0.8,
      valueFormatter: (value) => 
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value)
    },
    { field: "status", headerName: "Status", flex: 0.6 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleView(params.row.id)}>
            <Visibility />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDownload(params.row.id)}>
            <Download />
          </IconButton>
        </>
      ),
    },
  ];

  // ─── Loading State ─────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ─── Main UI ───────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Payroll Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review, download, and manage monthly payroll records.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <TextField
            label="Search Employee"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={filteredReports}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f4f6f8",
              fontWeight: 600,
            },
          }}
        />
      </Paper>

      {/* Snackbar */}
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
    </Box>
  );
}
