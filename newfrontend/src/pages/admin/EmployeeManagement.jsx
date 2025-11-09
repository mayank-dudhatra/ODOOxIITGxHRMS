// mayank-dudhatra/odooxiitgxhrms/ODOOxIITGxHRMS-086f4cc21199ce5de19bba988b3c4bc0b4ff5a9f/newfrontend/src/pages/admin/EmployeeManagement.jsx

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
import { PersonAdd, Refresh } from '@mui/icons-material';
// Ensure these imports are correct based on the directory structure
import { getEmployees, addEmployee } from '@/api/employees'; 
import { AuthContext } from '../../context/AuthContext'; 

// --- Initial Form State for New Employee ---
const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 'Male',
  dateOfBirth: '', 
  department: '',
  designation: '',
  role: 'Employee', 
  dateOfJoining: new Date().toISOString().substring(0, 10),
  employmentType: 'Full-Time',
  grossSalary: 0,
  address: '',
};

const EmployeeManagement = () => {
  // Get user context to access company ID. Admin login stores it at user.company.id.
  const { user } = useContext(AuthContext); 
  const companyId = user?.company?.id; 

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCredentials, setNewCredentials] = useState(null);

  // --- Fetch Employees ---
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

  // --- CRITICAL FIX: Only fetch data once companyId is available ---
  useEffect(() => {
    if (companyId) { 
        fetchEmployees();
    } else if (user !== undefined) {
        // If user is definitively loaded but companyId is absent, it's not the Admin, stop loading.
        setLoading(false);
    }
  }, [companyId, user]);

  // --- Handle Form Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Handle Form Submission (Create Employee) ---
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
        grossSalary: Number(formData.grossSalary),
    };

    try {
      const res = await addEmployee(dataToSend);
      
      // Success: Show credentials and refresh list
      setNewCredentials(res.data.userCredentials);
      setSnackbar({ 
          open: true, 
          message: res.data?.message || "Employee created successfully!", 
          severity: 'success' 
      });
      fetchEmployees(); // Refresh list to show new employee
    } catch (error) {
      console.error("Error creating employee:", error);
      setSnackbar({ 
          open: true, 
          message: error.response?.data?.message || "Failed to create employee.", 
          severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Employee List ---
  const renderEmployeeList = () => {
    if (employees.length === 0) return (
        <Typography color="text.secondary" textAlign="center" py={5}>
            No employees found. Click "Create New Employee" to add one.
        </Typography>
    );

    return (
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {employees.map(emp => (
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
                            {emp.designation} - {emp.department}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                        ID: {emp.userId}
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
              <Typography ml={2}>Loading Employee Data...</Typography>
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
              Only the **Company Administrator** has access to Employee Management. <br/> Please ensure you are logged in using the Company Admin credentials.
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
                Employee Management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Add, edit, and view all employees across the company.
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
                Create New Employee
            </Button>
        </Box>
      </Box>

      {/* Employee List Container */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
            Current Employee List
        </Typography>
        {renderEmployeeList()}
      </Paper>


      {/* --- Create Employee Modal --- */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
            {newCredentials ? "Employee Created Successfully" : "Create New Employee"}
        </DialogTitle>
        <DialogContent dividers>
            {/* Success View: Display Credentials */}
            {newCredentials ? (
                <Box sx={{ p: 2, bgcolor: 'success.light', color: 'success.dark', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        ✅ Employee **{newCredentials.role}** Account Details
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        **Login ID:** <code style={{ fontWeight: 'bold' }}>{newCredentials.loginId}</code>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        **Temporary Password:** <code style={{ fontWeight: 'bold' }}>{newCredentials.password}</code>
                    </Typography>
                    <Alert severity="warning">
                        Please save these credentials. The employee should change the password upon first login.
                    </Alert>
                </Box>
            ) : (
                // Form View
                <form onSubmit={handleSubmit} id="create-employee-form">
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

                        {/* Employment Details */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                                Employment & Salary
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField label="Department" name="department" value={formData.department} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Designation" name="designation" value={formData.designation} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required>
                                <InputLabel>Role</InputLabel>
                                <Select label="Role" name="role" value={formData.role} onChange={handleChange}>
                                    <MenuItem value="Employee">Employee</MenuItem>
                                    <MenuItem value="HR">HR Officer</MenuItem>
                                    <MenuItem value="Payroll">Payroll Officer</MenuItem>
                                </Select>
                            </FormControl>
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
                        form="create-employee-form"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Employee'}
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

export default EmployeeManagement;