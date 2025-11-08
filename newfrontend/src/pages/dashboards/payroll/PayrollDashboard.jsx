"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  CurrencyRupee,
  People,
  Assignment,
  AccessTime,
} from "@mui/icons-material";

// ✅ Components
import PayrollTable from "@/components/PayrollTable";
import LeaveRequestsTable from "@/components/LeaveRequestsTable";
import PayrollChart from "@/components/charts/PayrollChart";
import SummaryCard from "@/components/SummaryCard";

// ✅ API Functions
import { getPayrollSummary, getPendingLeaves } from "@/api/payroll";

export default function PayrollDashboard() {
  const [summary, setSummary] = useState({});
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("📦 [PayrollDashboard] Fetching data...");

      try {
        const [summaryRes, leaveRes] = await Promise.all([
          getPayrollSummary(),
          getPendingLeaves(),
        ]);

        console.log("✅ [API] Payroll Summary Response:", summaryRes.data);
        console.log("✅ [API] Pending Leaves Response:", leaveRes.data);

        setSummary(summaryRes.data || {});
        setPendingLeaves(leaveRes.data || []);
      } catch (error) {
        console.error("❌ [ERROR] Fetching payroll dashboard data:", error);
      } finally {
        console.log("🏁 [PayrollDashboard] Data fetch complete.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🕓 Loading State
  if (loading)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <CircularProgress />
        <Typography ml={2}>Loading Payroll Dashboard...</Typography>
      </Box>
    );

  // 🧩 Render UI
  try {
    console.log("🧠 [Render] Rendering dashboard with data:", summary);

    return (
      <Box sx={{ width: "100%", maxWidth: "100%" }}>
        {/* ─── Header ─────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Payroll Officer Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage payroll, leaves, and financial analytics in one place.
          </Typography>
        </Box>

        {/* ─── Summary Cards ──────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              icon={<CurrencyRupee />}
              label="Total Payout"
              value={`₹${
                summary?.totalPayout
                  ? summary.totalPayout.toLocaleString("en-IN")
                  : "0"
              }`}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              icon={<People />}
              label="Employees Paid"
              value={summary?.employeesPaid || 0}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              icon={<Assignment />}
              label="Payruns Processed"
              value={summary?.payrunsProcessed || 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              icon={<AccessTime />}
              label="Pending Approvals"
              value={pendingLeaves?.length || 0}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* ─── Monthly Payroll Table ──────────────── */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Monthly Payroll Overview
          </Typography>
          <PayrollTable />
        </Paper>

        {/* ─── Pending Leave Requests ─────────────── */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Pending Leave Requests
          </Typography>
          <LeaveRequestsTable data={pendingLeaves} />
        </Paper>

        {/* ─── Payroll Analytics ───────────────────── */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Payroll Analytics
          </Typography>
          <PayrollChart />
        </Paper>
      </Box>
    );
  } catch (err) {
    console.error("💥 [Render Error] Dashboard render failed:", err);
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          ❌ Error rendering Payroll Dashboard: {err.message}
        </Typography>
      </Box>
    );
  }
}





// "use client";

// import { useEffect, useState } from "react";
// import { Box, Grid, Paper, Typography, Button, CircularProgress } from "@mui/material";
// import {
//   Payments,
//   People,
//   Assessment,
//   AccessTime,
//   ReceiptLong,
// } from "@mui/icons-material";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import SummaryCard from "@/components/SummaryCard";

// // Mock data (replace later with API)
// const payrollData = [
//   {
//     id: 1,
//     employee: "Riya Patel",
//     attendance: 26,
//     leaves: 1,
//     grossSalary: 35000,
//     deductions: 2000,
//     netPay: 33000,
//     status: "Processed",
//   },
//   {
//     id: 2,
//     employee: "Arjun Mehta",
//     attendance: 25,
//     leaves: 2,
//     grossSalary: 30000,
//     deductions: 1500,
//     netPay: 28500,
//     status: "Pending",
//   },
//   {
//     id: 3,
//     employee: "Sneha Shah",
//     attendance: 28,
//     leaves: 0,
//     grossSalary: 40000,
//     deductions: 2500,
//     netPay: 37500,
//     status: "Processed",
//   },
// ];

// const analyticsData = [
//   { month: "Jan", payout: 120000 },
//   { month: "Feb", payout: 150000 },
//   { month: "Mar", payout: 135000 },
//   { month: "Apr", payout: 170000 },
//   { month: "May", payout: 145000 },
//   { month: "Jun", payout: 190000 },
// ];

// export default function PayrollDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState({
//     totalPayout: 0,
//     employeesPaid: 0,
//     payrunsProcessed: 0,
//     pendingApprovals: 0,
//   });

//   useEffect(() => {
//     setTimeout(() => {
//       setSummary({
//         totalPayout: 290000,
//         employeesPaid: 12,
//         payrunsProcessed: 4,
//         pendingApprovals: 3,
//       });
//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading)
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "80vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* ─── Header ─────────────────────────────── */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" fontWeight={600} gutterBottom>
//           Payroll Officer Dashboard
//         </Typography>
//         <Typography color="text.secondary">
//           Manage payroll, approvals, and view analytics in one place.
//         </Typography>
//       </Box>

//       {/* ─── Summary Cards ───────────────────────── */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             icon={<Payments />}
//             label="Total Payout"
//             value={`₹${summary.totalPayout.toLocaleString("en-IN")}`}
//             color="primary"
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             icon={<People />}
//             label="Employees Paid"
//             value={summary.employeesPaid}
//             color="success"
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             icon={<Assessment />}
//             label="Payruns Processed"
//             value={summary.payrunsProcessed}
//             color="info"
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <SummaryCard
//             icon={<AccessTime />}
//             label="Pending Approvals"
//             value={summary.pendingApprovals}
//             color="warning"
//           />
//         </Grid>
//       </Grid>


//       {/* ─── Payroll Table ───────────────────────── */}
//       <Box sx={{ mt: 6 }}>
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           Monthly Payroll Overview
//         </Typography>

//         <Paper sx={{ height: 400, p: 2 }}>
//           <DataGrid
//             rows={payrollData}
//             columns={[
//               { field: "employee", headerName: "Employee", flex: 1 },
//               { field: "attendance", headerName: "Attendance", width: 130 },
//               { field: "leaves", headerName: "Leaves", width: 100 },
//               {
//                 field: "grossSalary",
//                 headerName: "Gross Salary (₹)",
//                 width: 180,
//                 valueFormatter: (params) =>
//                   params.value
//                     ? params.value.toLocaleString("en-IN")
//                     : "—",
//               },
//               {
//                 field: "deductions",
//                 headerName: "Deductions (₹)",
//                 width: 160,
//                 valueFormatter: (params) =>
//                   params.value
//                     ? params.value.toLocaleString("en-IN")
//                     : "—",
//               },
//               {
//                 field: "netPay",
//                 headerName: "Net Pay (₹)",
//                 width: 160,
//                 valueFormatter: (params) =>
//                   params.value
//                     ? params.value.toLocaleString("en-IN")
//                     : "—",
//               },
//               {
//                 field: "status",
//                 headerName: "Status",
//                 width: 130,
//                 renderCell: (params) => (
//                   <Typography
//                     sx={{
//                       color:
//                         params.value === "Processed" ? "green" : "orange",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {params.value}
//                   </Typography>
//                 ),
//               },
//               {
//                 field: "actions",
//                 headerName: "Actions",
//                 width: 180,
//                 renderCell: () => (
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     startIcon={<ReceiptLong />}
//                   >
//                     Payslip
//                   </Button>
//                 ),
//               },
//             ]}
//             pageSizeOptions={[5]}
//             disableRowSelectionOnClick
//           />
//         </Paper>
//       </Box>

//       {/* ─── Analytics Section ───────────────────────── */}
//       <Box sx={{ mt: 6 }}>
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           Payroll Trends
//         </Typography>
//         <Paper sx={{ p: 3 }}>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={analyticsData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip
//                 formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="payout"
//                 stroke="#1565c0"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }
