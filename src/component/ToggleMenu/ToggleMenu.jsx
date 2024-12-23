import React, { useState, useEffect, useRef, useContext } from "react";
import "./ToggleMenu.css";
import { IoMdMore } from "react-icons/io";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu.jsx";
import axios from "axios";
import { baseUrl } from "../../const/constants.js";
import { MenuContext } from "../../context/MenuContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import ConfirmationDialogBox from "../ConfirmationDialog/ConfirmationDialog.jsx";
const ToggleMenu = ({ isMenuActive, onToggle, menuId,editMenu }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown menu
  const { setMenuItems } = useContext(MenuContext);
  const { selectedVenue, setLoading } = useContext(AuthContext);
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const handleClose = () => {
    setConfirmationDialog(!showConfirmationDialog);
    setShowMenu(!showMenu);
  };

  const handleMenuDelete = async () => {
    try {
      setLoading(true);
      const url = `${baseUrl}/menu/delete/${menuId}`;
      const token = localStorage.getItem("Token");

      // Perform the DELETE request
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is successful
      if (response.status === 200) {
        setMenuItems(
          (prev) => prev.filter((menu) => menu._id !== menuId) // Remove the deleted menu
        );
        handleClose();
        toast.success("Menu deleted successfully");
      }
    } catch (error) {
      setLoading(false);

      // Handle errors
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete the menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close the menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="toggle-menu-container" onClick={(e)=>e.stopPropagation()}>
      {/* Toggle Switch */}
      <label className="switch" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={isMenuActive} onChange={onToggle} />
        <span className="slider"></span>
      </label>

      {/* Edit Menu Button */}
      <button className="edit-menu-button" onClick={editMenu}>
        <span className="edit-icon">✏️</span> Edit Menu
      </button>

      {/* Menu Dots */}
      <span className="menu-dots" onClick={(e) => e.stopPropagation()}>
        <IoMdMore size={25} onClick={() => setShowMenu(!showMenu)} />
      </span>

      {/* Dropdown Menu */}
      {showMenu && (
        <div ref={menuRef}>
          <DropdownMenu isOpen={showMenu} onDelete={()=>setConfirmationDialog(true)} />
        </div>
      )}
      {showConfirmationDialog && (
        <ConfirmationDialogBox
          message="Do you really want to delete this menu? It will be removed permanently."
          onConfirm={handleMenuDelete}
          onCancel={handleClose}
        />
      )}
    </div>
  );
};

export default ToggleMenu;
