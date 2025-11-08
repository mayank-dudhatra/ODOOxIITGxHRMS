"use client";

import { Paper, Box, Typography, Avatar } from "@mui/material";

export default function SummaryCard({ icon, label, value, color = "primary" }) {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Icon Circle */}
      <Avatar
        sx={{
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>

      {/* Text Section */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: "uppercase", fontWeight: 500, fontSize: 13 }}
        >
          {label}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
