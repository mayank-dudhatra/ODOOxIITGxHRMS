"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Card,
  CardContent,
  Avatar,
  Container,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalance,
  People,
  Assessment,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAnalytics } from "@/api/analytics";

const COLORS = ["#1565C0", "#43A047", "#FF9800", "#E53935", "#9C27B0", "#00BCD4"];

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    payoutTrends: [],
    deductionsData: [],
    departmentDistribution: [],
    summary: {
      totalPayout: 0,
      avgPayout: 0,
      totalDeductions: 0,
      totalEmployees: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await getAnalytics();
        setAnalyticsData(res.data || {
          payoutTrends: [],
          deductionsData: [],
          departmentDistribution: [],
          summary: {
            totalPayout: 0,
            avgPayout: 0,
            totalDeductions: 0,
            totalEmployees: 0,
          },
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const { payoutTrends, deductionsData, departmentDistribution, summary } = analyticsData;
  const { totalPayout, avgPayout, totalDeductions, totalEmployees } = summary;

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

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: "calc(100% - 80px)",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      {/* ─── Header Section ─────────────────────────────── */}
      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 3,
          borderBottom: "3px solid",
          borderColor: "primary.main",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 56,
            height: 56,
            boxShadow: 3,
          }}
        >
          <AnalyticsIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "text.primary",
              letterSpacing: "-0.5px",
              mb: 0.5,
            }}
          >
            Payroll Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into payouts, deductions, and workforce distribution
          </Typography>
        </Box>
      </Box>

      {/* ─── Summary Stats Cards ─────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                    Total Payout
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    ₹{totalPayout.toLocaleString("en-IN")}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 64,
                    height: 64,
                    boxShadow: 2,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                    Average Monthly
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    ₹{avgPayout.toLocaleString("en-IN")}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 64,
                    height: 64,
                    boxShadow: 2,
                  }}
                >
                  <AccountBalance sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                    Total Employees
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    {totalEmployees}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 64,
                    height: 64,
                    boxShadow: 2,
                  }}
                >
                  <People sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                    Total Deductions
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    ₹{totalDeductions.toLocaleString("en-IN")}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 64,
                    height: 64,
                    boxShadow: 2,
                  }}
                >
                  <Assessment sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Filter Chips ─────────────────────────────── */}
      <Stack
        direction="row"
        spacing={2}
        mb={5}
        flexWrap="wrap"
        sx={{
          p: 2.5,
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "2px solid",
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <Chip
          label="Data Range: Jan - Jun 2025"
          color="primary"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        />
        <Chip
          label={`Total Employees: ${totalEmployees}`}
          color="success"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        />
        <Chip
          label={`Reports Generated: ${payoutTrends.length}`}
          color="info"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        />
      </Stack>

      {/* ─── Charts Section ─────────────────────────────── */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Payout Trend Line Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 4,
              height: 450,
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Monthly Payout Trend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track payroll expenses over the last 6 months
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart 
                data={payoutTrends.length > 0 ? payoutTrends : [{ month: "No Data", payout: 0 }]} 
                margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  stroke="#666"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "2px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="payout"
                  stroke="#1565C0"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#1565C0", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Department Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 4,
              height: 450,
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Department Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee count by department
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={110}
                  dataKey="employees"
                  nameKey="name"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "2px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Deductions Bar Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              height: 450,
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Monthly Deductions Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total deductions (PF, Tax, etc.) per month
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={deductionsData.length > 0 ? deductionsData : [{ month: "No Data", deductions: 0 }]} 
                margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  stroke="#666"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "2px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="deductions"
                  fill="#43A047"
                  radius={[12, 12, 0, 0]}
                  barSize={70}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Footer Note ─────────────────────────────── */}
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 4,
          border: "2px solid",
          borderColor: "divider",
          boxShadow: 2,
          mt: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
          📊 Analytics auto-update based on the last 6 months of payroll data
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          Last updated: {new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>
    </Container>
  );
}
