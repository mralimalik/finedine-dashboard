import React from "react";
import "./MenuManagement.css";
import MenuList from "../../component/MenuList/MenuList";
import CreateMenuForm from "../../component/CreateMenuForm/CreateMenuForm.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import AddModifierGroupForm from "../../component/AddModifierGroupForm/AddModifierGroupForm.jsx";
import ModifierGroupTable from "../../component/ModifierGroupTable/ModifierGroupTable.jsx";
const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("menu");

  const [selectedForm, setSelectedForm] = useState(null);
  const { selectedVenue } = useContext(AuthContext);

  const handleOpenMenuForm = () => {
    if (activeTab === "menu") {
      setSelectedForm("createMenu");
    } else if (activeTab === "modifier") {
      setSelectedForm("addModifier");
    } else {
      setSelectedForm(null);
    }
  };
  const handleCloseForm = () => {
    setSelectedForm(null);
  };

  return (
    <div className="main-menu-div">
      <div className="menu-heading-row">
        <h2 className="text-xl">Menu Management</h2>
        {selectedVenue && (
          <button
            className="create-menu-button"
            onClick={handleOpenMenuForm}
          >
            {activeTab === "menu" ? "Create Menu" : "Add Modifier Group"}
          </button>
        )}
      </div>
      <div className="menutabs">
        <button
          className={`tab ${activeTab === "menu" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
        <button
          className={`tab ${activeTab === "modifier" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("modifier")}
        >
          Modifiers
        </button>
      </div>
        {
          activeTab==="menu" && (
            <MenuList />
          )
        }
          {
          activeTab==="modifier" && (
            <ModifierGroupTable/>
          )
        }
      {selectedForm === "createMenu" && (
        <CreateMenuForm isOpen={selectedForm} onClose={handleCloseForm} />
      )}
      {selectedForm === "addModifier" && (
        <AddModifierGroupForm isOpen={selectedForm} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default MenuManagement;
