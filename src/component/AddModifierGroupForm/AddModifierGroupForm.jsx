import React, { useContext, useState, useEffect } from "react";
import ReuseTextField from "../ReuseTextField/ReuseTextField";
import ReuseItemPriceTextField from "../ReuseItemPriceTextField/ReuseItemPriceTextField";
import { MenuContext } from "../../context/MenuContext";
import ReuseItemCalorieField from "../ReuseItemCalorieTextField/ReuseItemCalorieField";
import "./AddModifierGroupForm.css";
import { ModifierContext } from "../../context/ModifierContext";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { baseUrl } from "../../const/constants.js";
import { VenueContext } from "../../context/VenueContext.jsx";

import { toast } from "react-toastify";

const AddModifierGroupForm = ({ onClose, initialData = null }) => {
  const [modifierGroupName, setGroupName] = useState("");

  const {
    modifierPrices,
    setModifierPriceCalorie,
    allModifierData,
    setModifierData,
  } = useContext(ModifierContext);

  const { selectedVenue, setLoading } = useContext(AuthContext);

  const handleInputChange = (index, field, value) => {
    const updatedPrice = [...modifierPrices];

    // Validate price and calorie inputs to be numbers only
    if (field === "price" || field === "calories") {
      // Check if value is a valid number
      if (isNaN(value) || value === "") {
        value = 0; // Set to 0 if invalid or empty
      } else {
        value = Number(value); // Convert to number
      }
    }

    updatedPrice[index] = {
      ...updatedPrice[index],
      [field]: value,
    };

    setModifierPriceCalorie(updatedPrice);
  };

  // Handle adding a new price option
  const handleAddPrice = () => {
    const newPrice = { name: "", price: 0, calories: 0 };
    setModifierPriceCalorie([...modifierPrices, newPrice]);
  };

  // Handle deleting a price option
  const handleDeletePrice = (index) => {
    const updatedPrice = modifierPrices.filter((_, idx) => idx !== index); 
    setModifierPriceCalorie(updatedPrice);
  };

  // Submit the form data to the backend
  const handleCreateModifierSubmit = async (e) => {
    e.preventDefault();
    const venueId = selectedVenue._id;
    const token = localStorage.getItem("Token");

    if (!modifierGroupName || modifierPrices.length === 0) {
      alert("Please provide a group name and at least one modifier price.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/modifier/${venueId}`,
        {
          groupName: modifierGroupName,
          modifierPrices: modifierPrices,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Modifier Group added successfully:", response.data.data);
        setModifierData((prevState) => [...prevState, response.data.data]);
        toast.success(`${modifierGroupName} modifier added successfully`);
        onClose();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error adding modifier group:", error);
      alert("Failed to add modifier group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit the form data to the backend
  const handleUpdateModifier = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("Token");

    if (!modifierGroupName || modifierPrices.length === 0) {
      toast.error(
        "Please provide a group name and at least one modifier price."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${baseUrl}/modifier/update/${initialData._id}`,
        {
          groupName: modifierGroupName,
          modifierPrices: modifierPrices,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Modifier Group added successfully:", response.data.data);

        // Update the local list
        setModifierData((prevState) =>
          prevState.map((modifier) =>
            modifier._id === initialData._id
              ? { ...modifier, ...response.data.data }
              : modifier
          )
        );
        toast.success(`${modifierGroupName} modifier updated successfully`);
        onClose();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error updating modifier group:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setGroupName(initialData.groupName);
      setModifierPriceCalorie(initialData.modifierPrices);
    } else {
      setModifierPriceCalorie([
        {
          name: "",
          price: 0,
          calories: 0,
        },
      ]);
    }
  }, [initialData]);
  return (
    <div className="h-full w-full bg-black/50  fixed top-0 left-0 flex justify-center items-center">
      <div className="bg-white py-5 shadow-sm rounded-md main-dialog mx-3">
        <header className="border-b px-5">
          <h3 className="font-semibold font-sans">Add Modifier Group</h3>
        </header>
        <main className="px-5 my-4 table-model">
          <ReuseTextField
            label={"Group Name"}
            name={"groupName"}
            required={true}
            value={modifierGroupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <h2 className="text-sm my-3">Modifiers</h2>
          <table>
            <thead className="text-left text-sm">
              <tr>
                <th className="font-light">Name</th>
                <th className="px-3 font-light">Price</th>
                <th className="font-light">Calorie</th>
              </tr>
            </thead>
            <tbody>
              {modifierPrices &&
                modifierPrices.map((itemPrice, index) => (
                  <tr key={index}>
                    <td>
                      <ReuseTextField
                        className={"w-40"}
                        value={itemPrice.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-3">
                      <ReuseItemPriceTextField
                        showLabel={false}
                        value={itemPrice.price}
                        onChange={
                          (e) => handleInputChange(index, "price", e) // Handled here
                        }
                      />
                    </td>
                    <td>
                      <ReuseItemCalorieField
                        label={""}
                        value={itemPrice.calories}
                        onChange={(e) =>
                          handleInputChange(index, "calories", e)
                        } // Update calories
                      />
                    </td>
                    <td
                      onClick={() => {
                        handleDeletePrice(index);
                      }}
                      className="cursor-pointer"
                    >
                      🗑️
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <label className="text-violet-400 text-sm" onClick={handleAddPrice}>
            + Add another price
          </label>
        </main>
        <div className="item-buttons">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="add-button"
            onClick={(e) => {
              initialData === null
                ? handleCreateModifierSubmit(e)
                : handleUpdateModifier(e);
            }}
          >
            {initialData === null ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModifierGroupForm;
