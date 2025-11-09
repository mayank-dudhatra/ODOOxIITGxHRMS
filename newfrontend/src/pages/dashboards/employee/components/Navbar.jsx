import React from "react";

const Navbar = ({ user }) => (
  <header className="bg-white shadow-md border-b px-6 py-3 flex justify-between items-center">
    <h1 className="text-xl font-bold text-blue-600">WorkZen HRMS</h1>
    <p className="text-gray-700 font-medium">👋 {user?.fullName}</p>
  </header>
);

export default Navbar;
