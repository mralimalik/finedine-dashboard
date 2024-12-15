import React, { useState, useContext, useEffect } from "react";
import "./ModifierGroupTable.css";
import { ModifierContext } from "../../context/ModifierContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
const ModifierGroupTable = () => {
  const { allModifierData, setModifierData, fetchModifiersByVenue } =
    useContext(ModifierContext);
  const { selectedVenue } = useContext(AuthContext);

  const [selectedRows, setSelectedRows] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  // Handle edit button click
  const handleEdit = (id) => {
    console.log("Edit item with id:", id);
    // Implement edit functionality here
  };

  //   // Handle delete button click
  //   const handleDelete = (id) => {
  //     setModifierData((prevModifierData) =>
  //       prevModifierData.filter((row) => row._id !== id)
  //     );
  //   };

  // Handle delete button click
  const handleDelete = async () => {
    try {
    

      const token = localStorage.getItem("Token");
      const response = await axios.post(
        "http://localhost:3000/modifier/delete",
      { modifierIds: selectedRows },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        setModifierData((prevModifierData) =>
          prevModifierData.filter((row) => !selectedRows.includes(row._id))
        );
        setSelectedRows([]);
        alert("Modifiers deleted successfully");
      } else {
        alert("Error deleting modifiers");
      }
    } catch (error) {
      console.error("Error deleting modifiers:", error);
      alert("Error deleting modifiers");
    }
  };
  useEffect(() => {
    if (selectedVenue) {
      fetchModifiersByVenue(selectedVenue._id);
    }
  }, [selectedVenue]);

  return (
    <div className="table-container">
      {selectedRows.length !==0 && (
        <div className="flex justify-end">
          <button className="create-menu-button" onClick={handleDelete}>
            {"Delete"}
          </button>
        </div>
      )}
     {allModifierData.length !==0 && (
         <table className="modifier-table">
         <thead>
           <tr>
             <th className="checkbox-cell">
               <input
                 type="checkbox"
                 onChange={(e) => {
                   if (e.target.checked) {
                     setSelectedRows(allModifierData.map((row) => row._id));
                   } else {
                     setSelectedRows([]);
                   }
                 }}
                 checked={selectedRows.length === allModifierData.length}
               />
             </th>
             <th>Group Name</th>
             <th>Modifiers</th>
             <th>Items Used</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {allModifierData.map((modifier, index) => (
             <tr key={modifier._id}>
               <td className="checkbox-cell">
                 <input
                   type="checkbox"
                   checked={selectedRows.includes(modifier._id)}
                   onChange={() => handleCheckboxChange(modifier._id)}
                 />
               </td>
               <td>{modifier.groupName}</td>
 
               <td>
                 {modifier.modifierPrices
                   .slice(0, 3)
                   .map((price) => price.name)
                   .join(", ")}
               </td>
               <td>
                 <span className="purple-text">{modifier.itemsUsed} items</span>
               </td>
               <td className="edit-delete">
                 <button onClick={() => handleEdit(modifier._id)}>✏️</button>
                 {/* <button onClick={() => handleDelete(modifier._id)}>🗑️</button> */}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     )}
     {
        allModifierData.length===0 && (
            <div className="w-full h-52 flex items-center justify-center">No Modifier Added</div>

        )
     }
    </div>
  );
};

export default ModifierGroupTable;
