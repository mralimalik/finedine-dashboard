import React, { useState, useContext } from "react";
import "./AddTableSheet.css";
import { TableContext } from "../../context/TablesContext";
import { AuthContext } from "../../context/AuthContext";

const AddTableSheet = () => {






  const [tableBoxes, setTableBoxes] = useState([
    {
      tableName: "",
      numberOfTables: 1,
      startingFrom: 1,
      minSeats: 1,
      maxSeats: 5,
      onlineTableReservation: true,
      areaId: "",
      errors: {},
    },
  ]);
  const [mode, setMode] = useState("custom");
  const { areas, createAutomaticTables, createCustomTables,toggleAddTableSheet,openTableAddSheet } = useContext(TableContext);
  const { selectedVenue } = useContext(AuthContext);

  const handleAddTableBox = () => {
    if (mode === "custom") {
      setTableBoxes([
        ...tableBoxes,
        {
          tableName: "",
          numberOfTables: 1,
          startingFrom: 1,
          minSeats: 1,
          maxSeats: 5,
          onlineTableReservation: true,
          areaId: "",
          errors: {},
        },
      ]);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedTableBoxes = [...tableBoxes];
    updatedTableBoxes[index][field] =
      field === "numberOfTables" || field === "startingFrom" || field === "minSeats" || field === "maxSeats"
        ? value
          ? parseInt(value)
          : 0
        : value;
    updatedTableBoxes[index].errors = {}; // Reset errors on change
    setTableBoxes(updatedTableBoxes);
  };

  const handleReservationChange = (index, checked) => {
    const updatedTableBoxes = [...tableBoxes];
    updatedTableBoxes[index].onlineTableReservation = checked;
    updatedTableBoxes[index].errors = {}; // Reset errors on change
    setTableBoxes(updatedTableBoxes);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "automatic") {
      setTableBoxes([
        {
          tableName: "",
          numberOfTables: 1,
          startingFrom: 1,
          minSeats: 1,
          maxSeats: 5,
          onlineTableReservation: true,
          areaId: "",
          errors: {},
        },
      ]);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const updatedTableBoxes = tableBoxes.map((table) => {
      const errors = {};

      if (!table.tableName.trim()) errors.tableName = "Table name is required.";
      if (!table.areaId) errors.areaId = "Area must be selected.";
      if (table.minSeats && table.maxSeats && table.minSeats >= table.maxSeats) {
        errors.minSeats = "Min seats must be less than max seats.";
        errors.maxSeats = "Max seats must be greater than min seats.";
      }

      if (table.numberOfTables <= 0) errors.numberOfTables = "Number of tables must be greater than 0.";
      if (table.startingFrom <= 0) errors.startingFrom = "Starting from must be greater than 0.";
      if (table.minSeats <= 0) errors.minSeats = "Min seats must be greater than 0.";
      if (table.maxSeats <= 0) errors.maxSeats = "Max seats must be greater than 0.";

      if (Object.keys(errors).length > 0) isValid = false;
      return { ...table, errors };
    });

    setTableBoxes(updatedTableBoxes);
    return isValid;
  };

  const handleAutomaticCreate = () => {
    if (!validateFields()) return; // Stop if validation fails

    const tableData = {
      tableName: tableBoxes[0].tableName,
      venueId: selectedVenue._id,
      areaId: tableBoxes[0].areaId,
      onlineTableReservation: tableBoxes[0].onlineTableReservation,
      minSeats: tableBoxes[0].minSeats,
      maxSeats: tableBoxes[0].maxSeats,
      startingFrom: tableBoxes[0].startingFrom,
      numberOfTables: tableBoxes[0].numberOfTables,
    };

    createAutomaticTables(tableData);
  };

  const handleCustomCreate = () => {
    if (!validateFields()) return; // Stop if validation fails

    const tableData = tableBoxes.map((table) => ({
      tableName: table.tableName,
      venueId: selectedVenue._id,
      areaId: table.areaId,
      onlineTableReservation: table.onlineTableReservation,
      minSeats: table.minSeats,
      maxSeats: table.maxSeats,
    }));

    createCustomTables({ tables: tableData });
  };

  if(!openTableAddSheet){
    return null;
  }

  return (
    <div className="table-sheet-backdrop">
      <div className="table-side-sheet">
        <div className="table-side-sheet-data">
          <div className="side-sheet-header">
            <h3>Add New Table</h3>
            <button onClick={toggleAddTableSheet}>&times;</button>
          </div>
          <div className="table-sheet-checkbox">
            <div>
              <input
                type="radio"
                checked={mode === "automatic"}
                onChange={() => handleModeChange("automatic")}
              />
              <label>Automatic Table Name</label>
            </div>
            <div>
              <input type="radio" checked={mode === "custom"} onChange={() => handleModeChange("custom")} />
              <label>Custom Table Name</label>
            </div>
          </div>
          {tableBoxes.map((table, index) => (
            <div className="table-sheet-add-box" key={index}>
              <div className="table-sheet-title">
                <label className="form-label">Label</label>
                <input
                  type="text"
                  placeholder="Table Title"
                  className="form-input"
                  value={table.tableName}
                  onChange={(e) => handleInputChange(index, "tableName", e.target.value)}
                />
                {table.errors.tableName && <span className="error-text">{table.errors.tableName}</span>}
              </div>
              <div>
                <label className="form-label">Select Area</label>
                <select
                  className="form-input"
                  value={table.areaId}
                  onChange={(e) => handleInputChange(index, "areaId", e.target.value)}
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

              {mode === "automatic" && (
                <div className="table-info">
                  <div>
                    <label className="form-label">Number of Tables:</label>
                    <input
                      type="number"
                      className="form-input"
                      value={table.numberOfTables}
                      onChange={(e) => handleInputChange(index, "numberOfTables", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Starting From:</label>
                    <input
                      type="number"
                      className="form-input"
                      value={table.startingFrom}
                      onChange={(e) => handleInputChange(index, "startingFrom", e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="table-info">
                <div>
                  <label className="form-label">Min Seats:</label>
                  <input
                    type="number"
                    className="form-input"
                    value={table.minSeats}
                    onChange={(e) => handleInputChange(index, "minSeats", e.target.value)}
                  />
                  {table.errors.minSeats && <span className="error-text">{table.errors.minSeats}</span>}
                </div>
                <div>
                  <label className="form-label">Max Seats:</label>
                  <input
                    type="number"
                    className="form-input"
                    value={table.maxSeats}
                    onChange={(e) => handleInputChange(index, "maxSeats", e.target.value)}
                  />
                  {table.errors.maxSeats && <span className="error-text">{table.errors.maxSeats}</span>}
                </div>
              </div>

              <div className="form-group toggle-container py-3">
                <label className="toggle-label">Available in online reservation</label>
                <input
                  type="checkbox"
                  className="toggle-switch"
                  checked={table.onlineTableReservation}
                  onChange={(e) => handleReservationChange(index, e.target.checked)}
                />
              </div>
            </div>
          ))}
          {mode === "custom" && (
            <h3 className="text-violet-500 add-table-button" onClick={handleAddTableBox}>
              + Add Table
            </h3>
          )}
        </div>
        <div className="side-sheet-footer border-t py-3 side-sheet-button">
          <button className="btn-cancel" onClick={toggleAddTableSheet}>Cancel</button>
          <button
            className="btn-submit"
            onClick={() => {
              mode === "custom" ? handleCustomCreate() : handleAutomaticCreate();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTableSheet;
