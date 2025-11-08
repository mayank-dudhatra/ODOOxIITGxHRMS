"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getPayrollSummary } from "@/api/payroll";

export default function PayrollChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await getPayrollSummary();
        setChartData(res.data?.chartData || []);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartData([]);
      }
    }
    fetchChartData();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider",
        p: 3,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={3} color="text.primary">
        Monthly Payroll Trends (₹)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData.length > 0 ? chartData : [{ month: "No Data", payout: 0 }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(value)
            }
          />
          <Bar dataKey="payout" fill="#1565C0" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
