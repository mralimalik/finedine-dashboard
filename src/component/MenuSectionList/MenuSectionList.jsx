import React, { useContext, useState } from "react";
import MenuItemList from "../MenuItemList/MenuItemList.jsx";
import "./MenuSectionList.css";
import SwitchButton from "../SwitchButton/SwitchButton.jsx";
import AddMenuSectionItem from "../AddMenuSectionItemDropdown/AddMenuSectionItem.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import { Menu } from "../../../../backend/src/models/menu.model.js";
const MenuSectionList = ({ sectionData, subSections, items }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for expansion
  const [isActive, setIsActive] = useState(sectionData.isActive); // State for active/inactive toggle

  const { openEditSectionSheet } = useContext(MenuContext);
  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // function to render subsections if there is any
  const renderSections = () => {
    if (subSections) {
      return (
        subSections.length > 0 && (
          <div>
            {subSections.map((subSection) => (
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
 const handleToggle = () => {
  setIsActive((prevIsActive) => !prevIsActive); // Toggle active/inactive state
};
  return (
    <div>
      <div
        className="menu-section-list bg-white  rounded-md p-3 mx-8 my-4 flex justify-between"
        draggable
        onClick={() => {
          toggleExpand(), openEditSectionSheet(sectionData);
        }}
      >
        <div className="menu-section-left flex gap-2">
          <div className="menu-drag-handle-nograb">---</div>
          <p>{sectionData.sectionName}</p>
        </div>
        <div
          className="menu-section-right flex gap-5"
        >
          <div onClick={(event) => event.stopPropagation()}>
          <SwitchButton isActive={isActive} onToggle={handleToggle} />

          </div>
          <button className="expand-btn">{isExpanded ? "▲" : "▼"}</button>
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
