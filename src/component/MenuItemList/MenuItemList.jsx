import React, { useState, useContext, useRef, useEffect } from "react";
import SwitchButton from "../SwitchButton/SwitchButton.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import { MdDragHandle } from "react-icons/md";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import ConfirmationDialogBox from "../ConfirmationDialog/ConfirmationDialog.jsx";
import { IoMdMore } from "react-icons/io";
import { baseUrl } from "../../const/constants.js";
import axios from "axios";
import { toast } from "react-toastify";
const MenuItemList = ({ menuItemData }) => {
  // to set price
  const [price, setPrice] = useState(menuItemData.price);
  // to show the dropdown menu of deleting
  const [showMenu, setShowMenu] = useState(false);
  // to show the confirmation dilaog
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  // Manage isActive state
  const [isActive, setIsActive] = useState(menuItemData.isActive);

  // for menu ref to close
  const menuRef = useRef(null);

  // store the section and their items data
  const { setMenuSectionsData, handleItemDelete } = useContext(MenuContext);
  // to show item edit side sheet
  const { toggleEditItemSheet, updateActiveItem } = useContext(MenuContext);
  const { setLoading } = useContext(AuthContext);

  const handlePriceChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
    }
  };
  // Handle toggle for SwitchButton
  const handleToggle = async () => {
    await updateActiveItem(menuItemData._id, setLoading, !isActive);

    setIsActive((prevIsActive) => !prevIsActive); // Toggle isActive state
  };

  // handle click outside the dropdown menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // handle close of dialog and menu
  const handleClose = () => {
    setConfirmationDialog(false);
    setShowMenu(false);
  };

  useEffect(() => {
    console.log("helo");

    setPrice(menuItemData.price);
    console.log("price", price);
  }, [menuItemData.price]);

  // Close the menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="menu-item-list bg-white rounded-md p-3 mx-8 my-4 flex justify-between items-center"
      draggable
      onClick={() => {
        toggleEditItemSheet(menuItemData);
      }}
    >
      {/* Left Section */}
      <div className="menu-item-left flex items-center gap-3">
        <div className="menu-drag-handle-nograb">{<MdDragHandle />}</div>

        <p>{menuItemData.itemName}</p>
      </div>

      {/* Right Section */}
      <div className="menu-item-right flex gap-5 items-center">
        {/* Price Input */}
        <div className="price-input flex items-center border border-gray-300 rounded-md p-1">
          <span className="text-gray-500 px-2">$</span>
          <input
            type="number"
            disabled={true}
            value={price[0].price}
            onChange={handlePriceChange}
            className="w-16 text-center outline-none"
          />
        </div>
        {/* Switch Button */}
        <div onClick={(event) => event.stopPropagation()}>
          <SwitchButton isActive={isActive} onToggle={handleToggle} />
        </div>
        <div>
          <span className="menu-dots" onClick={(e) => e.stopPropagation()}>
            <IoMdMore size={25} onClick={() => setShowMenu(!showMenu)} />
          </span>
          {showMenu && (
            <div ref={menuRef}>
              <DropdownMenu
                text="Delete Item"
                isOpen={showMenu}
                onDelete={() => setConfirmationDialog(true)}
              />
            </div>
          )}
        </div>
        {showConfirmationDialog && (
          <ConfirmationDialogBox
            message="Do you really want to delete this item? It will be removed permanently."
            onConfirm={() =>
              handleItemDelete(
                menuItemData.menuId,
                menuItemData._id,
                setLoading,
                handleClose
              )
            }
            onCancel={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default MenuItemList;
