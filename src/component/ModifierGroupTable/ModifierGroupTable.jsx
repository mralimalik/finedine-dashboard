import React, { useState, useContext, useEffect } from "react";
import "./ModifierGroupTable.css";
import { ModifierContext } from "../../context/ModifierContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import { baseUrl } from "../../const/constants.js";
import { VenueContext } from "../../context/VenueContext.jsx";
import AddModifierGroupForm from "../AddModifierGroupForm/AddModifierGroupForm.jsx";
const ModifierGroupTable = () => {
  const { allModifierData, setModifierData, fetchModifiersByVenue } =
    useContext(ModifierContext);
  const { selectedVenue, setLoading } = useContext(AuthContext);
  // const { setLoading } = useContext(VenueContext);

  const [modifierEditData, setModifierEditData] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);

  const handleEdit = (id) => {
    const modifier = allModifierData.find((item) => item._id === id);
    setModifierEditData(modifier);
    setEditOpen(true);
  };

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

  //   // Handle delete button click
  //   const handleDelete = (id) => {
  //     setModifierData((prevModifierData) =>
  //       prevModifierData.filter((row) => row._id !== id)
  //     );
  //   };

  // Handle delete button click
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const response = await axios.post(
        `${baseUrl}/modifier/delete`,
        { modifierIds: selectedRows },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleFetchModifiers = async () => {
    try {
      setLoading(true);
      await fetchModifiersByVenue(selectedVenue._id);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedVenue) {
      handleFetchModifiers();
    }
  }, [selectedVenue]);

  return (
    <div className="table-container">
      {selectedRows.length !== 0 && (
        <div className="flex justify-end">
          <button className="create-menu-button" onClick={handleDelete}>
            {"Delete"}
          </button>
        </div>
      )}
      {allModifierData.length !== 0 && (
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
                <td className="text-center">
                  <span className="purple-text">
                    {modifier.itemsUsed || 0} items
                  </span>
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
      {allModifierData.length === 0 && (
        <div className="w-full h-52 flex items-center justify-center">
          No Modifier Added
        </div>
      )}
      {isEditOpen && (
        <AddModifierGroupForm
          onClose={() => setEditOpen(false)}
          initialData={modifierEditData}
        />
      )}
    </div>
  );
};

export default ModifierGroupTable;
