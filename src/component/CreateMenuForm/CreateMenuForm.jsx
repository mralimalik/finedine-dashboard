import { useState, useContext } from "react";
import "./CreateMenuForm.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MenuContext } from "../../context/MenuContext";
const CreateMenuForm = ({ isOpen, onClose }) => {
  const { venueId } = useParams();
  const { setMenuItems } = useContext(MenuContext);
  const [selectedOption, setSelectedOption] = useState(null);


  const menuOptions = [
    { title: "Start From Scratch", des: "Start with an empty menu" },
    { title: "Create a sample menu", des: "Start with a pre build menu" },
  ];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const createMenuWithoutItem = async () => {
    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      const response = await axios.post(
        `http://localhost:3000/menu/emptyMenu/${venueId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle the response after successfully creating a venue
      if (response.data?.data) {
        console.log("Menu created successfully:", response.data.data);
        setMenuItems((prev) => [...(prev || []), response.data.data]);
        onClose();
      }
    } catch (err) {
      console.log("Error creating menu with no item:", err);
    }
  };
  const createSampleMenuWithItem = async () => {
    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      const response = await axios.post(
        `http://localhost:3000/menu/sampleMenu/${venueId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle the response after successfully creating a venue
      if (response.data?.data) {
        console.log("Menu created successfully:", response.data.data);
        setMenuItems((prev) => [...(prev || []), response.data.data]);
        onClose();
      }
    } catch (err) {
      console.log("Error creating menu with no item:", err);
    }
  };

  const handleContinueTap = async () => {
    if (selectedOption === 0) {
      await createMenuWithoutItem();
    } else if (selectedOption === 1) {
      await createSampleMenuWithItem();
    }
  };
  return (
    <div className="modal-overlay">
      <div className="menu-modal-container">
        <div className="menu-modal-header">
          <h2>How would you like to setup your menu?</h2>
          <h3>Let’s set up your menu, remember you can manage it anytime.</h3>
        </div>

        <div className="menu-list-divs">
          {menuOptions.map((item, index) => (
            <div
              key={index}
              className={`menu-option-div ${selectedOption === index ? "menu-option-div-selected" : ""}`}
              onClick={() => {
                handleOptionClick(index);
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.des}</p>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="add-button" onClick={handleContinueTap}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuForm;
