import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "Attendance", path: "/employee/attendance" },
   { name: "Leaves", path: "/employee/leaves" }, 
    { name: "Payroll", path: "/employee/payroll" },
    { name: "Profile", path: "/employee/profile" },
  ];

  return (
    <aside className="bg-blue-700 text-white w-60 h-screen fixed top-0 left-0 p-5">
      <h2 className="text-lg font-semibold mb-8">Employee Panel</h2>
      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-800" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
