// --- DUMMY DATA ---

const MOCK_EMPLOYEES = [
    { _id: "60c72b2f9c1d440000a6f871", loginId: "EMP001", firstName: "Ajay", lastName: "Sharma", email: "ajay.s@workzen.com", role: "Employee" },
    { _id: "60c72b2f9c1d440000a6f872", loginId: "EMP002", firstName: "Priya", lastName: "Verma", email: "priya.v@workzen.com", role: "Employee" },
    { _id: "60c72b2f9c1d440000a6f873", loginId: "HR001", firstName: "Sarah", lastName: "Connor", email: "sarah.c@workzen.com", role: "HR" },
    { _id: "60c72b2f9c1d440000a6f874", loginId: "PAY001", firstName: "John", lastName: "Doe", email: "john.d@workzen.com", role: "Payroll" },
    { _id: "60c72b2f9c1d440000a6f875", loginId: "EMP005", firstName: "Rajesh", lastName: "Patel", email: "rajesh.p@workzen.com", role: "Employee" },
];

let MOCK_LEAVE_REQUESTS = [
    { _id: "LID001", employeeId: MOCK_EMPLOYEES[0], leaveType: "Casual", startDate: "2025-11-15", endDate: "2025-11-17", reason: "Family trip", status: "Pending" },
    { _id: "LID002", employeeId: MOCK_EMPLOYEES[1], leaveType: "Sick", startDate: "2025-10-20", endDate: "2025-10-20", reason: "Fever", status: "Approved" },
    { _id: "LID003", employeeId: MOCK_EMPLOYEES[4], leaveType: "Unpaid", startDate: "2025-12-01", endDate: "2025-12-05", reason: "Extended travel", status: "Rejected" },
    { _id: "LID004", employeeId: MOCK_EMPLOYEES[1], leaveType: "Casual", startDate: "2025-11-08", endDate: "2025-11-09", reason: "Weekend off", status: "Pending" },
];

let MOCK_ATTENDANCE_RECORDS = [
    { _id: "AID001", employeeId: MOCK_EMPLOYEES[0], date: "2025-11-08", checkIn: "09:00", checkOut: "17:00", status: "Present" },
    { _id: "AID002", employeeId: MOCK_EMPLOYEES[1], date: "2025-11-08", checkIn: "09:30", checkOut: "18:00", status: "Late" },
    { _id: "AID003", employeeId: MOCK_EMPLOYEES[4], date: "2025-11-08", checkIn: "09:00", checkOut: null, status: "Present" },
    { _id: "AID004", employeeId: MOCK_EMPLOYEES[0], date: "2025-11-07", checkIn: "09:00", checkOut: "17:00", status: "Present" },
    { _id: "AID005", employeeId: MOCK_EMPLOYEES[1], date: "2025-11-07", checkIn: "09:00", checkOut: "17:00", status: "Present" },
    { _id: "AID006", employeeId: MOCK_EMPLOYEES[4], date: "2025-11-07", checkIn: null, checkOut: null, status: "Absent" },
];

// --- MOCK API FUNCTIONS ---

// Utility to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find employee object by ID (for attendance/leave data population)
const findEmployee = (id) => MOCK_EMPLOYEES.find(e => e._id === id || e.loginId === id);

// 1. Employee API Mock
export const getHREmployees = async () => {
    await delay(500);
    return { data: MOCK_EMPLOYEES }; // Returns the full list
};

export const getHREmployeeProfile = async (id) => {
    await delay(500);
    const employee = findEmployee(id);
    if (!employee) {
        throw new Error('Employee not found.');
    }
    return { data: employee }; // Returns a single employee profile
};

export const updateHREmployeeProfile = async (id, updates) => {
    await delay(500);
    const index = MOCK_EMPLOYEES.findIndex(e => e._id === id);
    if (index === -1) {
        throw new Error('Employee not found for update.');
    }
    // Update data in place
    MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...updates };
    return { data: { employee: MOCK_EMPLOYEES[index], message: "Profile updated successfully (Mock)" } };
};

// 2. Leave API Mock
export const getHRLeaveRequests = async () => {
    await delay(500);
    // Return a copy of the list
    return { data: [...MOCK_LEAVE_REQUESTS] }; 
};

export const approveHRLeave = async (id) => {
    await delay(500);
    const leave = MOCK_LEAVE_REQUESTS.find(l => l._id === id);
    if (leave) {
        leave.status = 'Approved';
        return { data: { message: "Leave approved (Mock)" } };
    }
    throw new Error('Leave request not found.');
};

export const rejectHRLeave = async (id) => {
    await delay(500);
    const leave = MOCK_LEAVE_REQUESTS.find(l => l._id === id);
    if (leave) {
        leave.status = 'Rejected';
        return { data: { message: "Leave rejected (Mock)" } };
    }
    throw new Error('Leave request not found.');
};

// 3. Attendance API Mock
export const getAttendanceRecords = async (id = null) => {
    await delay(500);
    let records = [...MOCK_ATTENDANCE_RECORDS];
    if (id) {
        records = records.filter(r => 
            r.employeeId.loginId === id || 
            r.employeeId.email.includes(id.toLowerCase())
        );
    }
    return { data: records };
};

export const markAttendance = async (data) => {
    await delay(500);
    const employee = findEmployee(data.employeeId);
    if (!employee) {
        throw new Error('Employee ID not found for marking attendance.');
    }
    const newRecord = {
        _id: `AID${Date.now()}`,
        employeeId: employee,
        date: data.date,
        checkIn: data.checkIn,
        checkOut: data.checkOut || null,
        status: data.status,
    };
    MOCK_ATTENDANCE_RECORDS.unshift(newRecord); // Add to the start
    return { data: newRecord };
};

export const updateAttendance = async (id, updates) => {
    await delay(500);
    const index = MOCK_ATTENDANCE_RECORDS.findIndex(r => r._id === id);
    if (index === -1) {
        throw new Error('Attendance record not found.');
    }
    MOCK_ATTENDANCE_RECORDS[index] = { ...MOCK_ATTENDANCE_RECORDS[index], ...updates };
    return { data: MOCK_ATTENDANCE_RECORDS[index] };
};

export const deleteAttendance = async (id) => {
    await delay(500);
    const initialLength = MOCK_ATTENDANCE_RECORDS.length;
    MOCK_ATTENDANCE_RECORDS = MOCK_ATTENDANCE_RECORDS.filter(r => r._id !== id);
    if (MOCK_ATTENDANCE_RECORDS.length === initialLength) {
        throw new Error('Attendance record not found for deletion.');
    }
    return { data: { message: "Record deleted (Mock)" } };
};