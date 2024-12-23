import React from "react";
import { FiMenu } from "react-icons/fi"; // Import an icon library for the hamburger menu
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/account/profile");
  };
  const getLettersFromName = () => {
    if (!userData) return "";
    const { firstName, lastName } = userData;
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

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

        <div
          className="account-avatar flex items-center justify-center bg-violet-500 text-white rounded-full w-8 h-8 font-bold"
          onClick={handleProfileNavigate}
        >
          {getLettersFromName()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
