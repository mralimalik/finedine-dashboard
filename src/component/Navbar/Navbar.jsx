import React from "react";
import "./Navbar.css";
const Navbar = () => {
  return (
    <div className="navbar">
      <input
        className="w-[300px] p-1 border outline-none rounded-[10px] "
        type="search"
        id="search"
        placeholder="Search"
        required
      />
      <div className="account-avatar"></div>
    </div>
  );
};

export default Navbar;
