import React from "react";
import "./SwitchButton.css";
const SwitchButton = ({ isActive, onToggle }) => {
  return (
    <div>
      <label className="switch">
        <input
          type="checkbox"
          checked={isActive}
          onChange={onToggle} 
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default SwitchButton;
