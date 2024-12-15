import React, { useState, useContext, useEffect } from "react";
import "../AddTableSideSheet/AddTableSheet.css";
import { TableContext } from "../../context/TablesContext";
import QRCode from "qrcode"; // Import the QRCode component
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
const UpdateTableSheet = () => {
  const { setAreas, areas, toggleEditTableSheet, openTableEditSheet, tableToEdit } = useContext(TableContext);
  const { selectedVenue } = useContext(AuthContext);

  const [table, setTable] = useState({
    tableName: "",
    minSeats: 1,
    maxSeats: 5,
    onlineTableReservation: true,
    areaId: "",
    errors: {},
  });

  const [qrCodeUrl, setQrCodeUrl] = useState(""); // State to store QR code URL

  const handleInputChange = (field, value) => {
    setTable((prevTable) => ({
      ...prevTable,
      [field]: field === "minSeats" || field === "maxSeats" ? parseInt(value, 10) || "" : value,
      errors: { ...prevTable.errors, [field]: "" }, // Reset specific field error
    }));
  };

  const handleReservationChange = (checked) => {
    setTable((prevTable) => ({
      ...prevTable,
      onlineTableReservation: checked,
    }));
  };

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    if (!table.tableName.trim()) {
      errors.tableName = "Table name is required.";
      isValid = false;
    }

    if (!table.areaId) {
      errors.areaId = "Please select an area.";
      isValid = false;
    }

    if (table.minSeats <= 0) {
      errors.minSeats = "Min seats must be greater than 0.";
      isValid = false;
    }

    if (table.maxSeats <= 0) {
      errors.maxSeats = "Max seats must be greater than 0.";
      isValid = false;
    }

    if (table.minSeats >= table.maxSeats) {
      errors.minSeats = "Min seats must be less than max seats.";
      errors.maxSeats = "Max seats must be greater than min seats.";
      isValid = false;
    }

    setTable((prevTable) => ({
      ...prevTable,
      errors,
    }));

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        const token = localStorage.getItem("Token");
        // Prepare data to be sent in the request
        const tableData = {
          tableName: table.tableName,
          minSeats: table.minSeats,
          maxSeats: table.maxSeats,
          onlineTableReservation: table.onlineTableReservation,
          areaId: table.areaId,
        };

        console.log("running update table", tableToEdit._id, tableData.areaId);

        // API request to update the table
        const response = await axios.put(`http://localhost:3000/table/update/${tableToEdit._id}`, tableData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("after running update table");

        const newUpdatedTable = response.data.data;
        console.log("Table updated successfully:", response.data.data);
        updateAreasWithTable(newUpdatedTable);
        toggleEditTableSheet();
      } catch (error) {
        console.error("Error updating table:", error);
      }
    }
  };

  const updateAreasWithTable = (updatedTable) => {
    const updatedAreas = areas.map((area) => {
      if (area._id === updatedTable.areaId) {
        // If the area matches, update the table list for that area
        const updatedTables = area.tables.map((table) =>
          table._id === updatedTable._id ? updatedTable : table
        );
        return { ...area, tables: updatedTables }; // Return new area with updated tables
      }
      return area; // Return other areas unchanged
    });
  
    // If areaId changed, remove the table from the old area and add it to the new one
    if (tableToEdit.areaId !== updatedTable.areaId) {
      // Remove from old area
      const oldAreaIndex = updatedAreas.findIndex((area) => area._id === tableToEdit.areaId);
      if (oldAreaIndex !== -1) {
        updatedAreas[oldAreaIndex].tables = updatedAreas[oldAreaIndex].tables.filter(
          (table) => table._id !== updatedTable._id
        );
      }
  
      // Add to new area
      const newAreaIndex = updatedAreas.findIndex((area) => area._id === updatedTable.areaId);
      if (newAreaIndex !== -1) {
        updatedAreas[newAreaIndex].tables.push(updatedTable); // Add the table to the new area
      }
    }
  
    // Update the state with the modified areas
    setAreas(updatedAreas);
  };
  

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(
        `https://qr-menu-7ie2.vercel.app/${selectedVenue.venueId}?table=${tableToEdit._id}`,
        {
          color: {
            dark: "#8A2BE2", // Blue-Violet color for the QR code
            light: "#00000000", // Transparent background (RGBA: fully transparent)
          },
        }
      );
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleDownloadQrCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${table.tableName}_QRCode.png`;
    link.click();
  };

  useEffect(() => {
    if (tableToEdit) {
      console.log("tableToEdit.tableName", tableToEdit.tableName);
      setTable({
        tableName: tableToEdit.tableName || "",
        minSeats: tableToEdit.minSeats || 1,
        maxSeats: tableToEdit.maxSeats || 5,
        onlineTableReservation: tableToEdit.onlineTableReservation || true,
        areaId: tableToEdit.areaId || "",
        errors: {},
      });
      generateQRCode();
    }
  }, [tableToEdit]);

  if (!openTableEditSheet) return null;

  return (
    <div className="table-sheet-backdrop">
      <div className="table-side-sheet">
        <div className="table-side-sheet-data">
          <div className="side-sheet-header">
            <h3>Edit Table</h3>
            <button onClick={toggleEditTableSheet}>&times;</button>
          </div>

          <div className="table-sheet-add-box">
            <div className="qr-code-section">
              <h4>Dine-in QR Code</h4>
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
              <button
                onClick={handleDownloadQrCode}
                className="bg-violet-500 px-2 py-1 rounded-md my-2 text-white text-sm"
              >
                Download QR Code
              </button>
            </div>

            <div className="table-sheet-title">
              <label className="form-label">Table Name</label>
              <input
                type="text"
                placeholder="Enter table name"
                className="form-input"
                value={table.tableName}
                onChange={(e) => handleInputChange("tableName", e.target.value)}
              />
              {table.errors.tableName && <span className="error-text">{table.errors.tableName}</span>}
            </div>

            <div>
              <label className="form-label">Select Area</label>
              <select
                className="form-input"
                value={table.areaId}
                onChange={(e) => handleInputChange("areaId", e.target.value)}
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.areaName}
                  </option>
                ))}
              </select>
              {table.errors.areaId && <span className="error-text">{table.errors.areaId}</span>}
            </div>

            <div className="table-info">
              <div>
                <label className="form-label">Min Seats</label>
                <input
                  type="number"
                  className="form-input"
                  value={table.minSeats}
                  onChange={(e) => handleInputChange("minSeats", e.target.value)}
                />
                {table.errors.minSeats && <span className="error-text">{table.errors.minSeats}</span>}
              </div>

              <div>
                <label className="form-label">Max Seats</label>
                <input
                  type="number"
                  className="form-input"
                  value={table.maxSeats}
                  onChange={(e) => handleInputChange("maxSeats", e.target.value)}
                />
                {table.errors.maxSeats && <span className="error-text">{table.errors.maxSeats}</span>}
              </div>
            </div>

            <div className="form-group toggle-container py-3">
              <label className="toggle-label">Available for Online Reservation</label>
              <input
                type="checkbox"
                className="toggle-switch"
                checked={table.onlineTableReservation}
                onChange={(e) => handleReservationChange(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <div className="side-sheet-footer border-t py-3 side-sheet-button">
          <button className="btn-cancel" onClick={toggleEditTableSheet}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Update Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTableSheet;
