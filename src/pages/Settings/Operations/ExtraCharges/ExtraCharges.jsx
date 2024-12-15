import React, { useContext, useState, useEffect } from "react";
import SwitchButton from "../../../../component/SwitchButton/SwitchButton.jsx";
import ReuseTextField from "../../../../component/ReuseTextField/ReuseTextField.jsx";
import { VenueContext } from "../../../../context/VenueContext.jsx";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext.jsx";
const ExtraCharges = () => {
  // Separate state for each type
  const [discountList, setDiscountList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [taxesList, setTaxesList] = useState([]);

  const [removeCharges, setRemoveCharges] = useState([]);

  const { selectedVenue } = useContext(AuthContext);

  // Generic function to add a new charge to a specific list
  const handleAdd = (type) => {
    const newItem = {
      name: "",
      amount: 0,
      amountType: "PERCENT",
      isActive: false,
      chargesType: type,
    };

    if (type === "DISCOUNT") {
      setDiscountList((prev) => [...prev, newItem]);
    } else if (type === "SERVICE") {
      setServiceList((prev) => [...prev, newItem]);
    } else if (type === "TAXES") {
      setTaxesList((prev) => [...prev, newItem]);
    }
  };

  //   // Handle input changes for specific fields
  //   const handleInputChange = (index, field, value, type) => {
  //     if (type === "DISCOUNT") {
  //       const updatedList = [...discountList];
  //       updatedList[index][field] = value;
  //       setDiscountList(updatedList);
  //     } else if (type === "SERVICE") {
  //       const updatedList = [...serviceList];
  //       updatedList[index][field] = value;
  //       setServiceList(updatedList);
  //     } else if (type === "TAXES") {
  //       const updatedList = [...taxesList];
  //       updatedList[index][field] = value;
  //       setTaxesList(updatedList);
  //     }
  //   };
  // Handle input changes for specific fields
  const handleInputChange = (index, field, value, type) => {
    if (field === "isActive" && value === true) {
      // Reset all items in the category to isActive = false
      if (type === "DISCOUNT") {
        setDiscountList((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, [field]: true }
              : { ...item, [field]: false }
          )
        );
      } else if (type === "SERVICE") {
        setServiceList((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, [field]: true }
              : { ...item, [field]: false }
          )
        );
      } else if (type === "TAXES") {
        setTaxesList((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, [field]: true }
              : { ...item, [field]: false }
          )
        );
      }
    } else {
      // For other fields, simply update the specific field value
      if (type === "DISCOUNT") {
        const updatedList = [...discountList];
        updatedList[index][field] = value;
        setDiscountList(updatedList);
      } else if (type === "SERVICE") {
        const updatedList = [...serviceList];
        updatedList[index][field] = value;
        setServiceList(updatedList);
      } else if (type === "TAXES") {
        const updatedList = [...taxesList];
        updatedList[index][field] = value;
        setTaxesList(updatedList);
      }
    }
  };

  // Handle removing a charge
  const handleRemove = (index, type) => {
    let removedItem = null;

    if (type === "DISCOUNT") {
      removedItem = discountList[index];
      const updatedList = discountList.filter((_, idx) => idx !== index);
      setDiscountList(updatedList);
    } else if (type === "SERVICE") {
      removedItem = serviceList[index];
      const updatedList = serviceList.filter((_, idx) => idx !== index);
      setServiceList(updatedList);
    } else if (type === "TAXES") {
      removedItem = taxesList[index];
      const updatedList = taxesList.filter((_, idx) => idx !== index);
      setTaxesList(updatedList);
    }

    // If there was a charge removed and it contains _id, add it to charges with deleteCharge: true
    if (removedItem && removedItem._id) {
      const updatedCharges = [...removeCharges, { ...removedItem._id }];
      setRemoveCharges(updatedCharges);
    }
  };

  const handleSave = async () => {
    console.log("starting");

    const token = localStorage.getItem("Token");
    const venueId = selectedVenue._id;

    // Check if removeCharges is not empty
    if (removeCharges.length > 0) {
      try {
        // Send the request with the correct field name in the request body
        const response = await axios.post(
          "http://localhost:3000/venue/delete/extraCharges",
          { ids: removeCharges },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRemoveCharges([]);
        // You can handle the response here if needed
        console.log(response.data);
      } catch (error) {
        // Handle any errors here
        console.error("Error deleting extra charges:", error);
      }
    }
    console.log("after remvoe");
    try {
      const charges = [...discountList, ...serviceList, ...taxesList];
      // Send the request with the correct field name in the request body
      const response = await axios.post(
        `http://localhost:3000/venue/extraCharges/${venueId}`,
        { charges },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      setDataInVariables(data);

      console.log("tehns toe remvoe");
    } catch (e) {
      console.log("error", e);
    }
  };

  const getAllChargesData = async () => {
    const venueId = selectedVenue._id;
    const response = await axios.get(
      `http://localhost:3000/venue/extraCharges/${venueId}`
    );
    const data = response.data.data;

    setDataInVariables(data);
  };

  const setDataInVariables = (data)=>{
   // Filter and separate the data based on chargesType
  const discountItems = data.filter(item => item.chargesType === 'DISCOUNT');
  const serviceItems = data.filter(item => item.chargesType === 'SERVICE');
  const taxesItems = data.filter(item => item.chargesType === 'TAXES');

  // Update the state lists with the filtered data
  setDiscountList(discountItems);
  setServiceList(serviceItems);
  setTaxesList(taxesItems);  
  }

  useEffect(() => {
    getAllChargesData();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-md w-[500px] p-4 h-full ">
      {/* Discount Section */}
      <section className="pb-10 pt-2 border-b">
        <h3 className="text-lg font-medium mb-4">Discount</h3>
        <ChargesList
          label="Discount"
          chargeData={discountList}
          onInputChange={(index, field, value) =>
            handleInputChange(index, field, value, "DISCOUNT")
          }
          onRemove={handleRemove}
          type="DISCOUNT"
        />
        <button className="mt-5" onClick={() => handleAdd("DISCOUNT")}>
          <h4 className="text-sm text-violet-600 font-medium">
            + Add Discount
          </h4>
        </button>
      </section>

      {/* Service Charges Section */}
      <section className="pb-10 pt-2 border-b">
        <h3 className="text-lg font-medium mb-4">Service Charges</h3>
        <ChargesList
          label="Service Charges"
          chargeData={serviceList}
          onInputChange={(index, field, value) =>
            handleInputChange(index, field, value, "SERVICE")
          }
          onRemove={handleRemove}
          type="SERVICE"
        />
        <button className="mt-5" onClick={() => handleAdd("SERVICE")}>
          <h4 className="text-sm text-violet-600 font-medium">
            + Add Service Charges
          </h4>
        </button>
      </section>

      {/* Taxes Section */}
      <section className="pb-10 pt-2">
        <h3 className="text-lg font-medium mb-4">Taxes</h3>
        <ChargesList
          label="Taxes"
          chargeData={taxesList}
          onInputChange={(index, field, value) =>
            handleInputChange(index, field, value, "TAXES")
          }
          onRemove={handleRemove}
          type="TAXES"
        />
        <button className="mt-5" onClick={() => handleAdd("TAXES")}>
          <h4 className="text-sm text-violet-600 font-medium">+ Add Tax</h4>
        </button>
      </section>
      <button
        className="bg-violet-500 px-4 py-1 rounded-lg text-white w-fit"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ExtraCharges;

export const ChargesList = ({ chargeData, onInputChange, onRemove, type }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left text-sm font-medium border-b py-2">Name</th>
          <th className="text-left text-sm font-medium border-b py-2 px-5">
            Rate
          </th>
        </tr>
      </thead>
      <tbody>
        {chargeData.map((charge, index) => (
          <tr key={index}>
            <td className="py-4">
              <input
                type="text"
                value={charge.name}
                onChange={(e) => onInputChange(index, "name", e.target.value)}
                className="outline-none border rounded-md px-2 focus:border-violet-600 text-sm py-1 w-full"
              />
            </td>
            <td className="px-5">
              <RateInput
                selectedRateType={charge.amountType}
                amount={charge.amount}
                onRateTypeChange={(value) =>
                  onInputChange(index, "amountType", value)
                }
                onAmountChange={(value) =>
                  onInputChange(index, "amount", Number(value))
                }
              />
            </td>
            <td>
              <SwitchButton
                isActive={charge.isActive}
                onToggle={() =>
                  onInputChange(index, "isActive", !charge.isActive)
                }
              />
            </td>
            <td>
              <p
                className="text-sm cursor-pointer "
                onClick={() => onRemove(index, type)} // Call onRemove with type
              >
                Remove
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export function RateInput({
  selectedRateType,
  amount,
  onRateTypeChange,
  onAmountChange,
}) {
  const handleOptionChange = (e) => {
    onRateTypeChange(e.target.value);
  };

  const handleInputChange = (e) => {
    onAmountChange(e.target.value);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      {/* Dropdown */}
      <select
        value={selectedRateType}
        onChange={handleOptionChange}
        className="px-2 py-1 text-sm bg-transparent outline-none cursor-pointer border"
      >
        <option value="PERCENT">%</option>
        <option value="NUMBER">$</option>
      </select>

      {/* Input */}
      <input
        type="number"
        value={amount}
        onChange={handleInputChange}
        className="flex-1 px-2 py-1 text-sm text-left outline-none w-12"
      />
    </div>
  );
}
