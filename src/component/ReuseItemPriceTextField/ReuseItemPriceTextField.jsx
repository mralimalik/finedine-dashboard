import React from "react";

const ReuseItemPriceTextField = ({ value, onChange,showLabel =true }) => {
  return (
    <div>
    {
      showLabel&&(
      <label>Price</label>

      )
    }
      <div className="w-32 border rounded-md flex  overflow-hidden">
        <div className="dollar-sign bg-gray-400 border px-3 rounded-l-md">
          $
        </div>
        <input
          className="outline-none border-none pl-3 w-full"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default ReuseItemPriceTextField;
