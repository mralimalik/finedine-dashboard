import React from "react";
import { FiMenu } from "react-icons/fi"; // Import an icon library for the hamburger menu
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar-items w-full bg-white px-4 py-2 flex justify-end items-center gap-2">
      <button
        className="hidden show-menu-icon"
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
      >
        <FiMenu />
      </button>
      <div className="flex gap-2">
        <input
          className="w-[300px] p-1 border outline-none rounded-[10px] "
          type="search"
          id="search"
          placeholder="Search"
          required
        />
        <div className="account-avatar"></div>
      </div>
    </div>
  );
};

export default Navbar;
