import React, { useState, useContext, useEffect } from "react";
import "./AddNewItemSheet.css";
import ItemGeneralInformation from "../ItemGeneralnformation/ItemGeneralInformation.jsx";
import ItemPriceInformation from "../ItemPriceInformation/ItemPriceInformation.jsx";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import Select from "react-select";
import ItemModifierOptions from "../ItemModifierOptions/ItemModifierOptions.jsx";
const AddNewItemSheet = () => {
  const [activeTab, setActiveTab] = useState("general");

  const { menuId } = useParams();
  const { selectedVenue } = useContext(AuthContext);

  const {
    createItem,
    closeSectionSheet,
    editItemData,
    clearItemFields,
    assignItemDataToVariables,
  } = useContext(MenuContext);

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <ItemGeneralInformation />;
      case "price":
        return <ItemPriceInformation />;
      case "modifier":
        return <ItemModifierOptions />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  useEffect(() => {
    if (editItemData) {
      assignItemDataToVariables(editItemData);
    } else {
      clearItemFields();
    }
  }, [editItemData]);

  return (
    <div className="add-item-container">
      <h3 className="text-lg font-medium border-y px-2 py-3">Add Item</h3>
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "general" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`tab ${activeTab === "price" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          Price Options
        </button>
        <button
          className={`tab ${activeTab === "modifier" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("modifier")}
        >
          Modifier Options
        </button>
      </div>
      <div className="item-sheet-content">{renderContent()}</div>

      <div className="item-buttons">
        <button
          type="button"
          className="cancel-button"
          onClick={closeSectionSheet}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="add-button"
          onClick={() => {
            createItem(menuId, selectedVenue);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddNewItemSheet;
