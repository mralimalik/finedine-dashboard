import React from "react";
import "./ToggleMenu.css";

const ToggleMenu = ({ isMenuActive, onToggle }) => {
  return (
    <div className="toggle-menu-container">
      {/* Toggle Switch */}
      <label className="switch">
        <input type="checkbox" checked={isMenuActive} onChange={onToggle} />
        <span className="slider"></span>
      </label>

      {/* Edit Menu Button */}
      <button className="edit-menu-button">
        <span className="edit-icon">✏️</span> Edit Menu
      </button>

      {/* Settings Icon */}
      <span className="settings-icon">⚙️</span>

      {/* Menu Dots */}
      <span className="menu-dots">⋮</span>
    </div>
  );
};

export default ToggleMenu;
