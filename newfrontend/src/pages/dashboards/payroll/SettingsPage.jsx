"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Container,
  Divider,
} from "@mui/material";
import {
  Save,
  AccountBalance,
  Percent,
  CalendarToday,
  Info,
  Refresh,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { getPayrollSettings, updatePayrollSettings } from "@/api/payroll";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    pfRate: 12,
    taxRate: 2,
    bonusRate: 5,
    payCycle: "Monthly",
    payDate: "25",
  });

  const [initialSettings, setInitialSettings] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await getPayrollSettings();
        const backendSettings = res.data;
        
        // Map backend fields to frontend fields
        const mappedSettings = {
          pfRate: backendSettings.pfPercentage || 12,
          taxRate: backendSettings.taxPercentage || 2,
          bonusRate: backendSettings.bonusPercentage || 5,
          payCycle: backendSettings.payCycle || "Monthly",
          payDate: backendSettings.payDate || "25",
        };
        
        setSettings(mappedSettings);
        setInitialSettings(mappedSettings);
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Use defaults if API fails
        const defaults = {
          pfRate: 12,
          taxRate: 2,
          bonusRate: 5,
          payCycle: "Monthly",
          payDate: "25",
        };
        setSettings(defaults);
        setInitialSettings(defaults);
      } finally {
        setFetching(false);
      }
    }
    fetchSettings();
  }, []);

  // Check if settings have changed from initial values
  useEffect(() => {
    if (initialSettings) {
      const changed = JSON.stringify(settings) !== JSON.stringify(initialSettings);
      setHasChanges(changed);
    }
  }, [settings, initialSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      setSettings({
        pfRate: 12,
        taxRate: 2,
        bonusRate: 5,
        payCycle: "Monthly",
        payDate: "25",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Map frontend fields to backend fields
      const backendData = {
        pfPercentage: Number(settings.pfRate),
        taxPercentage: Number(settings.taxRate),
        bonusPercentage: Number(settings.bonusRate),
        payCycle: settings.payCycle,
        payDate: settings.payDate,
      };

      const res = await updatePayrollSettings(backendData);
      console.log("Settings saved:", res.data);
      
      // Update initial settings to current settings after successful save
      setInitialSettings({ ...settings });
      setHasChanges(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setOpenSnackbar(true);
      // You could add error handling here with a different snackbar message
    } finally {
      setLoading(false);
    }
  };

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
          justifyContent: "space-between",
          alignItems: "flex-start",
          pb: 3,
          borderBottom: "3px solid",
          borderColor: "primary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              boxShadow: 3,
            }}
          >
            <SettingsIcon />
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
              Payroll Configuration Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage organization-level payroll configurations and defaults
            </Typography>
          </Box>
        </Box>
        {hasChanges && (
          <Chip
            label="Unsaved Changes"
            color="warning"
            size="medium"
            sx={{ fontWeight: 700, fontSize: "0.875rem", boxShadow: 2 }}
          />
        )}
      </Box>

      {/* ─── Quick Stats Cards ─────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 56,
                    height: 56,
                    boxShadow: 2,
                  }}
                >
                  <Percent sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    PF Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                    {settings.pfRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: "error.main",
                    width: 56,
                    height: 56,
                    boxShadow: 2,
                  }}
                >
                  <AccountBalance sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Tax Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                    {settings.taxRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              border: "1px solid",
              borderColor: "divider",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: "success.main",
                    width: 56,
                    height: 56,
                    boxShadow: 2,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Pay Cycle
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                    {settings.payCycle}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Main Form Section ─────────────────────────────── */}
      <Paper
        sx={{
          p: 5,
          mb: 4,
          borderRadius: 4,
          boxShadow: 4,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            pb: 3,
            borderBottom: "2px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Salary & Deduction Parameters
          </Typography>
          <Tooltip title="Reset to defaults">
            <IconButton
              onClick={handleReset}
              color="default"
              size="large"
              sx={{
                border: "2px solid",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Provident Fund (PF) Contribution %"
              name="pfRate"
              type="number"
              fullWidth
              value={settings.pfRate}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Typography sx={{ mr: 1.5, color: "text.secondary", fontWeight: 500 }}>
                    %
                  </Typography>
                ),
              }}
              helperText="Applied to basic salary, shared equally by employee and employer"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Professional Tax %"
              name="taxRate"
              type="number"
              fullWidth
              value={settings.taxRate}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Typography sx={{ mr: 1.5, color: "text.secondary", fontWeight: 500 }}>
                    %
                  </Typography>
                ),
              }}
              helperText="Deducted automatically each month"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Bonus Rate %"
              name="bonusRate"
              type="number"
              fullWidth
              value={settings.bonusRate}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Typography sx={{ mr: 1.5, color: "text.secondary", fontWeight: 500 }}>
                    %
                  </Typography>
                ),
              }}
              helperText="Applied during bonus calculations"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Pay Cycle</InputLabel>
              <Select
                name="payCycle"
                value={settings.payCycle}
                label="Pay Cycle"
                onChange={handleChange}
                sx={{
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Bi-Monthly">Bi-Monthly</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Pay Date"
              name="payDate"
              type="number"
              fullWidth
              value={settings.payDate}
              onChange={handleChange}
              variant="outlined"
              helperText="Day of the month when salary is disbursed (e.g., 25th)"
              inputProps={{ min: 1, max: 31 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        {/* ─── Save Status & Actions ─────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
            p: 3.5,
            bgcolor: hasChanges ? "warning.light" : "success.light",
            borderRadius: 3,
            border: "2px solid",
            borderColor: hasChanges ? "warning.main" : "success.main",
            boxShadow: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: hasChanges ? "warning.dark" : "success.dark",
              fontWeight: 600,
            }}
          >
            {hasChanges
              ? "⚠️ You have unsaved changes. Don't forget to save!"
              : "✅ All changes have been saved"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasChanges || loading}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderWidth: 2,
                borderRadius: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!hasChanges || loading}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: 4,
                "&:hover": { boxShadow: 6 },
              }}
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ─── Information & Guidelines Section ─────────────────────────────── */}
      <Paper
        sx={{
          p: 5,
          borderRadius: 4,
          boxShadow: 4,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            pb: 3,
            borderBottom: "2px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 48,
              height: 48,
              boxShadow: 2,
            }}
          >
            <Info sx={{ color: "white", fontSize: 28 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Information & Guidelines
          </Typography>
        </Box>
        <Box sx={{ pl: 1 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{
              mb: 2.5,
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              lineHeight: 1.8,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              •
            </Typography>
            <span>
              <strong style={{ color: "#333" }}>PF Contribution:</strong> Applied to the
              employee's basic salary and equally contributed by both employee and employer. This
              is a mandatory deduction as per Indian labor laws.
            </span>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{
              mb: 2.5,
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              lineHeight: 1.8,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              •
            </Typography>
            <span>
              <strong style={{ color: "#333" }}>Professional Tax:</strong> Deducted automatically
              each month as per the configured rate. Varies by state and salary bracket.
            </span>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              lineHeight: 1.8,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              •
            </Typography>
            <span>
              <strong style={{ color: "#333" }}>Bonus Rates & Pay Cycles:</strong> Directly affect
              payroll calculations in the monthly payrun process. Changes take effect from the next
              payroll cycle.
            </span>
          </Typography>
        </Box>
      </Paper>

      {/* ─── Snackbar ─────────────────────────────── */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%", fontWeight: 600 }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
