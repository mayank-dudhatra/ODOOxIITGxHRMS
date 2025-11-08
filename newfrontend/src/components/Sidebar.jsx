"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  People,
  Summarize,
  BarChart,
  Settings,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 300; // ⬅️ Increased from 280 → 300 for better space

export default function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/payroll/dashboard" },
    { label: "Employees", icon: <People />, path: "/payroll/employees" },
    { label: "Reports", icon: <Summarize />, path: "/payroll/reports" },
    { label: "Analytics", icon: <BarChart />, path: "/payroll/analytics" },
    { label: "Settings", icon: <Settings />, path: "/payroll/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* ─── Top Section (Logo + Title) ─────────────────────────── */}
      <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 2,
              width: 40,
              height: 40,
              fontWeight: 600,
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            WZ
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              WorkZen HRMS
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              Payroll Officer
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Navigation Section ─────────────────────────── */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 3 }}>
        <List>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/payroll/dashboard" &&
                location.pathname === "/payroll");

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1.5 }}> {/* ⬅️ Added extra spacing between items */}
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    py: 1.5, // ⬅️ Slightly taller buttons
                    px: 3,
                    mx: 1.5,
                    borderRadius: 2,
                    color: isActive
                      ? "primary.main"
                      : theme.palette.text.secondary,
                    backgroundColor: isActive
                      ? "rgba(21, 101, 192, 0.08)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(21, 101, 192, 0.08)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "1rem", // ⬅️ Slightly bigger text
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* ─── Logout Section ─────────────────────────── */}
      <Box sx={{ borderTop: "1px solid #e0e0e0", p: 2.5 }}>
        <ListItemButton
          onClick={() => alert("Logout coming soon!")}
          sx={{
            borderRadius: 2,
            mx: 1.5,
            color: theme.palette.error.main,
            "&:hover": {
              bgcolor: "rgba(244, 67, 54, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 36 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
