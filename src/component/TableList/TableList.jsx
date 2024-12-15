import React, { useState, useRef, useContext, useEffect } from "react";
import "./TableList.css";
import { TableContext } from "../../context/TablesContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const TableList = () => {
  const [expandedAreas, setExpandedAreas] = useState({}); // Manage expansion state per area
  const listRef = useRef(null);

  const {
    areas,
    fetchAreaWithTables,
    toggleAddTableSheet,
    selectedTables,
    setSelectedTables,
    handleTableSelection,
    toggleEditTableSheet,
    setTableForEditing
  } = useContext(TableContext);
  const { selectedVenue } = useContext(AuthContext);

  // Toggle the specific area's state
  const toggleExpand = (areaId) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  // Handle area checkbox change
  const handleAreaSelection = (areaId, tables) => {
    const tableIds = tables.map((table) => table._id);

    setSelectedTables((prev) => {
      const isAreaSelected = tableIds.every((id) => prev.includes(id));

      if (isAreaSelected) {
        // If already selected, remove all the area's table IDs
        return prev.filter((id) => !tableIds.includes(id));
      } else {
        // Otherwise, add all the area's table IDs
        return [...new Set([...prev, ...tableIds])];
      }
    });
  };

  useEffect(() => {
    fetchAreaWithTables(selectedVenue?.venueId);
  }, [selectedVenue?.venueId]);

  return (
    <div>
      {areas.map((area, index) => {
        const isAreaSelected = area.tables.every((table) => selectedTables.includes(table._id));

        return (
          <div className="expandable-list my-2" key={index}>
            <div
              className="header"
              onClick={() => {
                toggleExpand(area._id);
              }}
            >
              <input
                type="checkbox"
                className="area-table-checkbox"
                checked={isAreaSelected}
                onChange={() => handleAreaSelection(area._id, area.tables)}
              />
              <span className="header-title">{area.areaName}</span>
              <span className={`arrow ${expandedAreas[area._id] ? "up" : "down"}`}>&#x25BC;</span>
            </div>
            {expandedAreas[area._id] && (
              <div className={`list-items`} ref={listRef}>
                <ul>
                  {area.tables.map((table, tableIndex) => (
                    <li key={tableIndex} className="list-item">
                      <div className="table-items-left">
                        <input
                          type="checkbox"
                          onChange={() => handleTableSelection(table._id)} // Handle selection
                          checked={selectedTables.includes(table._id)}
                        />
                        <span className="table-name">{table.tableName}</span>
                        <span className="table-people border p-1 rounded-lg">
                          &#x1F465;{table.minSeats} - {table.maxSeats}
                        </span>
                      </div>
                      <div className="table-items-right">
                        <button className="edit-button" onClick={()=>{setTableForEditing(table)}}>&#x270E;</button>
                        <button className="delete-button">&#x1F5D1;</button>
                      </div>
                    </li>
                  ))}
                </ul>

                <li className="list-item">
                  <span className="table-name" onClick={toggleAddTableSheet}>
                    Add Table
                  </span>
                </li>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableList;
