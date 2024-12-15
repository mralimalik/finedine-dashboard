import { useContext, useState } from "react";
import "./MenuEditor.css";
import MenuItemList from "../../component/MenuItemList/MenuItemList.jsx";
import MenuSectionList from "../../component/MenuSectionList/MenuSectionList.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AddMenuSectionItem from "../../component/AddMenuSectionItemDropdown/AddMenuSectionItem.jsx";
import AddNewSectionSheet from "../../component/AddNewSectionSheet/AddNewSectionSheet.jsx";
import AddNewItemSheet from "../../component/AddNewItemSheet/AddNewItemSheet.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
const MenuEditor = () => {
  const { menuData, setMenuSectionsData, getMenuesItemsandSections } = useContext(MenuContext);
  const { showSectionItemSheet,setShowSectionItemSheet } = useContext(MenuContext);
  const { menuId } = useParams();

  useEffect(() => {
    setShowSectionItemSheet(null);
    getMenuesItemsandSections(menuId);
  }, []);

  return (
    <div className="flex m-3">
      <div className="flex-grow menu-scrollable">
        <AddMenuSectionItem parentId={null} />
        {menuData.map((section, index) => {
          if (section.type === "SECTION") {
            return (
              <MenuSectionList
                key={section._id}
                sectionData={section}
                items={section.items}
                subSections={section.subSections}
              />
            );
          }
          return <MenuItemList key={section._id} menuItemData={section} />;
        })}
      </div>
      {showSectionItemSheet === "SECTION" && <AddNewSectionSheet />}
      {showSectionItemSheet === "ITEM" && <AddNewItemSheet />}
    </div>
  );
};

export default MenuEditor;
