import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const EmployeeLayout = ({ user, children }) => (
  <div className="flex bg-gray-50 min-h-screen">
    <Sidebar />
    <div className="flex-1 ml-60">
      <Navbar user={user} />
      <main className="p-6">{children}</main>
    </div>
  </div>
);

export default EmployeeLayout;
