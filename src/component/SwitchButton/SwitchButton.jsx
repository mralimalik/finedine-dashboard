import React from "react";
import "./SwitchButton.css";

const SwitchButton = ({ isActive, onToggle, disabled }) => {
  return (
    <div>
      <label className={`switch ${disabled ? "switch-disabled" : ""}`}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={onToggle}
          disabled={disabled}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default SwitchButton;
