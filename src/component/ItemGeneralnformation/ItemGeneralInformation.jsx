import React, { useState, useContext, useEffect } from "react";
import "./ItemGeneralInformation.css";
import ReuseTextField from "../ReuseTextField/ReuseTextField.jsx";
import RichTextEditor from "../RichTextEditor/RichTextEditor.jsx";
import Select from "react-select";
import ReuseItemPriceTextField from "../ReuseItemPriceTextField/ReuseItemPriceTextField.jsx";
import ReuseItemCalorieField from "../ReuseItemCalorieTextField/ReuseItemCalorieField.jsx";
import SwitchButton from "../SwitchButton/SwitchButton.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

const ItemGeneralInformation = () => {
  const {
    menuData,
    price,
    setPriceCalorie,
    setEditItemData,
    editItemData,
    sectionParentId,
    itemName,
    setName,
    description,
    setDescription,
    itemImage,
    setItemImage,
    createItem,
    setSectionParentId,
    clearItemFields,
    assignItemDataToVariables,
    isSoldOut,
    setIsSoldOut,
  } = useContext(MenuContext);

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);

  // Dropdown options
  const labelOptions = [
    { value: "New", label: "New" },
    { value: "Special", label: "Special" },
    { value: "Signature", label: "Signature" },
    { value: "Popular", label: "Popular" },
    { value: "Limited Items", label: "Limited Items" },
  ];

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLabelsChange = (selectedOptions) => {
    setSelectedLabels(selectedOptions);
  };

  const handleToggleSoldOut = () => {
    setIsSoldOut((prev) => !prev);
  };

  // Handle price changes
  const handlePriceChange = (newPrice) => {
    setPriceCalorie((prevState) => [
      { ...prevState[0], price: parseFloat(newPrice) || 0 },
    ]);
  };

  // Handle calorie changes
  const handleCaloriesChange = (newCalories) => {
    setPriceCalorie((prevState) => [
      { ...prevState[0], calories: parseFloat(newCalories) || 0 },
    ]);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,

      borderRadius: "10px", // Adjust border radius
      borderColor: state.isFocused ? "#7c3aed" : "#e2e8f0", // Violet on focus
      boxShadow: state.isFocused ? "0 0 0 2px rgba(124, 58, 237, 0.3)" : "none",
      "&:hover": {
        borderColor: "#7c3aed",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0px 8px", // Reduce extra padding around the text
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: "5px", // Border radius for selected options
      backgroundColor: "#f3f4f6", // Light gray background for selected items
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#4b5563", // Darker text for label
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#7c3aed",
      ":hover": {
        backgroundColor: "#7c3aed",
        color: "white",
      },
    }),
  };

  const initializeSectionDropdownOptions = (menuData) => {
    if (menuData && menuData.length > 0) {
      const extractSections = (sections) => {
        const options = [];
        sections.forEach((section) => {
          if (section.type === "SECTION" && section._id !== editItemData?._id) {
            options.push({
              value: section._id,
              label: section.sectionName,
            });

            if (section.subSections && section.subSections.length > 0) {
              options.push(...extractSections(section.subSections));
            }
          }
        });
        return options;
      };
      const filteredOptions = extractSections(menuData);
      setSectionDropdown(filteredOptions);
    }
  };

  // const createItem = async () => {
  //   const apiUrl = `http://localhost:3000/menu/menuitem/${menuId}`;
  //   const venueId = selectedVenue._id;
  //   const token = localStorage.getItem("Token");
  //   try {
  //     // Create FormData object
  //     const data = new FormData();
  //     data.append("itemName",itemName);
  //     data.append("venueId", venueId);
  //     if (sectionParentId) data.append("parentId", sectionParentId);
  //     data.append("itemImage", itemImage);
  //     data.append("price", price);
  //     if(description)
  //     data.append("description", description);

  //     // Send the POST request
  //     const response = await axios.post(apiUrl, data, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("API Response:", response.data.data);
  //   } catch (error) {
  //     console.error("Error creating item:", error.response || error.message);
  //   } finally {
  //   }
  // };
  // handle section change
  const handleParentChange = (selectedOption) => {
    setSectionParentId(selectedOption ? selectedOption.value : null);
  };
  // useEffect(() => {
  //   if (editItemData) {
  //     assignItemDataToVariables(editItemData);
  //   } 
  //   else {
  //     clearItemFields();
  //   }
  // }, [editItemData]);

  useEffect(() => {
    initializeSectionDropdownOptions(menuData);
  }, [menuData, editItemData]);

  return (
    <div className="flex flex-col">
      <ReuseTextField
        label="Name"
        name="itemName"
        required={true}
        placeholder="Enter item name"
        value={itemName}
        onChange={handleNameChange}
      />
      <RichTextEditor
        description={description}
        setDescription={setDescription}
      />

      {/* {Add  Image} */}
      <div className="item-image-div my-2">
        <label className="text-xm">Image</label>
        <div
          className="image-picker-div h-28 w-44  bg-violet-400 rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
          onClick={() => document.getElementById("itemImage").click()}
        >
          <input
            className="hidden"
            type="file"
            id="itemImage"
            onChange={handleImageChange}
          />
          {!itemImage && <h2>Pick Image</h2>}
          {/* {itemImage && (
            <img
              src={URL.createObjectURL(itemImage)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )} */}
             {itemImage ? (
              itemImage instanceof File ? (
                <img
                  src={URL.createObjectURL(itemImage)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={itemImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : null}
        </div>
      </div>

      {/* {Item Price} */}
      <div className="flex gap-3">
        <ReuseItemPriceTextField
          value={price.length > 0 ? price[0].price : 0}
          onChange={handlePriceChange}
        />
        <ReuseItemCalorieField
          value={price.length > 0 ? price[0].calories : 0}
          onChange={handleCaloriesChange}
          label={"Calories"}
        />
      </div>
      {/* {Marked as sold} */}
      <div className="flex justify-between my-2">
        <label>Marked as Sold Out</label>
        <SwitchButton isActive={isSoldOut} onToggle={handleToggleSoldOut} />
      </div>
      {/* {Lables} */}
      <div className="item-lables my-2">
        <label className="item-label">Lables</label>
        <Select
          isMulti
          options={labelOptions}
          placeholder="Select labels"
          className="label-select text-sm"
          classNamePrefix="select"
          value={selectedLabels}
          onChange={handleLabelsChange}
          styles={customStyles}
        />
      </div>
      <div className="my-2">
        <label className="text-base">Section</label>
        <Select
          onChange={handleParentChange}
          value={
            sectionDropdown.find(
              (option) => option.value === sectionParentId
            ) || null
          }
          placeholder="Select section"
          className="label-select text-sm"
          classNamePrefix="select"
          styles={customStyles}
          options={sectionDropdown}
        />
      </div>
    </div>
  );
};

export default ItemGeneralInformation;
