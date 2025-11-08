"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Drawer,
  Divider,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Close, Person, Work, CurrencyRupee } from "@mui/icons-material";
import { getEmployees } from "@/api/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await getEmployees();
        setEmployees(res.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const handleRowClick = (params) => {
    setSelectedEmployee(params.row);
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* ─── Header ─────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Employee Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View employee profiles, salary details, and attendance insights.
        </Typography>
      </Box>

      {/* ─── Employee Table ───────────────────────────── */}
      <Paper sx={{ height: 600, p: 2, borderRadius: 3, boxShadow: 1 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={employees}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            { field: "name", headerName: "Name", flex: 1 },
            { field: "department", headerName: "Department", width: 150 },
            { field: "designation", headerName: "Designation", flex: 1 },
            {
              field: "salary",
              headerName: "Salary (₹)",
              width: 140,
              valueFormatter: (params) =>
                params.value ? params.value.toLocaleString("en-IN") : "—",
            },
            {
              field: "attendance",
              headerName: "Attendance",
              width: 130,
              valueGetter: (params) => `${params.row.attendancePercentage || 0}%`,
            },
            {
              field: "status",
              headerName: "Status",
              width: 120,
              renderCell: (params) => (
                <Chip
                  label={params.value}
                  color={params.value === "Active" ? "success" : "default"}
                  size="small"
                />
              ),
            },
          ]}
          pageSizeOptions={[5]}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
          />
        )}
      </Paper>

      {/* ─── Drawer for Employee Details ───────────────────── */}
      <Drawer
        anchor="right"
        open={Boolean(selectedEmployee)}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 340,
            p: 3,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        {selectedEmployee && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Employee Profile
              </Typography>
              <IconButton onClick={handleCloseDrawer}>
                <Close />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box textAlign="center">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 80,
                  height: 80,
                  mx: "auto",
                  fontSize: 32,
                }}
              >
                {selectedEmployee.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedEmployee.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {selectedEmployee.designation}
              </Typography>
              <Chip
                label={selectedEmployee.status}
                color={selectedEmployee.status === "Active" ? "success" : "default"}
                sx={{ mt: 1 }}
                size="small"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Work color="primary" />
                <Typography>Department: {selectedEmployee.department}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CurrencyRupee color="primary" />
                <Typography>
                  Salary: ₹{selectedEmployee.salary.toLocaleString("en-IN")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Person color="primary" />
                <Typography>
                  Attendance: {selectedEmployee.attendancePercentage || 0}%
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
}
