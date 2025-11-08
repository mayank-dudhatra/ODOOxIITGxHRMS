"use client";

import Sidebar from "@/components/Sidebar";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const drawerWidth = 280; // Sidebar width (matches Sidebar component)

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* ─── Sidebar (Fixed) ─────────────────────────── */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: "1px solid #e0e0e0",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1200,
          overflowY: "auto",
        }}
      >
        <Sidebar />
      </Box>

      {/* ─── Main Content ─────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`, // Push content to the right of sidebar
          px: { xs: 2, md: 4 },
          py: 3,
          overflowX: "hidden",
          minHeight: "100vh",
          bgcolor: "#f9fafb",
          transition: "margin-left 0.3s ease-in-out",
          boxSizing: "border-box",
        }}
      >
        {/* Spacer for alignment (in case you add top bar later) */}
        <Toolbar />
        <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
