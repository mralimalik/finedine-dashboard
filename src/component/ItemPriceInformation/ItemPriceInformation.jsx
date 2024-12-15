import React, { useContext } from "react";
import ReuseItemCalorieField from "../ReuseItemCalorieTextField/ReuseItemCalorieField.jsx";
import ReuseTextField from "../ReuseTextField/ReuseTextField.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";

const ItemPriceInformation = () => {
  const { price, setPriceCalorie } = useContext(MenuContext);

  // Handle input change for price, name, or calories
  const handleInputChange = (index, field, value) => {
    const updatedPrice = [...price]; // Create a copy of the price array
    updatedPrice[index] = {
      ...updatedPrice[index],
      [field]: value, // Update the specific field (name, price, or calories)
    };
    setPriceCalorie(updatedPrice); // Update the state with the new array
  };

  // Handle adding a new price option
  const handleAddPrice = () => {
    const newPrice = { name: "", price: 0, calories: 0 };
    setPriceCalorie([...price, newPrice]);
  };

  // Handle deleting a price option
  const handleDeletePrice = (index) => {
    const updatedPrice = price.filter((_, idx) => idx !== index); // Remove item at the specified index
    setPriceCalorie(updatedPrice);
  };
  
  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">
        Items can have price options according to their sizes, servings etc. If
        the item has one price option, you can leave the name blank.
      </p>

      <table>
        <thead className="text-left text-sm">
          <tr>
            <th className="font-light">Name</th>
            <th className="px-3 font-light">Price</th>
            <th className="font-light">Calorie</th>
          </tr>
        </thead>
        <tbody>
          {price &&
            price.map((itemPrice, index) => (
              <tr key={index}>
                <td>
                  <ReuseTextField
                    className={"w-24"}
                    value={itemPrice.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <ReuseTextField
                    className={"w-24"}
                    value={itemPrice.price}
                    onChange={(e) =>
                      handleInputChange(index, "price", e.target.value)
                    } // Update price
                  />
                </td>
                <td>
                  <ReuseTextField
                    className={"w-24"}
                    value={itemPrice.calories}
                    onChange={(e) =>
                      handleInputChange(index, "calories", e.target.value)
                    } // Update calories
                  />
                </td>
                <td
                  onClick={() => {
                    handleDeletePrice(index);
                  }}
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
    </div>
  );
};

export default ItemPriceInformation;
