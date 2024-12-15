import React, { useState } from "react";
import './ReuseTextField.css'
const ReuseTextField = ({ label, name, required, placeholder, value, onChange ,className }) => {
  const [error, setError] = useState("");

  const handleBlur = () => {
    if (required && !value) {
      setError("This field is required");
    } else {
      setError("");
    }
  };

  return (
    <div className="text-field-container">
      <label className="text-field-label">
        {label}
        {label && (required && <span className="required text-red-400">*</span>)}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={`text-field-input ${error ? "error" : ""} ${className}`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default ReuseTextField;
