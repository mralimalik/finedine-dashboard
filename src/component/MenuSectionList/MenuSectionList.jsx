import React, { useContext, useState, useEffect, useRef } from "react";
import MenuItemList from "../MenuItemList/MenuItemList.jsx";
import "./MenuSectionList.css";
import SwitchButton from "../SwitchButton/SwitchButton.jsx";
import AddMenuSectionItem from "../AddMenuSectionItemDropdown/AddMenuSectionItem.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import { MdDragHandle } from "react-icons/md";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import ConfirmationDialogBox from "../ConfirmationDialog/ConfirmationDialog.jsx";
import { IoMdMore } from "react-icons/io";
import { baseUrl } from "../../const/constants.js";
import axios from "axios";
import { toast } from "react-toastify";
const MenuSectionList = ({ sectionData, subSections, items }) => {
  // to show the expanded list
  const [isExpanded, setIsExpanded] = useState(false); // State for expansion
  // to handle the section active
  const [isActive, setIsActive] = useState(sectionData.isActive);
  // to show the dropdown menu of deleting
  const [showMenu, setShowMenu] = useState(false);
  // to show the confirmation dilaog
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  // for menu ref to close
  const menuRef = useRef(null);

  // seting menu section after delete
  const { setMenuSectionsData, setMenuItems } = useContext(MenuContext);
  const { setLoading } = useContext(AuthContext);
  // to open edit section and update the active toggle
  const { openEditSectionSheet, updateActiveSection } = useContext(MenuContext);

  // Toggle expand/collapse list
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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

  // to delete the section data from backend
  const handleSectionDelete = async (menuId, sectionId) => {
    try {
      setLoading(true);

      // Construct the URL for DELETE request
      const url = `${baseUrl}/menu/delete/${menuId}/section/${sectionId}`;
      const token = localStorage.getItem("Token");

      // Perform the DELETE request
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If deletion is successful, update the sections state
      if (response.status === 200) {
        // Update the menuSectionsData by removing the deleted section
        setMenuSectionsData((prev) => removeSection(prev, sectionId));

        // Increment the section count in the corresponding menu
        setMenuItems((prevMenuItems) =>
          prevMenuItems.map((menu) =>
            menu._id === menuId
              ? { ...menu, sections: menu.sections - 1 }
              : menu
          )
        );
        handleClose(); // Close any open modals or UI elements
        toast.success("Section deleted successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting section:", error);
      toast.error("Failed to delete the section. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Recursive function to remove the section from nested sections
  const removeSection = (sections, sectionIdToDelete) => {
    return sections.reduce((updatedSections, section) => {
      // Skip the section if it matches the ID to delete
      if (section._id === sectionIdToDelete) return updatedSections;

      // If the section has subSections, recursively remove from them
      if (section.subSections && section.subSections.length) {
        section.subSections = removeSection(
          section.subSections,
          sectionIdToDelete
        );
      }
      // Add the current section to the list if it isn't deleted
      updatedSections.push(section);
      return updatedSections;
    }, []);
  };

  // function to render subsections if there is any
  const renderSections = () => {
    if (subSections) {
      return (
        subSections.length > 0 && (
          <div>
            {subSections.map((subSection, index) => (
              <MenuSectionList
                key={subSection._id}
                sectionData={subSection}
                subSections={subSection.subSections}
                items={subSection.items}
              />
            ))}
          </div>
        )
      );
    }
  };

  // function to render subitems in any subsection if there is any
  const renderItems = () => {
    if (items) {
      return (
        items.length > 0 && (
          <div>
            {items.map((item) => (
              <MenuItemList key={item._id} menuItemData={item} />
            ))}
          </div>
        )
      );
    }
  };
  // Handle toggle for SwitchButton
  const handleToggle = async () => {
    const newIsActive = !isActive; // Determine new state
    setIsActive(newIsActive); // Optimistic update
    try {
      await updateActiveSection(newIsActive, sectionData._id); // API call via context
    } catch (error) {
      console.error("Error updating section isActive:", error);
      setIsActive(!newIsActive); // Revert state if API call fails
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
    <div>
      <div
        className="menu-section-list bg-white  rounded-md p-3 mx-8 my-4 flex justify-between items-center"
        draggable
        onClick={() => {
          toggleExpand(), openEditSectionSheet(sectionData);
        }}
      >
        <div className="menu-section-left flex gap-2">
          <div className="menu-drag-handle-nograb flex items-center justify-center flex-col">
            {<MdDragHandle />}
          </div>
          <p>{sectionData.sectionName}</p>
        </div>
        <div className="menu-section-right flex gap-5 items-center">
          <div onClick={(event) => event.stopPropagation()}>
            <SwitchButton isActive={isActive} onToggle={handleToggle} />
          </div>
          <button className="expand-btn">{isExpanded ? "▲" : "▼"}</button>
          <div>
            <span className="menu-dots" onClick={(e) => e.stopPropagation()}>
              <IoMdMore size={25} onClick={() => setShowMenu(!showMenu)} />
            </span>
            {showMenu && (
              <div ref={menuRef}>
                <DropdownMenu
                  text="Delete Section"
                  isOpen={showMenu}
                  onDelete={() => setConfirmationDialog(true)}
                />
              </div>
            )}
          </div>
          {showConfirmationDialog && (
            <ConfirmationDialogBox
              message="Do you really want to delete this section? It will be removed permanently with items."
              onConfirm={() =>
                handleSectionDelete(sectionData.menuId, sectionData._id)
              }
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
      {/* Expandable Content */}
      {isExpanded && (
        <div className="pl-10">
          {renderItems()}
          {renderSections()}
          <AddMenuSectionItem parentId={sectionData._id} />
        </div>
      )}
    </div>
  );
};

export default MenuSectionList;
