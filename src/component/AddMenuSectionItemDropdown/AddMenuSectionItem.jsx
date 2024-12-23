import React, { useState, useEffect, useRef, useContext } from "react";
import { MenuContext } from "../../context/MenuContext";
import { AuthContext } from "../../context/AuthContext";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";


const AddMenuSectionItem = ({ parentId }) => {
  const [isAddDropDownVisible, setAddDropDownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { setLoading } = useContext(AuthContext);

  const { toggleSectionSheet, toggleNewItemSheet } = useContext(MenuContext);

  // Toggle the dropdown
  const toggleAddDropdown = () => {
    console.log("parentId is", parentId);
    setAddDropDownVisible((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAddDropDownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <div
        className="add-menu-items px-4 py-4 mx-8 my-2 rounded-md bg-white cursor-pointer"
        onClick={toggleAddDropdown}
      >
        + Add
      </div>
      {/* Dropdown */}
      {isAddDropDownVisible && (
        <div className="relative">
          <div className="dropdown-menu bg-white shadow-md rounded-md p-2 absolute left-0 -mt-10 ml-32">
            <div
              className="dropdown-item py-1 px-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                toggleSectionSheet(parentId);
              }}
            >
              Section
            </div>
            <div
              className="dropdown-item py-1 px-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                toggleNewItemSheet(parentId);
              }}
            >
              Item
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMenuSectionItem;
