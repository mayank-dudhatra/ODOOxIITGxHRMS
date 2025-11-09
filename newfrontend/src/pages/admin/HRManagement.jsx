import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { PersonAdd, Refresh, SupervisorAccount } from '@mui/icons-material';
import { getEmployees, addEmployee } from '@/api/employees'; 
import { AuthContext } from '../../context/AuthContext'; 

// --- Fixed Role for this Management Page ---
const ROLE_TO_MANAGE = 'HR';

// --- Initial Form State for New HR Officer ---
const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 'Male',
  dateOfBirth: '', 
  department: 'Human Resources', // Default department for HR
  designation: 'HR Officer', // Default designation
  role: ROLE_TO_MANAGE, // Fixed role
  dateOfJoining: new Date().toISOString().substring(0, 10),
  employmentType: 'Full-Time',
  grossSalary: 40000, // Placeholder salary
  address: '',
};

const HRManagement = () => {
  const { user } = useContext(AuthContext); 
  // Admin login stores company ID here
  const companyId = user?.company?.id; 

  const [employees, setEmployees] = useState([]); // All employees fetched
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCredentials, setNewCredentials] = useState(null);

  // --- Fetch All Employees (for filtering) ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      const formattedEmployees = (res.data.employees || []).map(emp => ({
          ...emp,
          fullName: `${emp.firstName} ${emp.lastName}` 
      }));
      setEmployees(formattedEmployees); 
    } catch (error) {
      console.error("Error fetching employees:", error);
      setSnackbar({ open: true, message: "Failed to fetch employee list.", severity: 'error' });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) { 
        fetchEmployees();
    } else if (user !== undefined) {
        setLoading(false);
    }
  }, [companyId, user]);

  // --- Handle Form Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Handle Form Submission (Create HR Officer) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
        setSnackbar({ open: true, message: "Company ID missing. Please log in as the Company Admin.", severity: 'error' });
        return;
    }
    setIsSubmitting(true);
    setNewCredentials(null);

    const dataToSend = {
        ...formData,
        company: companyId, 
        role: ROLE_TO_MANAGE, // Ensure role is fixed to HR
        grossSalary: Number(formData.grossSalary),
    };

    try {
      const res = await addEmployee(dataToSend);
      
      setNewCredentials(res.data.userCredentials);
      setSnackbar({ 
          open: true, 
          message: res.data?.message || `New ${ROLE_TO_MANAGE} Officer created successfully!`, 
          severity: 'success' 
      });
      fetchEmployees(); 
    } catch (error) {
      console.error(`Error creating ${ROLE_TO_MANAGE} Officer:`, error);
      setSnackbar({ 
          open: true, 
          message: error.response?.data?.message || `Failed to create ${ROLE_TO_MANAGE} Officer.`, 
          severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Filter and Render HR List ---
  const hrOfficers = employees.filter(emp => emp.role === ROLE_TO_MANAGE);

  const renderOfficerList = () => {
    if (hrOfficers.length === 0 && !loading) return (
        <Typography color="text.secondary" textAlign="center" py={5}>
            No HR Officers found. Click "Add New HR Officer" to create one.
        </Typography>
    );

    return (
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {hrOfficers.map(emp => (
                <Box 
                    key={emp._id} 
                    p={2} 
                    mb={1} 
                    sx={{ 
                        borderBottom: '1px solid #E5E7EB',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': { bgcolor: '#F9FAFB' }
                    }}
                >
                    <Box>
                        <Typography variant="body1" fontWeight={600}>
                            {emp.firstName} {emp.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {emp.designation}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                        Employee ID: {emp.userId}
                    </Typography>
                </Box>
            ))}
        </div>
    );
  };

  // --- Render Loading/Error States ---
  if (loading) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
              <CircularProgress />
              <Typography ml={2}>Loading HR Management Data...</Typography>
          </Box>
      );
  }

  if (user !== null && !companyId) {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="70vh" p={3} sx={{ bgcolor: 'error.light', borderRadius: 3 }}>
          <Typography variant="h5" color="error.main" mb={2} fontWeight={700}>
              🚨 Access Denied / Permission Error
          </Typography>
          <Typography color="text.primary" textAlign="center">
              Only the **Company Administrator** has access to HR Management. <br/> Please ensure you are logged in using the Company Admin credentials.
          </Typography>
        </Box>
    );
  }

  // --- Main Render ---
  return (
    <Box sx={{ p: 0 }}>
      {/* Header with action button */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 4 }}
      >
        <Box>
            <Typography 
                variant="h4" 
                fontWeight={800} 
                color="text.primary"
            >
                HR Management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Manage HR Officer accounts, permissions, and settings.
            </Typography>
        </Box>
        <Box display="flex" gap={2}>
            <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchEmployees}
                disabled={loading}
            >
                Refresh List
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAdd />}
                onClick={() => {
                    setFormData(initialFormData);
                    setNewCredentials(null);
                    setIsModalOpen(true);
                }}
            >
                Add New HR Officer
            </Button>
        </Box>
      </Box>

      {/* HR Officer List Container */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
            <SupervisorAccount /> Current HR Officers List ({hrOfficers.length})
        </Typography>
        {renderOfficerList()}
      </Paper>


      {/* --- Create HR Officer Modal --- */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
            {newCredentials ? "HR Officer Account Created" : "Add New HR Officer"}
        </DialogTitle>
        <DialogContent dividers>
            {/* Success View: Display Credentials */}
            {newCredentials ? (
                <Box sx={{ p: 2, bgcolor: 'success.light', color: 'success.dark', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        ✅ HR Officer Account Details
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        **Login ID:** <code style={{ fontWeight: 'bold' }}>{newCredentials.loginId}</code>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        **Temporary Password:** <code style={{ fontWeight: 'bold' }}>{newCredentials.password}</code>
                    </Typography>
                    <Alert severity="warning">
                        Please save these credentials securely.
                    </Alert>
                </Box>
            ) : (
                // Form View
                <form onSubmit={handleSubmit} id="create-hr-form">
                    <Grid container spacing={3}>
                        {/* Personal Details */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Personal Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Gender</InputLabel>
                                <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Date of Birth" 
                                name="dateOfBirth" 
                                type="date"
                                value={formData.dateOfBirth} 
                                onChange={handleChange} 
                                required 
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required fullWidth multiline/>
                        </Grid>

                        {/* Employment Details (Fixed Role) */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                                Employment & Salary (Role: {ROLE_TO_MANAGE} Officer)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField label="Department" name="department" value={formData.department} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Designation" name="designation" value={formData.designation} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={4}>
                            {/* Role is FIXED to HR */}
                            <TextField label="Role" name="role" value={ROLE_TO_MANAGE} disabled fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField 
                                label="Date of Joining" 
                                name="dateOfJoining" 
                                type="date"
                                value={formData.dateOfJoining} 
                                onChange={handleChange} 
                                required 
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required>
                                <InputLabel>Employment Type</InputLabel>
                                <Select label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleChange}>
                                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                                    <MenuItem value="Contract">Contract</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Gross Salary (₹)" 
                                name="grossSalary" 
                                type="number"
                                value={formData.grossSalary} 
                                onChange={handleChange} 
                                required 
                                fullWidth 
                            />
                        </Grid>
                    </Grid>
                </form>
            )}
        </DialogContent>
        <DialogActions>
            {newCredentials ? (
                <Button onClick={() => setIsModalOpen(false)} color="primary" variant="contained">
                    Done
                </Button>
            ) : (
                <>
                    <Button onClick={() => setIsModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-hr-form"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                    >
                        {isSubmitting ? 'Creating...' : `Add ${ROLE_TO_MANAGE} Officer`}
                    </Button>
                </>
            )}
        </DialogActions>
      </Dialog>


      {/* --- Snackbar Notification --- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
};

export default HRManagement;