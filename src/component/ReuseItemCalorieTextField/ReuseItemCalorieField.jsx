import React from "react";

const ReuseItemCalorieField = ({ value, onChange , label }) => {
  return (
    <div>
      <label>{label}</label>
      <div className="w-32 border rounded-md flex  overflow-hidden">
        <input
          className="outline-none border-none pl-3 w-full"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="dollar-sign bg-gray-400 border px-3 rounded-r-md">
          cal
        </div>
      </div>
    </div>
  );
};

export default ReuseItemCalorieField;
