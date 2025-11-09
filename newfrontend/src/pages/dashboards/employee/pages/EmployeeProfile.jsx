import React, { useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";

const EmployeeProfile = () => {
  // Mock user data
  const [user, setUser] = useState({
    fullName: "Arjun Divraniya",
    email: "arjun.divraniya@workzen.com",
    phone: "+91 9876543210",
    department: "Software Development",
    designation: "Frontend Developer",
    joinDate: "2023-05-10",
    location: "Junagadh, Gujarat",
    profileImage:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  // Editable fields
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUser(formData);
    setEditable(false);
    alert("Profile updated successfully ✅");
  };

  return (
    <EmployeeLayout user={user}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile & Settings
      </h2>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200 text-center">
          <img
            src={user.profileImage}
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold text-gray-800">{user.fullName}</h3>
          <p className="text-gray-500">{user.designation}</p>
          <p className="text-gray-600 text-sm mt-2">{user.department}</p>

          <hr className="my-4" />

          <div className="text-sm text-left">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Location:</strong> {user.location}
            </p>
            <p>
              <strong>Joined:</strong> {user.joinDate}
            </p>
          </div>
        </div>

        {/* Right: Settings Form */}
        <div className="lg:col-span-2 bg-white shadow rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Account Settings
            </h3>
            <button
              onClick={() => setEditable(!editable)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              {editable ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editable}
                className="w-full border rounded p-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editable}
                className="w-full border rounded p-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editable}
                className="w-full border rounded p-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!editable}
                className="w-full border rounded p-2 text-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {editable && (
            <div className="text-right mt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Change Password
          </h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border rounded p-2 text-sm"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded p-2 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border rounded p-2 text-sm"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              Email Notifications
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              SMS Notifications
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              System Alerts (Dashboard)
            </label>
            <button className="bg-green-600 text-white px-4 py-2 mt-3 rounded hover:bg-green-700">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;
