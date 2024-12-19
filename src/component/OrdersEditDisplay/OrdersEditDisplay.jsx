import React, { useState, useRef, useEffect } from "react";
import "./OrdersEditDisplay.css";

const OrdersEditDisplay = ({setCheckedItems,checkedItems}) => {
  // for menu ref
  const menuRef = useRef(null);
  // to toggle menu opne
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // to handle checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems({ ...checkedItems, [name]: checked });
  };

  // handle when clicking outside the menu
  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <div className="menu-container" ref={menuRef}>
      {/* Button to toggle the menu */}
      <div className="edit-display-button" onClick={toggleMenu}>
        Edit Display ▾
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <p className="menu-title">Displayed Items on Table</p>
          <div className="menu-items">
            {Object.keys(checkedItems).map((key) => (
              <label key={key} className="menu-item">
                <input
                  type="checkbox"
                  name={key}
                  checked={checkedItems[key]}
                  onChange={handleCheckboxChange}
                />
                {key.replace(/([A-Z])/g, " $1").trim()} {/* Formatting */}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersEditDisplay;
