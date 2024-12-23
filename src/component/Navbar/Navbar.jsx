import React from "react";
import { FiMenu } from "react-icons/fi"; // Import an icon library for the hamburger menu
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const handleProfileNavigate = ()=>{
    navigate('/account/profile');
  }

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
      <div className="flex gap-2 items-center cursor-pointer">
        <div
          className="flex items-center gap-1 hover:text-violet-600"
          onClick={handleLogout}
        >
          <FiLogOut />
          <h2 className="pr-2">Logout</h2>
        </div>
        {/* <input
          className="w-[300px] p-1 border outline-none rounded-[10px] "
          type="search"
          id="search"
          placeholder="Search"
          required
        /> */}
        <div className="account-avatar" onClick={handleProfileNavigate}></div>
      </div>
    </div>
  );
};

export default Navbar;
