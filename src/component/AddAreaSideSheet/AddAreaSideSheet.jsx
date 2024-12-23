import React, { useState, useContext, useEffect } from "react";
import Select from "react-select"; // Import React-Select
import "./AddAreaSideSheet.css";
import { TableContext } from "../../context/TablesContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./ResponsiveAddAreaSheet.css";
const AddAreaSideSheet = () => {
  // for area name
  const [areaName, setAreaName] = useState("");
  // to assign tables
  const [assignTables, setAssignTables] = useState([]);
  // show aviable table options
  const [tableOptions, setTableOptions] = useState([]);

  const { isAreaSheetOpen, toggleAreaSideSheet, createArea, areas } =
    useContext(TableContext);
  const { selectedVenue, setLoading } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const assignedTableValues = assignTables.map((table) => table.value);
      await createArea(areaName, selectedVenue._id, assignedTableValues);
      toggleAreaSideSheet();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (areas?.length > 0) {
      const options = areas.map((area) => ({
        label: area.areaName,
        options: area.tables.map((table) => ({
          value: table._id, // Unique table ID
          label: table.tableName, // Table name
        })),
      }));
      setTableOptions(options);
    }
  }, [areas]);

  return (
    <div>
      {/* Side Sheet */}
      {isAreaSheetOpen && (
        <div className="side-sheet-backdrop">
          <div className="side-sheet">
            {/* Header */}
            <div className="side-sheet-header">
              <h3>Add New Area</h3>
              <button onClick={toggleAreaSideSheet}>&times;</button>
            </div>

            {/* Form */}
            <div className="form-content">
              {/* Area Name Input */}
              <div className="form-group">
                <label className="form-label">Area Name</label>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Area Name"
                  className="form-input"
                />
              </div>

              {/* Assign Tables Input */}
              <div className="form-group">
                <label className="form-label">Assign Tables (optional)</label>
                <Select
                  isMulti
                  value={assignTables}
                  onChange={(selected) => setAssignTables(selected)}
                  options={tableOptions}
                  placeholder="Select tables..."
                  className="form-select"
                  classNamePrefix="select"
                />
              </div>

              {/* Footer Buttons */}
              <div className="side-sheet-footer">
                <button onClick={toggleAreaSideSheet} className="btn-cancel">
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleSubmit}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAreaSideSheet;
